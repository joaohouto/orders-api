import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mime from "mime";

const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.SUPABASE_S3_ENDPOINT!,
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(file: Express.Multer.File) {
  const fileExtension = mime.getExtension(file.mimetype);
  const fileName = `${randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // opcional, só se quiser que fique público direto
  });

  await s3.send(command);

  const fileUrl = `${process.env.SUPABASE_S3_ENDPOINT?.replace(
    "/s3",
    ""
  )}/object/public/${process.env.AWS_S3_BUCKET}//${fileName}`;

  return fileUrl;
}
