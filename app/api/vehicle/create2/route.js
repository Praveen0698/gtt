import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Vehicle from "@/models/Vehicle";

export async function POST(request) {
  await connectDB();
  const vehicleData = await request.json();
  const { vehicleNumber } = vehicleData; // Identify the vehicle by vehicleNumber

  try {
    const vehicle = await Vehicle.findOne({ vehicleNumber });
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Update the vehicle with part2 data
    Object.assign(vehicle, vehicleData);
    await vehicle.save();

    return NextResponse.json(
      { message: "Vehicle part2 saved" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
