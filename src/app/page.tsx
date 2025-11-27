import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, BarChart3, Clock, Shield } from "lucide-react";
import Image from "next/image";
import logo_casa_do_hip_hop from "@/app/assets/logo_casa_do_hip_hop.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Image
            src={logo_casa_do_hip_hop}
            alt="Logo"
            height={80}
            className="h-20 w-auto"
          />
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-md text-black hover:text-foreground  transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#how-it-works"
              className="text-md text-black hover:text-foreground transition-colors"
            >
              Venha fazer parte
            </a>
            <Button variant="outline" size="lg">
              Entrar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Casa do Hip Hop Ferramentoteca
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Emprestamos ferramentas para quem precisa, fortalecendo a
            colaboração e reduzindo gastos na comunidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="text-base bg-red-600 hover hover-white"
            >
              Quero Emprestar Ferramentas
            </Button>
            <Button size="lg" variant="outline" className="text-white bg-black">
              Quero Devolver / Consultar Empréstimos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-black ">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-100 mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Escolha sua ferramenta</h3>
              <p className="text-sm text-muted-foreground">
                Consulte nossa ferramentoteca com os itens
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Solicite o empréstimo</h3>
              <p className="text-sm text-muted-foreground">
                Escolha as ferramentas dentre as disponiveis
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg">
                Retire no local combinado
              </h3>
              <p className="text-sm text-muted-foreground">
                Retire o item no local combinado e caso necessário peça
                orientações de uso
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className=" w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white " />
              </div>
              <h3 className="font-semibold text-lg">Devolva no prazo</h3>
              <p className="text-sm text-muted-foreground">
                Assim todos podem usar e manter o ciclo funcionando
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Benefícios para a Comunidade
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-red-600 text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Integração social
                </h3>
                <p className="text-muted-foreground">
                  O ponto de retirada se torna um local de convivência, troca de
                  experiências e apoio mútuo.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-red-600 text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Organização</h3>
                <p className="text-muted-foreground">
                  O sistema de empréstimo cria um fluxo controlado e
                  transparente, garantindo que tudo seja devolvido no prazo e
                  mantido em boas condições.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-red-600 text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Empoderamento</h3>
                <p className="text-muted-foreground">
                  Com ferramentas acessíveis, a comunidade conquista autonomia
                  para reformar, construir e realizar pequenos reparos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-red-600">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl text-white font-bold">
            Vamos construir juntos uma comunidade mais forte e melhor para todos
          </h2>
          <p className="text-lg text-gray-100">
            Compartilhe, economize e ajude o próximo
          </p>
          <Button size="lg" className="text-base bg-white text-">
            Participar da Ferramentoteca
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 bg-black">
          <div className="flex flex-col md:flex-row justify-between items-center text-white gap-4">
            <div className="text-sm  text-white">
              © 2025 Ferramentoteca Casa do Hip Hop. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-white hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
