"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DEFAULT_PET_IMAGE_URL } from "@/lib/constants";
import { usePetContext } from "@/lib/hooks";
import { petFormSchema, TPetForm } from "@/lib/validations";

import PetFormBtn from "./pet-form.btn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmit: () => void;
};

export default function PetForm({ actionType, onFormSubmit }: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPetForm>({
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedPet!.name,
            ownerName: selectedPet!.ownerName,
            imageUrl: selectedPet!.imageUrl,
            age: selectedPet!.age,
            notes: selectedPet!.notes,
          }
        : undefined,
    resolver: zodResolver(petFormSchema),
  });

  const processForm = async (data: TPetForm) => {
    const petData = {
      ...data,
      imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL,
    };

    onFormSubmit();

    if (actionType === "add") {
      await handleAddPet(petData);
    } else {
      await handleEditPet(selectedPet!.id, petData);
    }
  };
  return (
    <form onSubmit={handleSubmit(processForm)} className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age", { valueAsNumber: true })} />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
}
