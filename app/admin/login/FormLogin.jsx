"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { loginAdmin } from "@/app/admin/actions";

const stateAwal = { error: null, email: "" };

export default function FormLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, stateAwal);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-bahaya bg-latar px-3 py-2 text-sm text-bahaya"
        >
          {state.error}
        </p>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.email ?? ""}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <Tombol type="submit" disabled={pending}>
        {pending ? "Memproses..." : "Masuk"}
      </Tombol>
    </form>
  );
}
