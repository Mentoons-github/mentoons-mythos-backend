export interface EmployeeLogin {
  employeeID: string;
  password: string;
}

export interface IEmployee {
  name: string;
  email: string;
  employeeID: number;
  password: string;
  assignedBy: string;
  role: "employee" | "admin";
  createdAt: Date;
}

export interface IEmployeeDocument extends IEmployee, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
