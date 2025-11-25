'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { validationErrors } from "@/utils/validation-errors"
import React from "react"
import { FormInput } from "@/components/react-hook-form/form.input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { api } from "@/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/toast"

const forgetPasswordSchema = z.object({
  email: z.string().email(validationErrors.INVALID_VALUE('Email')),
})

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { showToast } = useToast()

  const router = useRouter()

  const {
    handleSubmit,
    control
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  })

  const handleForgetPassword = React.useCallback(async ({ email }: ForgetPasswordFormData) => {
    try {
      await api.auth.forgetPassword(email)

      showToast('success', { title: "Solicitação de redefinição de senha enviada com sucesso. Verifique seu e-mail." })

      router.push('/login')
    } catch (error) {
      console.log(error)
      showToast('error', { title: "Falha ao enviar a solicitação de redefinição. Tente novamente." })
    }
  }, [router, showToast])

  return (
    <form
      onSubmit={handleSubmit(handleForgetPassword)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Redefinir senha</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Insira seu e-mail abaixo e enviaremos um link para redefinir sua senha
        </p>
      </div>
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
        <Button type="submit" className="w-full">
          Enviar
        </Button>
      </div>
      <div className="flex items-center justify-center text-center gap-1 text-sm">
        <ArrowLeft size={16} />
        <Link href="/login" className="underline underline-offset-4">
          Voltar para o login
        </Link>
      </div>
    </form>
  )
}
