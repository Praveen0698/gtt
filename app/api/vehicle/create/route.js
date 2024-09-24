import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Vehicle from "../../../../models/Vehicle";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  const vehicleData = await req.json();
  const {
    vehicleNumber,
    brand,
    model,
    rc,
    rcFile,
    insurance,
    insuranceFile,
    fitness,
    fitnessFile,
    pollution,
    pollutionFile,
    roadTax,
    roadTaxFile,
    odometer,
    vehiclePass,
    vehiclePassFile,
    otherFile,
  } = vehicleData;

  try {
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return NextResponse.json({ message: "Vehicle already exists" });
    }

    const saveBase64File = (base64String, folder) => {
      const base64Pattern = /^data:(.*?);base64,/;
      const matches = base64String.match(base64Pattern);
      const mimeType = matches ? matches[1] : "";

      let fileExtension = "png";
      if (mimeType.includes("pdf")) {
        fileExtension = "pdf";
      } else if (mimeType.includes("image")) {
        fileExtension = mimeType.split("/")[1];
      }

      const base64Data = base64String.replace(base64Pattern, "");
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}.${fileExtension}`;
      const filePath = `/uploads/${folder}/${filename}`;
      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);

      return filePath;
    };

    let rcFilePath = rcFile ? saveBase64File(rcFile, "rc") : null;
    let insuranceFilePath = insuranceFile
      ? saveBase64File(insuranceFile, "insurance")
      : null;
    let fitnessFilePath = fitnessFile
      ? saveBase64File(fitnessFile, "fitness")
      : null;
    let pollutionFilePath = pollutionFile
      ? saveBase64File(pollutionFile, "pollution")
      : null;
    let roadTaxFilePath = roadTaxFile
      ? saveBase64File(roadTaxFile, "roadTax")
      : null;
    let vehiclePassFilePath = vehiclePassFile
      ? saveBase64File(vehiclePassFile, "vehiclePass")
      : null;
    let otherFilePath = otherFile ? saveBase64File(otherFile, "other") : null;

    const newVehicle = new Vehicle({
      vehicleNumber,
      brand,
      model,
      rc,
      rcFile: rcFilePath,
      insurance,
      insuranceFile: insuranceFilePath,
      fitness,
      fitnessFile: fitnessFilePath,
      pollution,
      pollutionFile: pollutionFilePath,
      roadTax,
      roadTaxFile: roadTaxFilePath,
      odometer,
      vehiclePass,
      vehiclePassFile: vehiclePassFilePath,
      otherFile: otherFilePath,
    });

    await newVehicle.save();
    return NextResponse.json(
      { message: "Vehicle created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
