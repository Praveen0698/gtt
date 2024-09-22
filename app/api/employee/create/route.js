import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Employee from "../../../../models/Employee";
import fs from "fs";
import path from "path";

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

    // Handle file save (Base64 to file)
    let aadharFilePath = null;
    let dlFilePath = null;

    // Function to handle file saving
    const saveFile = (base64File, fileType) => {
      const base64Pattern = /^data:(.*?);base64,/; // Regex to extract MIME type
      const matches = base64File.match(base64Pattern);
      const mimeType = matches ? matches[1] : ""; // Get the MIME type

      let fileExtension = "png"; // Default extension
      if (mimeType.includes("pdf")) {
        fileExtension = "pdf"; // Set extension to PDF if MIME type is PDF
      } else if (mimeType.includes("image")) {
        fileExtension = mimeType.split("/")[1]; // Set to the appropriate image extension (png, jpg, etc.)
      }

      const base64Data = base64File.replace(base64Pattern, ""); // Remove the data URL part
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Create the 'uploads' directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the file with the appropriate extension
      const filename = `${Date.now()}_${fileType}.${fileExtension}`;
      const filePath = `/uploads/${filename}`;
      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);

      return filePath; // Return the file path
    };

    // Handle aadharFile
    if (aadharFile) {
      aadharFilePath = saveFile(aadharFile, "aadhar");
    }

    // Handle dlFile
    if (dlFile) {
      dlFilePath = saveFile(dlFile, "dl");
    }

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
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
