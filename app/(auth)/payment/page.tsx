"use client";

import { useSearchParams } from "next/navigation";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function Payment() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      {!success && (
        <Button onClick={async () => await createCheckoutSession()}>
          Buy lifetime access for €299
        </Button>
      )}
      {success === "true" && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.{" "}
        </p>
      )}
    </main>
  );
}
