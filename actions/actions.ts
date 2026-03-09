"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { authCheck, getPetById } from "@/lib/server-utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";

export async function logIn(authData: unknown) {
  if (!(authData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  try {
    await signIn("credentials", authData, {
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

export async function signUp(formData: unknown) {
  // check if formData is an instance of FormData
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  // convert FormData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    await signIn("credentials", formData, {
      redirectTo: "/app/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Sign up failed. User may already exist.",
      };
    }
    throw error;
  }
}

export async function addPet(pet: unknown) {
  const session = await authCheck();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: { id: session.user.id },
        },
      },
    });
  } catch {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  // authentication check
  const session = await authCheck();

  // validation check
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // authorization check: ensure the pet belongs to the user
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "You are not authorized to edit this pet.",
    };
  }
  // database mutation
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
  // authentication check
  const session = await authCheck();

  // validation check
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID.",
    };
  }

  // authorization check: ensure the pet belongs to the user
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "You are not authorized to delete this pet.",
    };
  }

  // database mutation
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
