import uploadFile from "../services/s3FileUpload";
import catchAsync from "../utils/cathAsync";
import CustomError from "../utils/customError";

export const fileUpload = catchAsync(async (req, res) => {
  const { category } = req.body;
  const userId = req?.user?._id || "sample";

  const files = req.files as Express.Multer.File[];

  if (!category )
    throw new CustomError("Category is empty", 400);

  if (!files || files.length === 0)
    throw new CustomError("no file found to upload", 400);

  if (category === "profile" && files.length > 1) {
    throw new CustomError("Only one profile image is allowed", 400);
  }

  const uploadedFiles: any[] = [];

  console.log("uploading");
  for (const file of files) {
    const uploaded = await uploadFile(
      file.buffer,
      userId,
      category,
      // folder,
      file.mimetype,
      file.originalname
    );
    uploadedFiles.push(uploaded);
  }

  console.log("uploaded files ===============>", uploadedFiles);

  res.status(200).json({ success: true, uploaded: uploadedFiles });
});
