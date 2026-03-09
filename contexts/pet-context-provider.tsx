"use client";

import { Pet } from "@prisma/client";
import { createContext, startTransition,useOptimistic, useState } from "react";
import { toast } from "sonner";

import { addPet, checkoutPet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPet: PetEssentials) => Promise<void>;
  handleCheckoutPet: (id: Pet["id"]) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { id: Math.random().toString(), ...payload }];
        case "edit":
          return state.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload.newPetData } : pet,
          );
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    },
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleAddPet = async (newPet: PetEssentials) => {
    startTransition(() => {
      setOptimisticPets({ action: "add", payload: newPet });
    });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
    startTransition(() => {
      setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });
    });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    startTransition(() => {
      setOptimisticPets({ action: "delete", payload: petId });
    });
    const error = await checkoutPet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  return (
    <PetContext
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext>
  );
}
