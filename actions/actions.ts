"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logIn(authData: FormData) {
  try {
    await signIn("credentials", authData, { redirectTo: "/app/dashboard" });
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

export async function signUp(formData: FormData) {
  try {
    const hashedPassword = await bcrypt.hash(
      formData.get("password") as string,
      10,
    );

    await prisma.user.create({
      data: {
        email: formData.get("email") as string,
        hashedPassword,
      },
    });

    await signIn("credentials", formData, { redirectTo: "/app/dashboard" });
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
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // validation check
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // authorization check: ensure the pet belongs to the user
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });
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
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // validation check
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID.",
    };
  }

  // authorization check: ensure the pet belongs to the user
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });
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
