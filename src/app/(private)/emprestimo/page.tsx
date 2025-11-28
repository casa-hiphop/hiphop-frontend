import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Solicitação de Empréstimo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Solicitação de Empréstimo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="text-base bg-red-600  hover:bg-red-500"
            >
              Emprestar Ferramentas
            </Button>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Atenção
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-red-600 text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                ⚠
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
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 bg-black">
          <div className="flex flex-col md:flex-row justify-between items-center text-white gap-4">
            <div className="text-sm  text-white">
              © 2025 Ferramentoteca Casa do Hip Hop. Todos os direitos
              reservados.
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-white hover:text-foreground transition-colors"
              >
                Privacidade
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-foreground transition-colors"
              >
                Termos
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-foreground transition-colors"
              >
                Contatos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}