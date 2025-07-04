import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { defineString } from "firebase-functions/params";
import nodemailer from "nodemailer";

// Set global options for all functions
setGlobalOptions({ region: "us-central1" });

// Define string parameters for SendGrid API Key and Sender Email
const sendgridApiKey = defineString("SENDGRID_API_KEY");
const sendgridSender = defineString("SENDGRID_SENDER");

// Initialize Firebase Admin
initializeApp();

// Export the function
export const autoReplyContactTrigger = onDocumentCreated("contactMessages/{docId}", async (event) => {
  const data = event.data.data();
  // Validate required fields
  if (!data.email || !data.name) {
    console.error("Missing required fields: email or name");
    return;
  }
  // Create nodemailer transporter for SendGrid
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey", // this is literally the string "apikey"
      pass: sendgridApiKey.value()
    }
  });
  const mailOptions = {
    from: sendgridSender.value(), // Use your verified sender email address from SendGrid config
    to: data.email,
    subject: `Thank you for contacting VisBook, ${data.name}!`,
    text: `Hello ${data.name},\n\nWe appreciate you reaching out to VisBook regarding: "${data.subject || 'your inquiry'}".\n\nHere is a copy of your message:\n${data.message || 'No message provided'}\n\nOur team will review your inquiry and respond as soon as possible.\n\nBest regards,\nThe VisBook Team\n\n---\nThis is an automated reply. If you have further questions, simply reply to this email.\n\nP.S. If you do not see this email in your inbox, please check your Spam or Junk folder and mark it as 'Not Spam' to ensure future delivery.`,
    html: `<p>Hello <b>${data.name}</b>,</p>
         <p>We appreciate you reaching out to <b>VisBook</b> regarding: <i>"${data.subject || 'your inquiry'}"</i>.</p>
         <p><b>Your message:</b><br>${data.message || 'No message provided'}</p>
         <p>Our team will review your inquiry and respond as soon as possible.</p>
         <p>Best regards,<br>The VisBook Team</p>
         <hr>
         <small>This is an automated reply. If you have further questions, simply reply to this email.</small>
         <p><b>P.S.</b> If you do not see this email in your inbox, please check your Spam or Junk folder and mark it as 'Not Spam' to ensure future delivery.</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Auto-reply sent to ${data.email}`);
  } catch (error) {
    console.error("Error sending auto-reply:", error);
    throw error;
  }
});