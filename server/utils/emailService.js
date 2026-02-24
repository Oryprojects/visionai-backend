import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const HR_INBOX = process.env.HR_EMAIL || 'hr@visionai.jp';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'hr@visionai.jp';
const SENDER_NAME = process.env.SENDER_NAME || 'VisionAI';

// Generic send mail function
async function sendMail({ to, subject, htmlContent, attachments }) {
  const sendSmtpEmail = {
    sender: { email: SENDER_EMAIL, name: SENDER_NAME },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  if (attachments) {
    sendSmtpEmail.attachment = attachments;
  }

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully to ${to}:`, data.body);
  } catch (error) {
    console.error(`❌ Brevo email sending failed for ${to}:`, error.response?.text || error);
  }
}

// Send contact form email
export const sendContactEmail = async ({ name, email, subject, message }) => {
  // Email to HR
  const hrHtmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
  const sendToHr = sendMail({
    to: HR_INBOX,
    subject: `Contact Form: ${subject}`,
    htmlContent: hrHtmlContent,
  });

  // Confirmation email to user
  const userHtmlContent = `
      <h2>Thank You for Your Message</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      <p>Best regards,<br>The VisionAI Team</p>
    `;
  const sendToUser = sendMail({
    to: email,
    subject: 'Thank you for contacting VisionAI',
    htmlContent: userHtmlContent,
  });

  await Promise.all([sendToHr, sendToUser]);
};

// Send job application email
export const sendJobApplicationEmail = async ({ name, email, phone, position, message, resume }) => {
  // Email to HR
  const hrHtmlContent = `
      <h2>New Job Application</h2>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${message || 'Not provided'}</p>
    `;
    
  const attachments = [
    {
      content: resume.buffer.toString('base64'),
      name: resume.originalname,
    },
  ];

  const sendToHr = sendMail({
    to: HR_INBOX,
    subject: `Job Application: ${position}`,
    htmlContent: hrHtmlContent,
    attachments: attachments,
  });

  // Confirmation email to applicant
  const applicantHtmlContent = `
      <h2>Application Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for applying for the <strong>${position}</strong> position at VisionAI. We have successfully received your application and will review it shortly.</p>
      <p>Best regards,<br>The VisionAI Team</p>
    `;
  const sendToApplicant = sendMail({
    to: email,
    subject: 'Your Application to VisionAI has been received',
    htmlContent: applicantHtmlContent,
  });

  await Promise.all([sendToHr, sendToApplicant]);
};

// Send 2FA OTP email
export const sendOTPEmail = async (email, otp) => {
  const otpHtmlContent = `
      <h2>Two-Factor Authentication Code</h2>
      <p>Your verification code is:</p>
      <div style="
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        margin: 20px 0;
      ">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `;
  
  await sendMail({
    to: email,
    subject: 'VisionAI Admin - 2FA Verification Code',
    htmlContent: otpHtmlContent,
  });
};
