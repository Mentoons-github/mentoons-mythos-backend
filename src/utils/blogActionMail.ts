import sgMail from "@sendgrid/mail";

export const BlogActionMail = async ({
  email,
  action,
  days,
}: {
  email: string;
  action: string;
  days?: number;
}) => {
  let subject = "";
  let title = "";
  let message = "";

  const bannedUntil = new Date();
  bannedUntil.setDate(bannedUntil.getDate() + Number(days));
  const comeBack = bannedUntil.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  switch (action) {
    case "warn_user":
      subject = "⚠️ Community Guidelines Warning";
      title = "Warning Issued";
      message =
        "Your blog was found to violate our community guidelines. This is a warning only. Repeated violations may result in account restrictions.";
      break;

    case "ban_user":
      subject = "🚫 Account Temporarily Suspended";
      title = "Temporary Suspension";
      message = `Your account has been temporarily suspended for ${days} day(s) due to repeated community guideline violations.`;
      break;

    case "permBan":
      subject = "⛔ Account Permanently Banned";
      title = "Permanent Ban";
      message =
        "Your account has been permanently banned due to severe or repeated violations of our community guidelines.";
      break;

    default:
      return;
  }

  const msg = {
    to: email,
    from: {
      name: "Mentoons Mythos",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
    subject,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <h2>${title}</h2>

        <p>Hello,</p>

        <p>${message}</p>

        ${
          action === "ban_user"
            ? `<p><strong>Ban Duration:</strong> ${days} day(s)</p>
            <p><strong>Come back on:</strong> ${comeBack}</p>
            `
            : ""
        }

        <p>If you believe this action was taken in error, please contact our support team.</p>

        <br />
        <p>Regards,<br/>Mentoons Mythos Moderation Team</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("📩 Moderation email sent successfully");
  } catch (err: any) {
    console.error(
      "❌ Error sending moderation email:",
      err.response?.body || err,
    );
  }
};

// ban expire mail
export const BanExpiredMail = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const msg = {
    to: email,
    from: {
      name: "Mentoons Mythos",
      email: "no-reply@em3576.mentoonsmythos.com",
    },
    subject: "Your Account Access Has Been Restored",
    text: `Hello ${name},

            Good news! Your temporary account restriction has ended.
            
            You can now log in and continue using Mentoons Mythos.
            
            We encourage you to review and follow our Community Guidelines to help maintain a safe and respectful environment for everyone.
            
            If you have any questions or believe there has been an error, please contact our support team.
            
            Best regards,
            Mentoons Mythos Team
    `,
    html: `
      <div style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 20px;">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#ffffff;
                  border-radius:12px;
                  overflow:hidden;
                  box-shadow:0 4px 12px rgba(0,0,0,0.08);
                "
              >
                <tr>
                  <td
                    style="
                      background:#16a34a;
                      padding:24px;
                      text-align:center;
                    "
                  >
                    <h1
                      style="
                        margin:0;
                        color:#ffffff;
                        font-size:28px;
                        font-weight:700;
                      "
                    >
                      Account Access Restored
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p
                      style="
                        margin:0 0 16px;
                        font-size:16px;
                        color:#333;
                      "
                    >
                      Hello <strong>${name}</strong>,
                    </p>

                    <p
                      style="
                        margin:0 0 16px;
                        font-size:15px;
                        line-height:1.7;
                        color:#555;
                      "
                    >
                      Your temporary account restriction has expired and your
                      account has been successfully restored.
                    </p>

                    <p
                      style="
                        margin:0 0 16px;
                        font-size:15px;
                        line-height:1.7;
                        color:#555;
                      "
                    >
                      You may now log in and continue using Mentoons Mythos.
                    </p>

                    <div
                      style="
                        background:#f0fdf4;
                        border-left:4px solid #16a34a;
                        padding:16px;
                        margin:24px 0;
                        border-radius:6px;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          color:#166534;
                          font-size:14px;
                          line-height:1.6;
                        "
                      >
                        Please continue to follow our Community Guidelines to
                        ensure a positive and respectful experience for all
                        members.
                      </p>
                    </div>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:1.7;
                        color:#555;
                      "
                    >
                      If you have any questions, feel free to contact our
                      support team.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      background:#f8fafc;
                      padding:20px;
                      text-align:center;
                      color:#64748b;
                      font-size:13px;
                    "
                  >
                    © ${new Date().getFullYear()} Mentoons Mythos<br />
                    This is an automated email. Please do not reply directly to
                    this message.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("📩 Ban expiry email sent successfully");
  } catch (err: any) {
    console.error(
      "❌ Error sending ban expiry email:",
      err.response?.body || err,
    );
  }
};
