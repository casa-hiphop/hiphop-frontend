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
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/toast"

const resetPasswordSchema = z.object({
  password: z.string().min(6, validationErrors.SIZE_ERROR('Senha', 6)),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas devem ser iguais",
  path: ["confirm_password"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()

  const { showToast } = useToast()

  const { token } = useParams()

  const {
    handleSubmit,
    control
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const handleResetPassword = React.useCallback(async ({ password }: ResetPasswordFormData) => {
    try {
      await api.auth.resetPassword(password, token as string)

      showToast('success', { title: "Senha redefinida com sucesso!" })

      router.push('/login')
    } catch (error) {
      console.log(error)
      showToast('error', { title: "Erro ao redefinir a senha. Tente novamente." })
    }
  }, [router, showToast, token])

  return (
    <form
      onSubmit={handleSubmit(handleResetPassword)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Redefina sua senha</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="password">Nova senha</Label>
          <FormInput
            name="password"
            type="password"
            control={control}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm_password">Confirme a nova senha</Label>
          <FormInput
            name="confirm_password"
            type="password"
            control={control}
          />
        </div>
        <Button type="submit" className="w-full">
          Redefinir senha
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
