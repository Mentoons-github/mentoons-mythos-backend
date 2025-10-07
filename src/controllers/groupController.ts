import catchAsync from "../utils/cathAsync";
import * as GroupService from "../services/groupService";

//rashi members
export const getRashiGroupMembers = catchAsync(async (req, res) => {
  const { rashi } = req.params;
  const users = await GroupService.getRashiGroupMembers(rashi);
  res
    .status(200)
    .json({ message: `Successfully fetched ${rashi} members`, users });
});

//intelligence members
export const getIntelligenceGroupMembers = catchAsync(async (req, res) => {
  const { intelligence } = req.params;
  const users = await GroupService.getIntelligenceGroupMembers(intelligence);
  res
    .status(200)
    .json({ message: `Successfully fetched ${intelligence} members`, users });
});
