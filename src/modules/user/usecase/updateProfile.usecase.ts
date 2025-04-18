import { prisma } from "@/prisma/client";

interface UpdateProfileDTO {
  userId: string;
  name?: string;
  phone?: string;
  document?: string;
}

export const updateProfile = async ({
  userId,
  name,
  phone,
  document,
}: UpdateProfileDTO) => {
  return prisma.user.update({
    where: { id: userId },
    data: { name, phone, document },
  });
};
