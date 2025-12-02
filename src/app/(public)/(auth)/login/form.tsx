"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validationErrors } from "@/utils/validation-errors";
import React from "react";
import { FormInput } from "@/components/react-hook-form/form.input";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/toast";
import Image from "next/image";
import logo_casa_do_hip_hop from "@/app/assets/logo_casa_do_hip_hop.png";

const loginSchema = z.object({
  email: z.string().email(validationErrors.INVALID_VALUE("Email")),
  password: z.string().min(6, validationErrors.SIZE_ERROR("Senha", 6)),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { showToast } = useToast();

  const { login } = useAuth();

  const router = useRouter();

  const { handleSubmit, control } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = React.useCallback(
    async (data: LoginFormData) => {
      try {
        const { user } = await login(data.email, data.password);

        router.push("/dashboard");

        showToast("success", { title: `Bem-vindo(a) ${user.name}` });
      } catch (error) {
        console.error(error);
        showToast("error", { title: "Credenciais inválidas" });
      }
    },
    [login, router, showToast]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center mb-4">
        <Image
          src={logo_casa_do_hip_hop}
          alt="Casa do Hip Hop"
          width={348}
          height={116}
          className="w-auto h-20 sm:h-28 md:h-32"
          priority
        />
      </div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <FormInput
              name="email"
              type="email"
              control={control}
              placeholder="exemplo@dominio.com"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/forget-password"
                className="ml-auto text-sm underline underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <FormInput name="password" type="password" control={control} />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
        <div className="text-center text-sm">
          Ainda não tem uma conta?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}
