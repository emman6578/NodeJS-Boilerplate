import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { isValidEmail } from "@services/auth.services/validator/isEmailValid";
import { UserInterface } from "src/types/auth.types";

const prisma = new PrismaClient();

export const registerUser = async (user: UserInterface) => {
  if (!user.fullname || !user.email || !user.password || !user.role) {
    throw new Error("All fields are required.");
  }

  if (!Object.values(Role).includes(user.role)) {
    throw new Error("Invalid role. Allowed roles are ADMIN, MANAGER, or USER.");
  }

  if (!isValidEmail(user.email)) {
    throw new Error("Invalid email format.");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(user.password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a symbol."
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: { auth: { email: user.email } },
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists.");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  return prisma.user.create({
    data: {
      fullname: user.fullname,
      auth: {
        create: {
          email: user.email,
          password: hashedPassword,
        },
      },
      role: user.role,
    },
    include: {
      auth: { select: { email: true } },
    },
  });
};
