import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    rc: { type: String, required: true },
    rcFile: { type: String },
    insurance: { type: String, required: true },
    insuranceFile: { type: String },
    fitness: { type: String, required: true },
    fitnessFile: { type: String },
    pollution: { type: String, required: true },
    pollutionFile: { type: String },
    roadTax: { type: String, required: true },
    roadTaxFile: { type: String },
    odometer: { type: String, required: true },
    vehiclePass: { type: String },
    vehiclePassFile: { type: String },
    otherFile: { type: String },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
