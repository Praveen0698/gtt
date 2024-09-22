import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

const employeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    aadharFile: {
      type: String,
      required: true,
    },
    dlNumber: {
      type: String,
      required: true,
      unique: true,
    },
    dlFile: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
