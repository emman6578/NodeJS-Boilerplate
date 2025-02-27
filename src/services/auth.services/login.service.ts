// loginService.ts
import bcrypt from "bcrypt";
import { sendEmail } from "@utils/Email/sendEmail";
import { isValidEmail } from "@services/auth.services/validator/isEmailValid";
import { PrismaClient } from "@prisma/client";
import { generateEmailToken } from "@utils/Token/generateEmailToken";

const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

export const loginUser = async (email: string, password: string) => {
  // Validate email input
  if (!email) {
    throw new Error("Empty email field");
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }

  // Find the user by email
  const userData = await prisma.auth.findUnique({
    where: { email },
  });
  if (!userData) {
    throw new Error("Please register first");
  }

  // Validate the password
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials: Wrong Password Or Email");
  }

  // Generate email token and calculate expiration
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  // Create a token record in the database
  const createdTokenEmail = await prisma.token.create({
    data: {
      type: "EMAIL",
      emailToken,
      expiration,
      User: {
        connect: {
          id: userData.user_id,
        },
      },
    },
  });

  // Prepare email data
  const emailData = {
    to: email,
    text: "Password Code",
    subject: "Login Code",
    htm: `This code <h1>${createdTokenEmail.emailToken}</h1> will expire in ${EMAIL_TOKEN_EXPIRATION_MINUTES} mins`,
  };

  // Send email and handle any errors
  try {
    await sendEmail(emailData);
  } catch (error) {
    throw new Error("Failed to send email: " + error);
  }

  return createdTokenEmail;
};
