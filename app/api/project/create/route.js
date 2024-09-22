import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Project from "../../../../models/Project";
import fs from "fs";
import path from "path";

export async function POST(req) {
  await connectDB();

  const projectData = await req.json();
  const {
    projectName,
    poNumber,
    poFile,
    fleetSize,
    firmName,
    vehicle,
    source,
    destination,
    supervisor,
  } = projectData;

  try {
    const existingProject = await Project.findOne({ projectName });
    if (existingProject) {
      return NextResponse.json({ message: "exists" });
    }

    // Handle file save (Base64 to file)
    let filePath = null;
    if (poFile) {
      const base64Pattern = /^data:(.*?);base64,/; // Regex to extract MIME type
      const matches = poFile.match(base64Pattern);
      const mimeType = matches ? matches[1] : ""; // Get the MIME type

      let fileExtension = "png"; // Default extension
      if (mimeType.includes("pdf")) {
        fileExtension = "pdf"; // Set extension to PDF if MIME type is PDF
      } else if (mimeType.includes("image")) {
        fileExtension = mimeType.split("/")[1]; // Set to the appropriate image extension (png, jpg, etc.)
      }

      const base64Data = poFile.replace(base64Pattern, ""); // Remove the data URL part
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Create the 'uploads' directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the file with the appropriate extension
      const filename = `${Date.now()}.${fileExtension}`;
      filePath = `/uploads/${filename}`;
      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);
    }

    const newProject = new Project({
      projectName,
      poNumber,
      poFile: filePath,
      fleetSize,
      firmName,
      vehicle,
      source,
      destination,
      supervisor,
    });

    await newProject.save();
    return NextResponse.json(
      { message: "Project created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
