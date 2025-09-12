import nodemailer from "nodemailer";
import config from "../config/config";
import { IEnquiry } from "../interfaces/workshopInterface";
import { ICareer } from "../interfaces/careerInterface";
import axios from "axios";

export const BookConfirmationMail = async ({
  name,
  email,
  time,
  date,
  type,
  mobileNumber,
}: {
  name: string;
  email: string;
  time: string;
  date: string;
  type: string;
  mobileNumber: string;
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

  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  // --- Email to User ---
  await transporter.sendMail({
    from: `"Mentoons Mythos" <${config.EMAIL_USER}>`,
    to: email,
    subject: "📅 Booking Confirmation - Your Call is Scheduled",
    text: `Hello ${name},

Your call has been successfully booked.

📌 Details:
- Date: ${date}
- Time: ${time}
- Type: ${type}
- Contact: ${mobileNumber}

Thank you for booking with us!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#4CAF50;">Booking Confirmed ✅</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your call has been successfully booked with the following details:</p>
        <ul>
          <li><b>Date:</b> ${date}</li>
          <li><b>Time:</b> ${time}</li>
          <li><b>Type:</b> ${formattedType}</li>
          <li><b>Contact:</b> ${mobileNumber}</li>
        </ul>
        <p>Thank you for booking with us. We look forward to speaking with you!</p>
      </div>
    `,
  });

  // --- Email to Company ---
  await transporter.sendMail({
    from: `"One on One call" <${config.EMAIL_USER}>`,
    to: config.EMAIL_USER,
    subject: "📩 New Booking Received",
    text: `A new booking has been made:

👤 Name: ${name}
📧 Email: ${email}
📞 Mobile: ${mobileNumber}
📌 Date: ${date}
⏰ Time: ${time}
🎯 Type: ${formattedType}
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#2196F3;">New Booking Received 📩</h2>
        <p>A new booking has been made with the following details:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
          <li><b>Date:</b> ${date}</li>
          <li><b>Time:</b> ${time}</li>
          <li><b>Type:</b> ${type}</li>
        </ul>
      </div>
    `,
  });
};

export const RegisterWorkshopMail = async ({
  firstName,
  lastName,
  mobileNumber,
  category,
  email,
}: IEnquiry) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const fullName = `${firstName} ${lastName}`;
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  // --- Email to User ---
  await transporter.sendMail({
    from: `"Mentoons Mythos" <${config.EMAIL_USER}>`,
    to: email,
    subject: "🎉 Workshop Registration Successful",
    text: `Hello ${fullName},

You have successfully registered for our workshop.

📌 Details:
- Category: ${formattedCategory}
- Mobile: ${mobileNumber}

We look forward to seeing you at the workshop!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#4CAF50;">Workshop Registration Confirmed ✅</h2>
        <p>Hello <b>${fullName}</b>,</p>
        <p>You have successfully registered for our workshop with the following details:</p>
        <ul>
          <li><b>Category:</b> ${formattedCategory}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
        </ul>
        <p>Thank you for registering with us. We look forward to having you in the session!</p>
      </div>
    `,
  });

  // --- Email to Company ---
  await transporter.sendMail({
    from: `"Workshop Registration" <${config.EMAIL_USER}>`,
    to: config.EMAIL_USER,
    subject: "📩 New Workshop Registration",
    text: `A new workshop registration has been received:

👤 Name: ${fullName}
📧 Email: ${email}
📞 Mobile: ${mobileNumber}
🎯 Category: ${formattedCategory}
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#2196F3;">New Workshop Registration 📩</h2>
        <p>A new workshop registration has been received:</p>
        <ul>
          <li><b>Name:</b> ${fullName}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
          <li><b>Category:</b> ${formattedCategory}</li>
        </ul>
      </div>
    `,
  });
};

export const ApplyJobMail = async ({
  name,
  email,
  mobileNumber,
  position,
}: ICareer) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  // --- Email to Candidate ---
  await transporter.sendMail({
    from: `"Mentoons Careers" <${config.EMAIL_USER}>`,
    to: email,
    subject: "✅ Job Application Submitted Successfully",
    text: `Hello ${name},

Thank you for applying for the position of "${position}".

📌 Application Details:
- Name: ${name}
- Mobile: ${mobileNumber}
- Email: ${email}

Our recruitment team will review your application and get back to you shortly.

Best regards,  
Mentoons Careers Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#4CAF50;">Job Application Submitted ✅</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for applying for the position of <b>${position}</b>.</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
        </ul>
        <p>Our recruitment team will review your application and contact you if shortlisted.</p>
      </div>
    `,
  });

  // --- Email to Company / HR ---
  await transporter.sendMail({
    from: `"Job Application" <${config.EMAIL_USER}>`,
    to: config.EMAIL_USER, // company HR email
    subject: `📩 New Job Application - ${position}`,
    text: `A new job application has been received:

👤 Name: ${name}
📧 Email: ${email}
📞 Mobile: ${mobileNumber}
🎯 Job Title: ${position}
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#2196F3;">New Job Application 📩</h2>
        <p>A new job application has been received for the position <b>${position}</b>:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
          <li><b>Job Title:</b> ${position}</li>
        </ul>
      </div>
    `,
  });
};

interface SendAssignmentsProps {
  appDetails: ICareer[];
  jobTitle: string;
  dueDate: string;
  dueTime: string;
  fileUrl: string; // S3 file URL (can be signed or public)
  link?: string; // optional Figma or other resource link
}

export const sendAssignments = async ({
  appDetails,
  jobTitle,
  dueDate,
  dueTime,
  fileUrl,
  link,
}: SendAssignmentsProps) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

  const fileName = `${jobTitle}.pdf`;

  for (let app of appDetails) {
    await transporter.sendMail({
      from: `"Mentoons Careers" <${config.EMAIL_USER}>`,
      to: app.email,
      subject: `Assignment for ${jobTitle} Position`,
      text: `Dear ${app.name},

Greetings from Mentoons Careers!

As part of the hiring process for the "${
        app.position
      }" position, we are sharing an assessment to evaluate your skills.
 Please find the attachment for the details of the task. The due date to return the task is on ${dueDate} before ${dueTime}.


The assignment file is attached with this email.${
        link
          ? `\nAdditionally, you can access the Figma design link here: ${link}`
          : ""
      }

Please review the task carefully and submit it within the given timeline.  
If you have any questions, feel free to reach out.

Best regards,  
Mentoons Careers Team`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
          <p>Dear ${app.name},</p>
          <p>Greetings from <b>Mentoons Careers</b>!</p>
          <p>As part of the hiring process for the position of <b>${
            app.position
          }</b>, we are sharing an assessment to evaluate your skills. 
              Please find the attachment for the details of the task. The due date to return the task is on ${dueDate} before ${dueTime}.</p>
          
          ${
            link
              ? `<p>Additionally, you can access the <b>Figma Design Link</b> here: 
                  <a href="${link}" target="_blank">${link}</a></p>`
              : ""
          }

          <p>Please review the task carefully and submit it within the given timeline.</p>
          <p>If you have any questions, feel free to reach out.</p>

          <p><b>Best regards,</b><br/>Mentoons Careers Team</p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: response.data, // file buffer
          contentType: response.headers["content-type"], // ensures correct type
        },
      ],
    });
  }
};
