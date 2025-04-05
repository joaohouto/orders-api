import { prisma } from "@/prisma/client";

interface UpdateProfileDTO {
  userId: string;
  name?: string;
  phone?: string;
}

export const updateProfile = async ({
  userId,
  name,
  phone,
}: UpdateProfileDTO) => {
  return prisma.user.update({
    where: { id: userId },
    data: { name, phone },
  });
};
