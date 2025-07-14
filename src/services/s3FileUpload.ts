import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../utils/s3Client";
import { v4 as uuid } from "uuid";

interface UploadResult {
  url: string;
  key: string;
  originalName: string;
  mimetype: string;
  uploadedAt: string;
  userId: string;
  fileSize: number;
}

const uploadFile = async (
  fileBuffer: Buffer,
  userId: string,
  category: string,
  // folder: string,
  mimetype: string,
  originalname: string
): Promise<UploadResult> => {
  try {
    const fileExtension = originalname.split(".").pop();
    const uniqueFileName = `${uuid()}.${fileExtension}`;
    const key = `${category}/${userId}/${Date.now()}-${uniqueFileName}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
      Metadata: {
        userId: String(userId),
        originalFileName: originalname,
        uploadTimestamp: Date.now().toString(),
      },
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      url: fileUrl,
      key,
      originalName: originalname,
      mimetype,
      uploadedAt: new Date().toISOString(),
      userId,
      fileSize: fileBuffer.length,
    };
  } catch (error: any) {
    console.error("Detailed S3 Upload Error:", {
      message: error.message,
      code: error.name,
      userId,
      originalName: originalname,
    });

    throw new Error(`S3 Upload Failed: ${error.message}`);
  }
};

export default uploadFile;
