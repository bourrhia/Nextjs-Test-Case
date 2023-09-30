import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  return isPasswordCorrect;
}
