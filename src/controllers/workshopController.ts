import catchAsync from "../utils/cathAsync";
import * as WorkshopService from "../services/workshopService";

//create workshop
export const addWorkshop = catchAsync(async (req, res) => {
  const workshop = await WorkshopService.addWorkshop(req.body);
  res
    .status(201)
    .json({ success: true, message: "New workshop added", workshop });
});

//get workshops
export const getWorkshops = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 0;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";

  const workshops = await WorkshopService.getWorkshops(
    limit,
    page,
    sort,
    search
  );

  res
    .status(200)
    .json({
      success: true,
      message: "Workshop successfully fetched",
      ...workshops,
    });
});

//registe workshop
export const registeWorkshop = catchAsync(async (req, res) => {
  const { workshopId } = req.params;
  const workshopDetails = await WorkshopService.registeWorkshop(
    req.body,
    workshopId
  );
  res.status(201).json({
    success: true,
    message: "Worshop registration successfull",
    workshopDetails,
  });
});

//get enquiries
export const getEnquiries = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 0;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const applications = await WorkshopService.getEnquiries(
    page,
    limit,
    sort,
    search
  );
  res
    .status(200)
    .json({ message: "Equiries fetched", success: true, ...applications });
});

//workshop count
export const fetchWorkshopCount = catchAsync(async (req, res) => {
  const count = await WorkshopService.fetchWorkshopCount();
  res.status(200).json({ message: "Workshop count fetched", count });
});

//get single workshop
export const getSingleWorkshop = catchAsync(async (req, res) => {
  const workshop = await WorkshopService.getSingleWorkshop(req.params.workshopId);
  res.status(200).json({
    success: true,
    message: "Single Workshop details fetched",
    workshop,
  });
});

//delete workshop
export const deleteWorkshop = catchAsync(async (req, res) => {
  await WorkshopService.deleteWorkshop(req.params.workshopId);
  res
    .status(200)
    .json({ success: true, message: "Workshop Successfully deleted" });
});

//edit workshop
export const updateWorkshop = catchAsync(async(req,res) => {
  const {workshopId} = req.params
  const editedWorkshop = await WorkshopService.updateWorkshop(req.body,workshopId)
  res.status(200).json({success:true, message:"Workshop successfully updated", editedWorkshop})
})

//enquiry count
export const fetchEnquiryCount = catchAsync(async (req, res) => {
  const count = await WorkshopService.fetchEnquiryCount();
  res.status(200).json({ message: "Enquiry count fetched", count });
});

//get single enquiry
export const getEnquiryById = catchAsync(async (req, res) => {
  const enquiry = await WorkshopService.getEnquiryById(req.params.enquiryId);
  res.status(200).json({
    success: true,
    message: "Single enquiry details fetched",
    enquiry,
  });
});

//delete enquiry
export const deleteEnquiry = catchAsync(async (req, res) => {
  await WorkshopService.deleteEnquiry(req.params.enquiryId);
  res
    .status(200)
    .json({ success: true, message: "Enquiry Successfully deleted" });
});

