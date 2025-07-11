import axios from "axios";
import config from "../config/config";

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

export const getAccessToken = async () => {
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const sunRes = await axios.post(
    "https://api.prokerala.com/v2/astrology/sun-sign",
    { datetime, latitude, longitude },
    { headers }
  );

  const moonRes = await axios.post(
    "https://api.prokerala.com/v2/astrology/moon-sign",
    { datetime, latitude, longitude },
    { headers }
  );

  return {
    sunSign: sunRes.data.data.sign,
    moonSign: moonRes.data.data.sign,
  };
};
