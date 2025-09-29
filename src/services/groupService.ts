import User from "../models/userModel";
import CustomError from "../utils/customError";

// rashi members
export const getRashiGroupMembers = async (rashi: string) => {
  if (!rashi) throw new CustomError("Please enter a rashi", 400);
  const users = await User.find({
    $or: [
      { "astrologyDetail.moonSign": rashi },
      { "astrologyDetail.sunSign": rashi },
    ],
  }).select("profilePicture firstName lastName");
  return users;
};

//intelligence members
export const getIntelligenceGroupMembers = async (intelligence: string) => {
  if (!intelligence) throw new CustomError("Please enter a intelligence", 400);
  const users = await User.find({ intelligenceTypes: intelligence }).select(
    "profilePicture firstName lastName"
  );
  return users;
};
