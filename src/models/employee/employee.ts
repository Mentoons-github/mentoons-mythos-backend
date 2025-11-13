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
      type: String,
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
    },
    role: {
      type: String,
      default: "employee",
    },
    designation: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

employeeSchema.pre("save", function (next) {
  if (!this.profileImage) {
    if (this.gender === "Male") {
      this.profileImage =
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    } else if (this.gender === "Female") {
      this.profileImage =
        "https://cdn-icons-png.flaticon.com/512/6997/6997662.png";
    } else {
      this.profileImage =
        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
    }
  }
  next();
});

// employeeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// employeeSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const Employee = mongoose.model<IEmployeeDocument, IEmployeeModel>(
  "Employee",
  employeeSchema
);

export default Employee;
