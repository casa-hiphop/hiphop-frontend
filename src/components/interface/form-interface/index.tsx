import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

type Props = {
  id_prop: string
  onClickButton: () => void
  backPath: string
  children: ReactNode
  isSubmiting: boolean
  adicionalContent?: ReactNode
}

export default function FormInterface({ id_prop, children, backPath, onClickButton, isSubmiting, adicionalContent }: Props) {
  const { isMobile } = useSidebar()

  const isNew = id_prop === 'new'

  return (
    <div className="flex flex-col gap-2 lg:max-w-4xl pb-16">
      <div className={`sticky px-2 bg-[var(--background)] top-12 z-50 ${isMobile ? 'border-b rounded-b-2xl' : 'border-b'}`}>
        <div className="flex items-center justify-between my-2">
          <Link href={backPath}>
            <Button variant='ghost' disabled={isSubmiting}>
              <ArrowLeft />
              <span className="text-[1rem]">Voltar</span>
            </Button>
          </Link>

          <Button size='lg' onClick={onClickButton} disabled={isSubmiting}>
            <span className="text-[1rem]">{isNew ? 'Criar' : 'Salvar'}</span>
          </Button>
        </div>

        {adicionalContent && <div className="py-2">{adicionalContent}</div> }
      </div>

      <div className={`pt-4 ${isMobile ? 'px-2' : 'px-6'}`}>
        {children}
      </div>
    </div>
  )
}