import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Project from "../../../../models/Project";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export async function PUT(req) {
  await connectDB();
  const projectData = await req.json();
  const {
    _id,
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
    let filePath = null;
    if (poFile) {
      const base64Pattern = /^data:(.*?);base64,/;
      const matches = poFile.match(base64Pattern);
      const mimeType = matches ? matches[1] : "";

      let fileExtension = "png";
      if (mimeType.includes("pdf")) {
        fileExtension = "pdf";
      } else if (mimeType.includes("image")) {
        fileExtension = mimeType.split("/")[1];
      }

      const base64Data = poFile.replace(base64Pattern, "");
      const buffer = Buffer.from(base64Data, "base64");
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}.${fileExtension}`;
      filePath = `/uploads/${filename}`;
      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);
    }
    const updateData = {
      projectName,
      poNumber,
      fleetSize,
      firmName,
      vehicle,
      source,
      destination,
      supervisor,
    };

    if (filePath) {
      updateData.poFile = filePath;
    }

    const updatedProject = await Project.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Firm updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
