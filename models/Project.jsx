import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    poNumber: { type: String, required: true },
    poFile: { type: String },
    fleetSize: { type: String },
    firmName: { type: String, required: true },
    vehicle: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    supervisor: { type: String, required: true },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
