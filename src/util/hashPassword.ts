import bcrypt from "bcrypt";

export const hashPasswordAsync = async (password: string, saltRounds: number): Promise<string | undefined> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};
