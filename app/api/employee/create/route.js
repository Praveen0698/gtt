// import { NextResponse } from "next/server";
// import connectDB from "../../../../utils/db";
// import Employee from "../../../../models/Employee";
// import fs from "fs";
// import path from "path";
// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   await connectDB();

//   const EmployeeData = await req.json();
//   const {
//     employeeName,
//     age,
//     address,
//     aadharNumber,
//     aadharFile,
//     dlNumber,
//     dlFile,
//     experience,
//     designation,
//   } = EmployeeData;

//   try {
//     const existingEmployee = await Employee.findOne({ employeeName });
//     if (existingEmployee) {
//       return NextResponse.json({ message: "exists" });
//     }

//     const saveBase64File = (base64String, folder) => {
//       const base64Pattern = /^data:(.*?);base64,/;
//       const matches = base64String.match(base64Pattern);
//       const mimeType = matches ? matches[1] : "";

//       let fileExtension = "png";
//       if (mimeType.includes("pdf")) {
//         fileExtension = "pdf";
//       } else if (mimeType.includes("image")) {
//         fileExtension = mimeType.split("/")[1];
//       }

//       const base64Data = base64String.replace(base64Pattern, "");
//       const buffer = Buffer.from(base64Data, "base64");
//       const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       const filename = `${Date.now()}.${fileExtension}`;
//       const filePath = `/uploads/${folder}/${filename}`;
//       const fullPath = path.join(uploadDir, filename);
//       fs.writeFileSync(fullPath, buffer);

//       return filePath;
//     };

//     let aadharFilePath = aadharFile
//       ? saveBase64File(aadharFile, "aadhar")
//       : null;
//     let dlFilePath = dlFile ? saveBase64File(dlFile, "dl") : null;

//     const newEmployee = new Employee({
//       employeeName,
//       age,
//       address,
//       aadharNumber,
//       aadharFile: aadharFilePath,
//       dlNumber,
//       dlFile: dlFilePath,
//       experience,
//       designation,
//       expenses: [],
//     });

//     await newEmployee.save();
//     return NextResponse.json(
//       { message: "Employee created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return NextResponse.json({ message: error }, { status: 500 });
//   }
// }

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
      return NextResponse.json({ message: "Employee already exists" });
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

      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}.${fileExtension}`;
      const filePath = `/uploads/${folder}/${filename}`;
      const fullPath = path.join(uploadDir, filename);

      // Try to save the file
      try {
        fs.writeFileSync(fullPath, buffer);
      } catch (fileError) {
        console.error("File write error:", fileError);
        throw new Error("Failed to save file");
      }

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
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import connectDB from "../../../../utils/db";
// import Employee from "../../../../models/Employee";
// import cloudinary from "cloudinary";

// // Initialize Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   await connectDB();

//   const EmployeeData = await req.json();
//   const {
//     employeeName,
//     age,
//     address,
//     aadharNumber,
//     aadharFile,
//     dlNumber,
//     dlFile,
//     experience,
//     designation,
//   } = EmployeeData;

//   try {
//     const existingEmployee = await Employee.findOne({ employeeName });
//     if (existingEmployee) {
//       return NextResponse.json({ message: "Employee already exists" });
//     }

//     const uploadToCloudinary = async (base64String) => {
//       try {
//         // Upload file to Cloudinary, explicitly setting the resource_type to "auto"
//         const result = await cloudinary.v2.uploader.upload(base64String, {
//           folder: "uploads", // Cloudinary folder
//           resource_type: "auto", // Ensure Cloudinary accepts PDFs and other non-image types
//         });
//         return result.secure_url; // Return the uploaded file's URL
//       } catch (error) {
//         console.error("Cloudinary upload error:", error);
//         throw new Error("Failed to upload to Cloudinary");
//       }
//     };

//     // Upload the Aadhar and DL files to Cloudinary
//     let aadharFilePath = aadharFile
//       ? await uploadToCloudinary(aadharFile)
//       : null;
//     let dlFilePath = dlFile ? await uploadToCloudinary(dlFile) : null;

//     // Create a new employee document
//     const newEmployee = new Employee({
//       employeeName,
//       age,
//       address,
//       aadharNumber,
//       aadharFile: aadharFilePath,
//       dlNumber,
//       dlFile: dlFilePath,
//       experience,
//       designation,
//       expenses: [],
//     });

//     await newEmployee.save();
//     return NextResponse.json(
//       { message: "Employee created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return NextResponse.json(
//       { message: error.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }
