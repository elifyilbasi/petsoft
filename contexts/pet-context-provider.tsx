"use client";

import { useState, createContext } from "react";
import { Pet } from "@/lib/types";
import { addPet } from "@/actions/actions";

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
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data: pets,
  children,
}: PetContextProviderProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  // const handleCheckoutPet = (id: string) => {
  //   setPets((prev) => prev.filter((pet) => pet.id !== id));
  //   setSelectedPetId(null);
  // };

  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    await addPet(newPet);
  };

  // const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
  //   setPets((prev) =>
  //     prev.map((pet) => {
  //       if (pet.id === petId) {
  //         return { id: petId, ...newPetData };
  //       }
  //       return pet;
  //     }),
  //   );
  // };

  return (
    <PetContext
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
        handleAddPet,
      }}
    >
      {children}
    </PetContext>
  );
}
