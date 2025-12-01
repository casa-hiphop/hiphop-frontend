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
import { Eye, EyeOff } from "lucide-react";

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

  const [showPassword, setShowPassword] = React.useState(false);

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
          <div className="relative">
            <FormInput
              name="password"
              type={showPassword ? "text" : "password"}
              control={control}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm p-1"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
  );
}
