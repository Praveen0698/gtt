import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Vehicle from "../../../../models/Vehicle";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export async function PUT(req) {
  await connectDB();

  const vehicleData = await req.json();
  const {
    _id,
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
    const handleFileUpload = (fileData, folderName) => {
      if (fileData) {
        const base64Pattern = /^data:(.*?);base64,/;
        const matches = fileData.match(base64Pattern);
        const mimeType = matches ? matches[1] : "";

        let fileExtension = "png";
        if (mimeType.includes("pdf")) {
          fileExtension = "pdf";
        } else if (mimeType.includes("image")) {
          fileExtension = mimeType.split("/")[1];
        }

        const base64Data = fileData.replace(base64Pattern, "");
        const buffer = Buffer.from(base64Data, "base64");
        const uploadDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          folderName
        );

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${Date.now()}.${fileExtension}`;
        const filePath = `/uploads/${folderName}/${filename}`;
        const fullPath = path.join(uploadDir, filename);
        fs.writeFileSync(fullPath, buffer);

        return filePath;
      }
      return null;
    };

    // Handle file uploads
    const updatedRcFile = handleFileUpload(rcFile, "rc");
    const updatedInsuranceFile = handleFileUpload(insuranceFile, "insurance");
    const updatedFitnessFile = handleFileUpload(fitnessFile, "fitness");
    const updatedPollutionFile = handleFileUpload(pollutionFile, "pollution");
    const updatedRoadTaxFile = handleFileUpload(roadTaxFile, "roadTax");
    const updatedVehiclePassFile = handleFileUpload(
      vehiclePassFile,
      "vehiclePass"
    );
    const updatedOtherFile = handleFileUpload(otherFile, "other");

    // Prepare the update data
    const updateData = {
      vehicleNumber,
      brand,
      model,
      rc,
      insurance,
      fitness,
      pollution,
      roadTax,
      odometer,
      vehiclePass,
    };

    if (updatedRcFile) updateData.rcFile = updatedRcFile;
    if (updatedInsuranceFile) updateData.insuranceFile = updatedInsuranceFile;
    if (updatedFitnessFile) updateData.fitnessFile = updatedFitnessFile;
    if (updatedPollutionFile) updateData.pollutionFile = updatedPollutionFile;
    if (updatedRoadTaxFile) updateData.roadTaxFile = updatedRoadTaxFile;
    if (updatedVehiclePassFile)
      updateData.vehiclePassFile = updatedVehiclePassFile;
    if (updatedOtherFile) updateData.otherFile = updatedOtherFile;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Vehicle updated successfully", vehicle: updatedVehicle },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while updating vehicle:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
