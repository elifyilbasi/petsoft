"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export async function addPet(pet) {
  try {
    await prisma.pet.create({
      data: pet,
    });
  } catch {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId, newPetData) {
  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: newPetData,
    });
  } catch {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function checkoutPet(petId) {
  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch {
    return {
      message: "Could not delete pet.",
    };
  }
  revalidatePath("/app", "layout");
}
