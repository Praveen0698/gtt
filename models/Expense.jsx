import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
