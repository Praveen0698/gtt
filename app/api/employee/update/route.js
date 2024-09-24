import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Employee from "../../../../models/Employee";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export async function PUT(req) {
  await connectDB();
  const employeeData = await req.json();
  const {
    _id,
    employeeName,
    age,
    address,
    aadharNumber,
    aadharFile,
    dlNumber,
    dlFile,
    experience,
    designation,
  } = employeeData;

  try {
    let aadharFilePath = null;
    let dlFilePath = null;

    const saveFile = (base64File, fileType) => {
      const base64Pattern = /^data:(.*?);base64,/;
      const matches = base64File.match(base64Pattern);
      const mimeType = matches ? matches[1] : "";

      let fileExtension = "png";
      if (mimeType.includes("pdf")) {
        fileExtension = "pdf";
      } else if (mimeType.includes("image")) {
        fileExtension = mimeType.split("/")[1];
      }

      const base64Data = base64File.replace(base64Pattern, "");
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}_${fileType}.${fileExtension}`;
      const filePath = `/uploads/${filename}`;
      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);

      return filePath;
    };

    if (aadharFile) {
      aadharFilePath = saveFile(aadharFile, "aadhar");
    }

    if (dlFile) {
      dlFilePath = saveFile(dlFile, "dl");
    }

    const updateData = {
      employeeName,
      age,
      address,
      aadharNumber,
      dlNumber,
      experience,
      designation,
    };

    // Only include poFile in the update payload if it's not null
    if (aadharFilePath) {
      updateData.aadharFile = aadharFilePath;
    } else if (dlFilePath) {
      updateData.dlFile = dlFilePath;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Firm updated successfully", Employee: updatedEmployee },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
