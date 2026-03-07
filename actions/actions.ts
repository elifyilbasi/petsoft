"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";

export async function logIn(authData: FormData) {
  try {
    await signIn("credentials", {
      email: authData.get("email") as string,
      password: authData.get("password") as string,
      redirectTo: "/app/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Invalid email or password.",
      };
    }
    throw error;
  }
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function addPet(pet: unknown) {
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function checkoutPet(petId: unknown) {
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID.",
    };
  }
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch {
    return {
      message: "Could not delete pet.",
    };
  }
  revalidatePath("/app", "layout");
}
