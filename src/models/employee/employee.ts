import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import { IEmployeeDocument } from "../../interfaces/employee";

export interface IEmployeeModel extends Model<IEmployeeDocument> {}

const employeeSchema = new mongoose.Schema<IEmployeeDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    employeeID: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    assignedBy: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Employee = mongoose.model<IEmployeeDocument, IEmployeeModel>(
  "Employee",
  employeeSchema
);

export default Employee;
