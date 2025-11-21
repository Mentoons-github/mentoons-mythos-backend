import nodemailer from "nodemailer";
import config from "../config/config";
import { IEnquiry } from "../interfaces/workshopInterface";
import { ICareer, IMentor } from "../interfaces/careerInterface";
import axios from "axios";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(config.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// book call
// export const BookConfirmationMail = async ({
//   name,
//   email,
//   time,
//   date,
//   type,
//   mobileNumber,
// }: {
//   name: string;
//   email: string;
//   time: string;
//   date: string;
//   type: string;
//   mobileNumber: string;
// }) => {
//   const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

//   // --- Email to User ---
//   await transporter.sendMail({
//     from: `"Mentoons Mythos" <${config.EMAIL_USER}>`,
//     to: email,
//     subject: "📅 Booking Confirmation - Your Call is Scheduled",
//     text: `Hello ${name},

// Your call has been successfully booked.

// 📌 Details:
// - Date: ${date}
// - Time: ${time}
// - Type: ${type}
// - Contact: ${mobileNumber}

// Thank you for booking with us!`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//         <h2 style="color:#4CAF50;">Booking Confirmed ✅</h2>
//         <p>Hello <b>${name}</b>,</p>
//         <p>Your call has been successfully booked with the following details:</p>
//         <ul>
//           <li><b>Date:</b> ${date}</li>
//           <li><b>Time:</b> ${time}</li>
//           <li><b>Type:</b> ${formattedType}</li>
//           <li><b>Contact:</b> ${mobileNumber}</li>
//         </ul>
//         <p>Thank you for booking with us. We look forward to speaking with you!</p>
//       </div>
//     `,
//   });

//   // --- Email to Company ---
//   await transporter.sendMail({
//     from: `"One on One call" <${config.EMAIL_USER}>`,
//     to: config.EMAIL_USER,
//     subject: "📩 New Booking Received",
//     text: `A new booking has been made:

// 👤 Name: ${name}
// 📧 Email: ${email}
// 📞 Mobile: ${mobileNumber}
// 📌 Date: ${date}
// ⏰ Time: ${time}
// 🎯 Type: ${formattedType}
// `,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//         <h2 style="color:#2196F3;">New Booking Received 📩</h2>
//         <p>A new booking has been made with the following details:</p>
//         <ul>
//           <li><b>Name:</b> ${name}</li>
//           <li><b>Email:</b> ${email}</li>
//           <li><b>Mobile:</b> ${mobileNumber}</li>
//           <li><b>Date:</b> ${date}</li>
//           <li><b>Time:</b> ${time}</li>
//           <li><b>Type:</b> ${type}</li>
//         </ul>
//       </div>
//     `,
//   });
// };

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
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  // -----------------------------
  // 📧 1. Email to USER
  // -----------------------------
  const userMsg = {
    to: email,
    from: {
      name: "Mentoons Mythos",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
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
  };

  // 📧 2. Email to COMPANY (self)
  const adminMsg = {
    to: config.EMAIL_USER,
    from: {
      name: "One on One Call",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
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
          <li><b>Type:</b> ${formattedType}</li>
        </ul>
      </div>
    `,
  };

  try {
    await sgMail.send(userMsg);
    await sgMail.send(adminMsg);

    console.log("📩 Booking confirmation emails sent successfully");
  } catch (err: any) {
    console.error(
      "❌ Error sending booking emails:",
      err.response?.body || err
    );
  }
};

// register workshop
// export const RegisterWorkshopMail = async ({
//   firstName,
//   lastName,
//   mobileNumber,
//   category,
//   email,
// }: IEnquiry) => {
//   const fullName = `${firstName} ${lastName}`;
//   const formattedCategory =
//     category.charAt(0).toUpperCase() + category.slice(1);

//   // --- Email to User ---
//   await transporter.sendMail({
//     from: `"Mentoons Mythos" <${config.EMAIL_USER}>`,
//     to: email,
//     subject: "🎉 Workshop Registration Successful",
//     text: `Hello ${fullName},

// You have successfully registered for our workshop.

// 📌 Details:
// - Category: ${formattedCategory}
// - Mobile: ${mobileNumber}

// We look forward to seeing you at the workshop!`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//         <h2 style="color:#4CAF50;">Workshop Registration Confirmed ✅</h2>
//         <p>Hello <b>${fullName}</b>,</p>
//         <p>You have successfully registered for our workshop with the following details:</p>
//         <ul>
//           <li><b>Category:</b> ${formattedCategory}</li>
//           <li><b>Mobile:</b> ${mobileNumber}</li>
//         </ul>
//         <p>Thank you for registering with us. We look forward to having you in the session!</p>
//       </div>
//     `,
//   });

//   // --- Email to Company ---
//   await transporter.sendMail({
//     from: `"Workshop Registration" <${config.EMAIL_USER}>`,
//     to: config.EMAIL_USER,
//     subject: "📩 New Workshop Registration",
//     text: `A new workshop registration has been received:

// 👤 Name: ${fullName}
// 📧 Email: ${email}
// 📞 Mobile: ${mobileNumber}
// 🎯 Category: ${formattedCategory}
// `,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//         <h2 style="color:#2196F3;">New Workshop Registration 📩</h2>
//         <p>A new workshop registration has been received:</p>
//         <ul>
//           <li><b>Name:</b> ${fullName}</li>
//           <li><b>Email:</b> ${email}</li>
//           <li><b>Mobile:</b> ${mobileNumber}</li>
//           <li><b>Category:</b> ${formattedCategory}</li>
//         </ul>
//       </div>
//     `,
//   });
// };

export const RegisterWorkshopMail = async ({
  firstName,
  lastName,
  mobileNumber,
  category,
  email,
}: IEnquiry) => {
  const fullName = `${firstName} ${lastName}`;
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  // --- Email to User ---
  const userMsg = {
    to: email,
    from: {
      name: "Mentoons Mythos",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
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
  };

  // --- Email to Company ---
  const adminMsg = {
    to: config.EMAIL_USER,
    from: {
      name: "One on One Call",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
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
  };

  try {
    await sgMail.send(userMsg);
    await sgMail.send(adminMsg);

    console.log("📩 Booking confirmation emails sent successfully");
  } catch (err: any) {
    console.error(
      "❌ Error sending booking emails:",
      err.response?.body || err
    );
  }
};

// apply job
// export const ApplyJobMail = async ({
//   name,
//   email,
//   mobileNumber,
//   position,
// }: {
//   name: string;
//   email: string;
//   mobileNumber: number;
//   position: string;
// }) => {
//   await transporter.sendMail({
//     from: `"Mentoons Careers" <${config.EMAIL_USER}>`,
//     to: email,
//     subject: "✅ Job Application Submitted Successfully",
//     text: `Hello ${name},

// Thank you for applying for the position of "${position}".

// 📌 Application Details:
// - Name: ${name}
// - Mobile: ${mobileNumber}
// - Email: ${email}

// Our recruitment team will review your application and get back to you shortly.

// Best regards,
// Mentoons Careers Team`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//         <h2 style="color:#4CAF50;">Job Application Submitted ✅</h2>
//         <p>Hello <b>${name}</b>,</p>
//         <p>Thank you for applying for the position of <b>${position}</b>.</p>
//         <ul>
//           <li><b>Name:</b> ${name}</li>
//           <li><b>Email:</b> ${email}</li>
//           <li><b>Mobile:</b> ${mobileNumber}</li>
//         </ul>
//         <p>Our recruitment team will review your application and contact you if shortlisted.</p>
//       </div>
//     `,
//   });

//   await transporter.sendMail({
//     from: `"Job Application" <${config.EMAIL_USER}>`,
//     to: config.EMAIL_USER,
//     subject: `📩 New Job Application - ${position}`,
//     text: `A new job application has been received:

// 👤 Name: ${name}
// 📧 Email: ${email}
// 📞 Mobile: ${mobileNumber}
// 🎯 Job Title: ${position}
// `,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//         <h2 style="color:#2196F3;">New Job Application 📩</h2>
//         <p>A new job application has been received for the position <b>${position}</b>:</p>
//         <ul>
//           <li><b>Name:</b> ${name}</li>
//           <li><b>Email:</b> ${email}</li>
//           <li><b>Mobile:</b> ${mobileNumber}</li>
//           <li><b>Job Title:</b> ${position}</li>
//         </ul>
//       </div>
//     `,
//   });
// };

export const ApplyJobMail = async ({
  name,
  email,
  mobileNumber,
  position,
}: {
  name: string;
  email: string;
  mobileNumber: number;
  position: string;
}) => {
  // -----------------------------
  // 📧 1. EMAIL TO USER
  // -----------------------------
  const userMsg = {
    to: email,
    from: {
      name: "Mentoons Careers",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
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
  };

  // -----------------------------
  // 📧 2. EMAIL TO ADMIN (YOU)
  // -----------------------------
  const adminMsg = {
    to: config.EMAIL_USER,
    from: {
      name: "Job Application",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
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
  };

  // -----------------------------
  // 🚀 SEND BOTH EMAILS
  // -----------------------------
  try {
    await sgMail.send(userMsg);
    await sgMail.send(adminMsg);

    console.log("📩 Job application emails sent successfully");
  } catch (err: any) {
    console.error(
      "❌ Error sending job application emails:",
      err.response?.body || err
    );
  }
};

interface SendAssignmentsProps {
  appDetails: ICareer[];
  jobTitle: string;
  dueDate: string;
  dueTime: string;
  fileUrl: string;
  link?: string;
}

//send assignement
// export const sendAssignments = async ({
//   appDetails,
//   jobTitle,
//   dueDate,
//   dueTime,
//   fileUrl,
//   link,
// }: SendAssignmentsProps) => {
//   const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

//   const fileName = `${jobTitle}.pdf`;

//   for (let app of appDetails) {
//     await transporter.sendMail({
//       from: `"Mentoons Careers" <${config.EMAIL_USER}>`,
//       to: app.email,
//       subject: `Assignment for ${jobTitle} Position`,
//       text: `Dear ${app.name},

// Greetings from Mentoons Careers!

// As part of the hiring process for the "${
//         app.position
//       }" position, we are sharing an assessment to evaluate your skills.
//  Please find the attachment for the details of the task. The due date to return the task is on ${dueDate} before ${dueTime}.

// The assignment file is attached with this email.${
//         link
//           ? `\nAdditionally, you can access the Figma design link here: ${link}`
//           : ""
//       }

// Please review the task carefully and submit it within the given timeline.
// If you have any questions, feel free to reach out.

// Best regards,
// Mentoons Careers Team`,

//       html: `
//         <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
//           <p>Dear ${app.name},</p>
//           <p>Greetings from <b>Mentoons Careers</b>!</p>
//           <p>As part of the hiring process for the position of <b>${
//             app.position
//           }</b>, we are sharing an assessment to evaluate your skills.
//               Please find the attachment for the details of the task. The due date to return the task is on ${dueDate} before ${dueTime}.</p>

//           ${
//             link
//               ? `<p>Additionally, you can access the <b>Figma Design Link</b> here:
//                   <a href="${link}" target="_blank">${link}</a></p>`
//               : ""
//           }

//           <p>Please review the task carefully and submit it within the given timeline.</p>
//           <p>If you have any questions, feel free to reach out.</p>

//           <p><b>Best regards,</b><br/>Mentoons Careers Team</p>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: fileName,
//           content: response.data,
//           contentType: response.headers["content-type"],
//         },
//       ],
//     });
//   }
// };

export const sendAssignments = async ({
  appDetails,
  jobTitle,
  dueDate,
  dueTime,
  fileUrl,
  link,
}: SendAssignmentsProps) => {
  // 1️⃣ Download the file as buffer
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

  const base64File = Buffer.from(response.data).toString("base64");
  const fileName = `${jobTitle}.pdf`;

  // 2️⃣ Send email for each applicant
  for (let app of appDetails) {
    const msg = {
      to: app.email,
      from: {
        name: "Mentoons Mythos Careers",
        email: "no-reply@em3576.mentoonsmythos.com", // verified sender
      },
      subject: `Assignment for ${jobTitle} Position`,
      text: `Dear ${app.name},

Greetings from Mentoons Careers!

As part of the hiring process for the "${
        app.position
      }" position, we are sharing an assessment to evaluate your skills.
Please find the attachment for the details of the task. The due date to return the task is on ${dueDate} before ${dueTime}.

${link ? `Figma Design Link: ${link}` : ""}

Please review the task carefully and submit it within the given timeline.
If you have any questions, feel free to reach out.

Best regards,
Mentoons Careers Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
          <p>Dear ${app.name},</p>
          <p>Greetings from <b>Mentoons Careers</b>!</p>

          <p>As part of the hiring process for the position of 
          <b>${
            app.position
          }</b>, we are sharing an assessment to evaluate your skills.
          Please find the assignment attached. The due date to return the task is 
          on <b>${dueDate}</b> before <b>${dueTime}</b>.</p>

          ${
            link
              ? `<p>You can also access the <b>Figma Design Link</b> here:<br>
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
          content: base64File,
          filename: fileName,
          type: response.headers["content-type"] || "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    try {
      await sgMail.send(msg);
      console.log(`📩 Assignment sent to ${app.email}`);
    } catch (err: any) {
      console.error(
        `❌ Error sending assignment to ${app.email}:`,
        err.response?.body || err
      );
    }
  }
};

// send newsletter messages
export const sendNewsletterMessages = async ({
  emails,
  subject,
  message,
}: {
  emails: string[];
  subject: string;
  message: string;
}) => {
  const messages = emails.map((email) => ({
    to: email,
    from: {
      name: "Mentoons Mythos",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#4CAF50;">📢 ${subject}</h2>
        <p>Hello,</p>
        <p>${message}</p>
        <p style="margin-top:20px;">Best regards,<br/><b>Mentoons Team</b></p>
        <hr/>
        <p style="font-size:12px; color:#777;">
          You are receiving this email because you subscribed to our newsletter.  
          If you no longer wish to receive updates, please <a href="#">unsubscribe</a>.
        </p>
      </div>
    `,
  }));

  await sgMail.send(messages, false); // false = disable batch grouping
  return "Emails sent successfully!";
};

// career gps mail
export const CareerGPSMail = async ({
  name,
  email,
  mobileNumber,
}: {
  name: string;
  email: string;
  mobileNumber: number;
}) => {
  // Email to User

  const userMsg = {
    to: email,
    from: {
      name: "Mentoons Mythos Career GPS",
      email: "no-reply@em3576.mentoonsmythos.com", // verified sender
    },
    subject: "✅ Career GPS Enquiry Submitted Successfully",
    text: `Hello ${name},
      
Thank you for submitting your enquiry in Mentoons Career GPS.

📌 Provided Details:
- Name: ${name}
- Mobile: ${mobileNumber}
- Email: ${email}

Our guidance team will reach out to you shortly.

Best regards,  
Mentoons Career GPS Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#4CAF50;">Career GPS Enquiry Received ✅</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for showing interest in our <b>Career GPS Program</b>.</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
        </ul>
        <p>Our team will contact you soon with further details.</p>
        <p>Warm Regards,<br><b>Mentoons Career GPS Team</b></p>
      </div>
    `,
  };

  // Email to Admin
  const adminMsg = {
    to: config.EMAIL_USER,
    from: {
      name: "Career GPS Enquiry",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
    subject: `📩 New Career GPS Enquiry - ${name}`,
    text: `New Career GPS enquiry received:

👤 Name: ${name}
📧 Email: ${email}
📞 Mobile: ${mobileNumber}
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2 style="color:#2196F3;">New Career GPS Enquiry 📩</h2>
        <p>A new enquiry has been submitted for the Career GPS program:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Mobile:</b> ${mobileNumber}</li>
        </ul>
      </div>
    `,
  };

  // -----------------------------
  // 🚀 SEND BOTH EMAILS
  // -----------------------------
  try {
    await sgMail.send(userMsg);
    await sgMail.send(adminMsg);

    console.log("📩 Job application emails sent successfully");
  } catch (err: any) {
    console.error(
      "❌ Error sending job application emails:",
      err.response?.body || err
    );
  }
};
