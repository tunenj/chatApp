import { ENV } from "../lib/env.js"
import { resendClient } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const senderName = ENV.env.EMAIL_FROM_NAME || "ChatApp";
  const senderEmail = ENV.env.EMAIL_FROM || "onboarding@resend.dev";

  const { data, error } = await resendClient.emails.send({
    from: `${senderName} <${senderEmail}>`,
    to: email,
    subject: "Welcome onboard!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("✅ Welcome email sent successfully:", data);
};
