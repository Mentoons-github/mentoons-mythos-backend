import catchAsync from "../utils/cathAsync";
import fs from "fs";
import {
  getAstroAccessToken,
  getSunAndMoonSign,
  userHasRashi,
} from "../services/astrologyService";
import { userExist, UserUpdate } from "../services/userService";
import User from "../models/userModel";
import {
  generatePDF,
  populateTemplate,
  prepareReportData,
} from "../services/pdfHelper";
type SignType = "moon" | "sun";

export const getAstroDetails = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await userExist(userId);

  if (
    !user.dateOfBirth ||
    !user.timeOfBirth ||
    !user.latitude ||
    !user.longitude
  ) {
    return res.status(400).json({ message: "Incomplete user birth details" });
  }

  const date = new Date(user.dateOfBirth).toISOString().split("T")[0];
  const datetime = `${date}T${user.timeOfBirth}:00+05:30`;

  try {
    const token = await getAstroAccessToken();

    const { sunSign, moonSign, report } = await getSunAndMoonSign({
      datetime,
      latitude: Number(user.latitude),
      longitude: Number(user.longitude),
      token,
    });

    res
      .status(200)
      .json({ sunSign: sunSign.name, moonSign: moonSign.name, report });
  } catch (err: any) {
    console.error(
      "Astrology API error:",
      err.response?.data || err.message || err
    );
    next(err);
  }
});

export const upsertZodiac = catchAsync(async (req, res) => {
  const data = req.body;
  const { type, ...astroData } = data;
  const userId = req.user._id;

  const user = await userExist(userId);

  const normalizeDate = (val: any) => (val ? new Date(val) : null);
  const isDifferent = (oldVal: any, newVal: any) => {
    if (oldVal instanceof Date || newVal instanceof Date) {
      return (
        normalizeDate(oldVal)?.getTime() !== normalizeDate(newVal)?.getTime()
      );
    }
    return oldVal !== newVal;
  };

  const hasChanged =
    isDifferent(user.dateOfBirth, astroData.dateOfBirth) ||
    isDifferent(user.timeOfBirth, astroData.timeOfBirth) ||
    isDifferent(user.longitude, astroData.longitude) ||
    isDifferent(user.latitude, astroData.latitude);

  if (!hasChanged) {
    return res.status(304).json({ message: "No data changed" });
  }

  await UserUpdate({
    details: { astrologyReports: { sun: null, moon: null } },
    userId,
  });

  const { user: updatedUser } = await UserUpdate({
    details: astroData,
    userId,
  });

  const date = new Date(updatedUser.dateOfBirth!).toISOString().split("T")[0];
  const datetime = `${date}T${updatedUser.timeOfBirth}:00+05:30`;

  const token = await getAstroAccessToken();
  const { sunSign, moonSign, report, nakshatra, zodiac } =
    await getSunAndMoonSign({
      datetime,
      latitude: Number(updatedUser.latitude),
      longitude: Number(updatedUser.longitude),
      token,
    });

  const astrologyDetail: Record<string, string> = {};
  const astrologyReports: any = { ...updatedUser.astrologyReports };

  if (type === "zodiac") {
    astrologyDetail.sunSign = sunSign.name;
    astrologyReports.sun = {
      rasi: sunSign,
      report,
      nakshatra,
      zodiac,
      lastGenerated: new Date(),
    };
  } else if (type === "lunar") {
    astrologyDetail.moonSign = moonSign.name;
    astrologyReports.moon = {
      rasi: moonSign,
      report,
      nakshatra,
      zodiac,
      lastGenerated: new Date(),
    };
  } else {
    astrologyDetail.sunSign = sunSign.name;
    astrologyDetail.moonSign = moonSign.name;
    astrologyReports.sun = {
      rasi: sunSign,
      report,
      nakshatra,
      zodiac,
      lastGenerated: new Date(),
    };
    astrologyReports.moon = {
      rasi: moonSign,
      report,
      nakshatra,
      zodiac,
      lastGenerated: new Date(),
    };
  }

  await UserUpdate({
    details: { astrologyDetail, astrologyReports },
    userId,
  });

  return res.status(200).json({
    ...(type === "zodiac" ? { sunSign } : {}),
    ...(type === "lunar" ? { moonSign } : {}),
    report,
    nakshatra,
    zodiac,
  });
});

export const checkRashiStatus = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const hasRashi = await userHasRashi(userId);
  if (hasRashi) {
    res.status(200).json(hasRashi);
  } else {
    res.status(401).json(hasRashi);
  }
});

const isSignType = (value: unknown): value is SignType => {
  return value === "moon" || value === "sun";
};

export const downloadReport = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { signType } = req.query;

  console.log(
    `📥 Download request received for user: ${userId}, signType: ${signType}`
  );

  const user = await User.findById(userId);
  if (!user) {
    console.warn(`⚠️ User not found: ${userId}`);
    return res.status(404).json({ status: false, message: "User not found" });
  }
  console.log(`✅ User found: ${user.firstName || user._id}`);

  if (!isSignType(signType)) {
    console.warn(`⚠️ Invalid sign type received: ${signType}`);
    return res.status(400).json({
      status: false,
      message: "Invalid sign type. Use 'moon' or 'sun'.",
    });
  }
  console.log(`🔍 Sign type validated: ${signType}`);

  if (!user.astrologyReports?.[signType]?.report) {
    console.warn(
      `⚠️ No stored report for ${signType} sign for user: ${userId}`
    );
    return res.status(404).json({
      status: false,
      message: `No stored report found for ${signType} sign`,
    });
  }
  console.log(`📄 Report data found for ${signType} sign`);

  const report = user.astrologyReports[signType]!;
  const data = prepareReportData(report, signType);
  console.log("🛠 Prepared report data:", data);

  const templatePath: string = "src/templates/astro/report.html";
  console.log(`📂 Loading template from: ${templatePath}`);
  const populatedHtml: string = populateTemplate(templatePath, data);

  const pdfPath: string = `astrology-report-${userId}.pdf`;
  console.log(`🖨 Generating PDF: ${pdfPath}`);
  await generatePDF(populatedHtml, pdfPath);
  console.log("✅ PDF generated successfully");

  res.download(pdfPath, "astrology-report.pdf", (err: Error | null) => {
    if (err) {
      console.error(`❌ Error sending PDF to user: ${err.message}`);
      return res
        .status(500)
        .json({ status: false, message: "Error generating PDF" });
    }
    console.log(`📤 PDF sent to user: ${userId}, deleting temp file...`);
    fs.unlinkSync(pdfPath);
    console.log("🗑 Temporary PDF file deleted");
  });
});
