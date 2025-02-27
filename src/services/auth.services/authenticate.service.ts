import { PrismaClient } from "@prisma/client";
import { generateAuthToken } from "@utils/Token/generateAuthToken";

const prisma = new PrismaClient();
const API_TOKEN_EXPIRATION_HOURS = 360;

export const authenticateUser = async (
  email: string,
  emailToken: string
): Promise<string> => {
  // Validate required fields
  if (!email || !emailToken) {
    throw new Error("Empty field");
  }

  // Retrieve the token record from the database
  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: { User: { include: { auth: true } } },
  });

  // Validate token existence and that it is still valid
  if (!dbEmailToken || !dbEmailToken.valid) {
    throw new Error("Unauthorized Access");
  }

  // Validate token expiration
  if (dbEmailToken.expiration < new Date()) {
    throw new Error("Unauthorized Access: Token expired");
  }

  // Check if the token's associated email matches the provided email
  if (dbEmailToken.User?.auth?.email !== email) {
    throw new Error("Unauthorized Access Register first");
  }

  // Calculate the expiration time for the new API token
  const expiration = new Date(
    new Date().getTime() + API_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  // Create a new API token record
  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      User: { connect: { id: dbEmailToken.user_id! } },
    },
  });

  // Invalidate the email token so it cannot be reused
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  // Generate an authentication token based on the new API token's id
  const authToken = generateAuthToken(apiToken.id);

  return authToken;
};
