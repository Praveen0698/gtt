import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Employee from "../../../../models/Employee";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
