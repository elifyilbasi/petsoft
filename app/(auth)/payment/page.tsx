"use client";

import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function Payment() {
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      {!success && (
        <Button
          disabled={isPending}
          onClick={async () =>
            startTransition(async () => await createCheckoutSession())
          }
        >
          Buy lifetime access for €299
        </Button>
      )}
      {success === "true" && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.{" "}
        </p>
      )}
      {cancelled === "true" && (
        <p className="text-sm text-red-700">
          Payment cancelled. Please try again.
        </p>
      )}
    </main>
  );
}
