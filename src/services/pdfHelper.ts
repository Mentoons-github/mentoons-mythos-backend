import fs from "fs";
import puppeteer from "puppeteer";
import { AstroReport, AstroSchema } from "../interfaces/userInterface";

interface Lord {
  id: number;
  name: string;
  vedic_name: string;
}

interface ChandraRasi {
  id: number;
  name: string;
  lord: Lord;
}

interface Nakshatra {
  id: number;
  name: string;
  lord: Lord;
  pada: number;
}

interface Zodiac {
  id: number;
  name: string;
}

interface AdditionalInfo {
  deity: string;
  ganam: string;
  symbol: string;
  animal_sign: string;
  nadi: string;
  color: string;
  best_direction: string;
  syllables: string;
  birth_stone: string;
  gender: string;
  planet: string;
  enemy_yoni: string;
}

interface AstrologyReport {
  nakshatra?: Nakshatra;
  chandra_rasi?: ChandraRasi;
  soorya_rasi?: { id: number; name: string; lord: Lord };
  zodiac?: Zodiac;
  additional_info?: AdditionalInfo;
}

interface ReportData {
  generated_date: string;
  rasi_name: string;
  lord_name: string;
  lord_vedic_name: string;
  nakshatra_name: string;
  nakshatra_pada: number;
  nakshatra_lord_name: string;
  nakshatra_lord_vedic_name: string;
  deity: string;
  symbol: string;
  animal_sign: string;
  birth_stone: string;
  color: string;
  best_direction: string;
  ganam: string;
  nadi: string;
  gender: string;
  planet: string;
  enemy_yoni: string;
  syllables_html: string;
  zodiac_name: string;
}

const populateTemplate = (templatePath: string, data: ReportData): string => {
  try {
    let template = fs.readFileSync(templatePath, "utf8");
    for (const [key, value] of Object.entries(data)) {
      template = template.replace(`{{${key}}}`, value.toString());
    }
    return template;
  } catch (error) {
    throw new Error(`Failed to populate template: ${(error as Error).message}`);
  }
};

const generatePDF = async (
  htmlContent: string,
  pdfPath: string
): Promise<void> => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      printBackground: true,
    });
    await browser.close();
  } catch (error) {
    throw new Error(`Failed to generate PDF: ${(error as Error).message}`);
  }
};

const prepareReportData = (
  report: AstroSchema,
  rashi: "moon" | "sun"
): ReportData => {
  console.log(report);

  if (!report.nakshatra || !report.zodiac || !report.report) {
    throw new Error("Incomplete astrology report data");
  }

  // Set rasi name based on rashi type
  const rasiName = rashi === "moon" ? "Chandra rasi" : "Surya rasi";

  return {
    generated_date: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),

    rasi_name: rasiName || "Unknown",
    lord_name: report.rasi.lord.name || "Unknown",
    lord_vedic_name: report.rasi.lord.vedic_name || "Unknown",
    nakshatra_name: report.nakshatra.name || "Unknown",
    nakshatra_pada: report.nakshatra.pada || 0,
    nakshatra_lord_name: report.nakshatra.lord?.name || "Unknown",
    nakshatra_lord_vedic_name: report.nakshatra.lord?.vedic_name || "Unknown",
    deity: report.report.deity || "Unknown",
    symbol: report.report.symbol || "Unknown",
    animal_sign: report.report.animal_sign || "Unknown",
    birth_stone: report.report.birth_stone || "Unknown",
    color: report.report.color || "Unknown",
    best_direction: report.report.best_direction || "Unknown",
    ganam: report.report.ganam || "Unknown",
    nadi: report.report.nadi || "Unknown",
    gender: report.report.gender || "Unknown",
    planet: report.report.planet || "Unknown",
    enemy_yoni: report.report.enemy_yoni || "Unknown",
    syllables_html: report.report.syllables
      ? report.report.syllables
          .split(", ")
          .map(
            (syllable: string) => `<span class="syllable">${syllable}</span>`
          )
          .join("")
      : "",

    zodiac_name: report.zodiac || "Unknown",
  } as ReportData;
};

export { populateTemplate, generatePDF, prepareReportData };
