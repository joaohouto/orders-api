import { prisma } from "@/prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mime from "mime";

type Params = {
  file: Express.Multer.File;
  uploadedById: string;
  storeId?: string;
  productId?: string;
};

const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.SUPABASE_S3_ENDPOINT!,
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileUsecase({
  file,
  uploadedById,
  storeId,
  productId,
}: Params) {
  const fileExtension = mime.getExtension(file.mimetype);
  const fileName = `${randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  await s3.send(command);

  const url = `${process.env.SUPABASE_S3_ENDPOINT?.replace(
    "/s3",
    ""
  )}/object/public/${process.env.AWS_S3_BUCKET}//${fileName}`;

  const createdFile = await prisma.file.create({
    data: {
      key: fileName,
      url,
      uploadedById,
      storeId,
      productId,
    },
  });

  return createdFile;
}
