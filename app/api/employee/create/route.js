import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Employee from "../../../../models/Employee";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  const EmployeeData = await req.json();
  const {
    employeeName,
    age,
    address,
    aadharNumber,
    aadharFile,
    dlNumber,
    dlFile,
    experience,
    designation,
  } = EmployeeData;

  try {
    const existingEmployee = await Employee.findOne({ employeeName });
    if (existingEmployee) {
      return NextResponse.json({ message: "exists" });
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

    let aadharFilePath = aadharFile
      ? saveBase64File(aadharFile, "aadhar")
      : null;
    let dlFilePath = dlFile ? saveBase64File(dlFile, "dl") : null;

    const newEmployee = new Employee({
      employeeName,
      age,
      address,
      aadharNumber,
      aadharFile: aadharFilePath,
      dlNumber,
      dlFile: dlFilePath,
      experience,
      designation,
      expenses: [],
    });

    await newEmployee.save();
    return NextResponse.json(
      { message: "Employee created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
