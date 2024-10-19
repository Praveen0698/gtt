import connectDB from "../../../../../../utils/db";
import Fuel from "../../../../../../models/Fuel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  connectDB();
  console.log(params);

  const { vehicleNumber, date } = params;

  if (!vehicleNumber || !date) {
    return res
      .status(400)
      .json({ message: "Vehicle number and date are required" });
  }

  try {
    const dataGot = await Fuel.aggregate(
      [
        {
          $search: {
            index: "default",
            text: {
              query: `${vehicleNumber},${date}`,
              path: { wildcard: "*" },
            },
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    );

    console.log(dataGot);
    // Query to find documents where the `items` array contains the vehicle number and matching date
    const results = await Fuel.find({
      date: date,
      // "items.vehicle": vehicleNumber, // Match vehicle number inside the nested array
    });

    console.log(results);

    if (results.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Fuel found in the first element", data: results.items },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
