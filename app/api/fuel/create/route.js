import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Fuel from "../../../../models/Fuel";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const fuelData = await req.json();
    const { projectId, projectName, employeeId, date, items } = fuelData;

    // Function to upload base64 files to S3
    const uploadToS3 = async (base64String, folder) => {
      const base64Pattern = /^data:(.*?);base64,/;
      const matches = base64String.match(base64Pattern);
      const mimeType = matches ? matches[1] : "";
      const fileExtension = mimeType.split("/")[1] || "png";
      const buffer = Buffer.from(
        base64String.replace(base64Pattern, ""),
        "base64"
      );

      const filename = `${Date.now()}.${fileExtension}`;
      const key = `${folder}/${filename}`; // Path inside the S3 bucket

      try {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        });

        await s3.send(command);

        // Return the public S3 URL
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      } catch (error) {
        console.error("S3 upload error:", error);
        throw new Error("Failed to upload file to S3");
      }
    };

    // Process the items and upload files to S3
    const processedItems = await Promise.all(
      items.map(async (item) => ({
        ...item,
        odometerFile: item.odometerFile
          ? await uploadToS3(item.odometerFile, "odometerFiles")
          : null,
        amountFile: item.amountFile
          ? await uploadToS3(item.amountFile, "amountFiles")
          : null,
      }))
    );

    // Create new fuel record
    const newFuel = new Fuel({
      projectId,
      projectName,
      employeeId,
      date,
      items: processedItems,
    });

    await newFuel.save();

    return NextResponse.json(
      { message: "Fuel record created successfully", newFuel },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating fuel record:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
