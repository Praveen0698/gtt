import connectDB from "../../../../../../utils/db";
import Fuel from "../../../../../../models/Fuel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  connectDB();

  const { vehicleNumber, date } = params;

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

    if (dataGot.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Fuel found in the first element", dataGot },
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
