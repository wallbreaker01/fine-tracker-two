import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./template";

type WelcomeEmailData = {
  email: string;
  name: string;
  intro: string;
  password: string;
};

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
  password,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace(/{{name}}/g, name)
    .replace(/{{intro}}/g, intro)
    .replace(/{{email}}/g, email)
    .replace(/{{password}}/g, password);

  const mailOptions = {
    from: `"Fine Tracker" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Welcome to Fine Tracker!",
    text: `Thanks for signing up for Fine Tracker!\n\nEmail: ${email}\nPassword: ${password}`,
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
