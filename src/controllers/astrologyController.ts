import axios from "axios";
import catchAsync from "../utils/cathAsync";
import {
  getAccessToken,
  getSunAndMoonSign,
} from "../services/astrologyService";

export const getAstroDetails = catchAsync(async (req, res) => {
  const { datetime, latitude, longitude } = req.body;

  try {
    const token = await getAccessToken();

    const { sunSign, moonSign } = await getSunAndMoonSign({
      datetime,
      latitude,
      longitude,
      token,
    });

    res.json({
      sunSign,
      moonSign,
    });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Astrology API failed" });
  }
});
