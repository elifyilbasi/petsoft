"use client";

import { useState, createContext, useOptimistic } from "react";
import { toast } from "sonner";
import { Pet } from "@/lib/types";
import { addPet, checkoutPet, editPet } from "@/actions/actions";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => Promise<void>;
  handleEditPet: (petId: string, newPet: Omit<Pet, "id">) => Promise<void>;
  handleCheckoutPet: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, newPet) => {
      return [
        ...state,
        {
          ...newPet,
          id: Math.random().toString(),
        },
      ];
    },
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    setOptimisticPets(newPet);
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: string, newPetData: Omit<Pet, "id">) => {
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: string) => {
    await checkoutPet(petId);
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
