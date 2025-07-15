import axios from "axios";
import config from "../config/config";
import CustomError from "../utils/customError";

interface GetSignParams {
  datetime: string;
  latitude: number;
  longitude: number;
  token: string;
}

interface SignResponse {
  sunSign: string;
  moonSign: string;
}

let token = "";
let expiresAt = 0;

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

export const getSunAndMoonSign = async ({
  datetime,
  latitude,
  longitude,
  token,
}: GetSignParams): Promise<SignResponse> => {
  try {
  } catch (error) {
    console.log(error);
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(datetime)) {
    throw new Error(
      "Invalid datetime format. Expected: YYYY-MM-DDTHH:mm:ss+HH:mm"
    );
  }

  // Validate latitude and longitude
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Invalid coordinates");
  }

  const url = `https://api.prokerala.com/v2/astrology/kundli?ayanamsa=1&datetime=${encodeURIComponent(
    datetime
  )}&coordinates=${latitude},${longitude}`;
  console.log("Prokerala API URL:", url);

  const response = await axios.get(url, { headers });

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
    sunSign: nakshatraDetails.soorya_rasi.name,
    moonSign: nakshatraDetails.chandra_rasi.name,
  };
};
