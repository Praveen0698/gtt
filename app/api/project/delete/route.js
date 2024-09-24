import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Project from "../../../../models/Project";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
