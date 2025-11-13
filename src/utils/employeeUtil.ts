import nodemailer from "nodemailer";
import config from "../config/config";
import Employee from "../models/employee/employee";

//genrate employee id
export const generateEmployeeId = async (designation: string) => {
  if (!designation) throw new Error("Designation is required");

  const code = designation.slice(0, 3).toUpperCase();

  const lastEmployee = await Employee.findOne({ designation })
    .sort({ createdAt: -1 })
    .select("employeeID");

  let nextNumber = 1;

  if (lastEmployee && lastEmployee.employeeID) {
    const match = lastEmployee.employeeID.match(/(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  const paddedNumber = String(nextNumber).padStart(3, "0");
  const employeeID = `EMP${code}${paddedNumber}`;
  return employeeID;
};

//genrate password
export const generateEmployeePassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

//send password to mail
export const sendPasswordToMail = async ({
  to,
  password,
  name,
}: {
  to: string;
  password: string;
  name: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Mentoons Mythos Admin" <${config.EMAIL_USER}>`,
    to,
    subject: "Your Employee Account Credentials 🔐",
    text: `Hello ${name},

Welcome to Mentoons Mythos!

Your employee account has been created successfully.

Here are your login credentials:
Email: ${to}
Password: ${password}

Please change your password after your first login.

Thank you,
Mentoons Mythos HR Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#4CAF50;">Welcome to Mentoons Mythos 🎉</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your employee account has been created successfully.</p>
        <p><b>Here are your login credentials:</b></p>
        <ul style="list-style: none; padding: 0;">
          <li><b>Email:</b> ${to}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p style="color: #555;">Please change your password after your first login for security reasons.</p>
        <p>— Mentoons Mythos HR Team</p>
      </div>
    `,
  });
};
