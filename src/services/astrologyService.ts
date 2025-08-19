import axios from "axios";
import config from "../config/config";
import CustomError from "../utils/customError";
import User from "../models/userModel";

interface GetSignParams {
  datetime: string;
  latitude: number;
  longitude: number;
  token: string;
}

interface Rasi {
  id: number;
  name: string;
  lord: {
    id: number;
    name: string;
    vedic_name: string;
  };
}

interface Nakshatra {
  id: number;
  name: string;
  lord: { id: number; name: string; vedic_name: string };
  pada: number;
}

interface SignResponse {
  sunSign: Rasi;
  moonSign: Rasi;
  report: any;
  nakshatra: Nakshatra;
  zodiac: string;
}

let token = "";
let expiresAt = 0;

//get rashi accessToken
export const getAstroAccessToken = async () => {
  if (token && Date.now() < expiresAt) return token;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", config.PROKERALA_CLIENT_ID!);
  params.append("client_secret", config.PROKERALA_CLIENT_SECRET!);

  const { data } = await axios.post("https://api.prokerala.com/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  token = data.access_token;
  expiresAt = Date.now() + data.expires_in * 1000;

  return token;
};

//get rashi
export const getSunAndMoonSign = async ({
  datetime,
  latitude,
  longitude,
  token,
}: GetSignParams): Promise<SignResponse> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(datetime)) {
    throw new Error(
      "Invalid datetime format. Expected: YYYY-MM-DDTHH:mm:ss+HH:mm"
    );
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Invalid coordinates");
  }

  const url = `https://api.prokerala.com/v2/astrology/kundli?ayanamsa=1&datetime=${encodeURIComponent(
    datetime
  )}&coordinates=${latitude},${longitude}`;
  console.log("Prokerala API URL:", url);

  const response = await axios.get(url, { headers });

  console.log(
    "response from prokerala api : ",
    response.data.data.nakshatra_details
  );

  const nakshatraDetails = response.data.data.nakshatra_details;
  if (
    !nakshatraDetails?.zodiac?.name ||
    !nakshatraDetails?.chandra_rasi?.name
  ) {
    throw new CustomError(
      "Invalid API response: Missing zodiac or chandra_rasi data",
      400
    );
  }

  return {
    sunSign: nakshatraDetails.soorya_rasi,
    moonSign: nakshatraDetails.chandra_rasi,
    report: nakshatraDetails.additional_info,
    nakshatra: nakshatraDetails.nakshatra,
    zodiac: nakshatraDetails.zodiac.name,
  };
};

export const userHasRashi = async (userId: string): Promise<boolean> => {
  const hasRashi = await User.findOne({
    _id: userId,
    $or: [
      { "astrologyDetail.moonSign": { $exists: true, $ne: null } },
      { "astrologyDetail.sunSign": { $exists: true, $ne: null } },
    ],
  });

  return Boolean(hasRashi);
};
