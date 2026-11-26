"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "@/app/admin/actions";

const stateAwal = { status: null, pesan: null };

export default function FormGantiPassword() {
  const [state, formAction, pending] = useActionState(gantiPassword, stateAwal);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      {state?.pesan && (
        <p
          role={state.status === "sukses" ? "status" : "alert"}
          className={
            state.status === "sukses"
              ? "rounded-lg border border-utama bg-permukaan px-3 py-2 text-sm text-utama"
              : "rounded-lg border border-bahaya bg-latar px-3 py-2 text-sm text-bahaya"
          }
        >
          {state.pesan}
        </p>
      )}
      <Input
        label="Password baru"
        name="password_baru"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        label="Ulangi password baru"
        name="konfirmasi_password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Tombol type="submit" className="self-start" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan password"}
      </Tombol>
    </form>
  );
}
