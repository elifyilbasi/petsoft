"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { Pet } from "@prisma/client";
import { PetEssentials } from "@/lib/types";

export async function addPet(pet: PetEssentials) {
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

export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
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

export async function checkoutPet(petId: Pet["id"]) {
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
