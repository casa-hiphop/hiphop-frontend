"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import logo_casa_do_hip_hop from "@/app/assets/logo_casa_do_hip_hop.png";

const CASA_SITE = "https://www.casadohiphop.com.br/";
const CONTACT_EMAIL = "casadeculturahiphop@gmail.com";
const PHONE_DISPLAY = "(19) 99198-8822";
const PHONE_HREF = "tel:+5519991988822";
const CNPJ = "11.569.202/0001-75";

export default function Landing() {
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-[#f2f0e9] text-stone-800 antialiased selection:bg-amber-200/60 selection:text-stone-900">
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(231 229 228 / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(231 229 228 / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fdfcf8]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-8">
            <Image
              src={logo_casa_do_hip_hop}
              alt="Casa do Hip Hop Piracicaba"
              height={72}
              className="h-[4.25rem] w-auto"
              priority
            />
            <nav className="hidden items-center gap-1 md:flex">
              {[
                ["Empresta Aí", "#empresta-ai"],
                ["Como funciona", "#como-funciona"],
                ["Comunidade", "#comunidade"],
                ["Contato", "#contato"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                >
                  {label}
                </a>
              ))}
              <Button
                variant="outline"
                size="default"
                className="ml-3 rounded-full border-stone-200 bg-white shadow-sm"
                onClick={() => router.push("/login")}
              >
                Entrar
              </Button>
            </nav>
            <Button
              className="rounded-full md:hidden"
              size="sm"
              variant="outline"
              onClick={() => router.push("/login")}
            >
              Entrar
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-12 md:px-8 md:pt-16 lg:pt-20">
          {/* Hero */}
          <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-200/80 bg-amber-50 px-3 py-1 text-amber-900"
                >
                  <Sparkles className="size-3.5" />
                  Ferramentoteca digital
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-stone-200/80 text-stone-800"
                >
                  Piracicaba · SP
                </Badge>
              </div>
              <div className="space-y-5">
                <h1 className="font-sans text-4xl font-semibold tracking-tight text-balance text-stone-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                  Empresta Aí: a comunidade se ajudando no conserto e no reparo
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-stone-600 md:text-xl">
                  Projeto da{" "}
                  <Link
                    href={CASA_SITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-stone-900 underline decoration-amber-400/80 underline-offset-4 transition hover:decoration-amber-500"
                  >
                    Casa do Hip Hop
                  </Link>
                  . Acreditamos no poder da rede colaborativa: inclua ferramentas
                  e equipamentos, empreste quando precisar e devolva com
                  responsabilidade — o que é de um é de todos.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-red-600 px-8 text-base shadow-lg shadow-red-600/25 transition hover:bg-red-500"
                  onClick={() => router.push("/register")}
                >
                  Quero participar da rede
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-stone-300 bg-white px-8 text-base shadow-sm transition hover:bg-stone-50"
                  onClick={() => router.push("/login")}
                >
                  Devolver ou consultar empréstimos
                </Button>
              </div>
              <p className="text-sm text-stone-500">
                Associação comunitária, cultural, educativa e política — fortalecendo
                vínculos na Zona Norte e em toda Piracicaba.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -right-6 -top-6 size-72 rounded-full bg-gradient-to-br from-amber-200/50 to-red-200/40 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 size-56 rounded-full bg-stone-300/30 blur-3xl" />
              <Card className="relative overflow-hidden rounded-[2rem] border-stone-200/80 bg-[#fdfcf8] p-8 shadow-2xl shadow-stone-300/40">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-stone-500">
                    Resumo do projeto
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    Rede ativa
                  </span>
                </div>
                <div className="grid gap-4">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 text-white shadow-inner">
                    <div className="absolute right-0 top-0 size-32 rounded-full bg-red-500/20 blur-2xl" />
                    <Wrench className="relative mb-3 size-8 text-amber-200" />
                    <p className="relative text-lg font-medium leading-snug">
                      Ferramentas e equipamentos para reformar, construir e
                      cuidar do que é coletivo.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                      <Users className="mb-2 size-5 text-amber-700" />
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        Comunidade
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-900">
                        Troca e apoio mútuo
                      </p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                      <Shield className="mb-2 size-5 text-amber-700" />
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        Compromisso
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-900">
                        Prazo e cuidado
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Quote */}
          <section
            id="empresta-ai"
            className="mx-auto mt-20 max-w-4xl scroll-mt-28 text-center md:mt-28"
          >
            <blockquote className="rounded-[2rem] border border-stone-200/90 bg-[#fdfcf8] px-6 py-10 shadow-xl shadow-stone-200/50 md:px-12">
              <p className="text-xl font-medium leading-relaxed text-stone-800 md:text-2xl">
                “O que é de um é de todos — cuidamos das ferramentas como se
                fossem nossas, porque são.”
              </p>
              <footer className="mt-6 text-sm font-medium text-amber-800">
                Espírito do Empresta Aí · Casa do Hip Hop
              </footer>
            </blockquote>
          </section>

          {/* Steps */}
          <section
            id="como-funciona"
            className="mt-20 scroll-mt-28 md:mt-28"
          >
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                  Como funciona
                </h2>
                <p className="mt-2 max-w-2xl text-stone-600">
                  Um fluxo simples para manter a ferramentoteca organizada e
                  acessível a quem precisa.
                </p>
              </div>
              <Button
                variant="ghost"
                className="hidden w-fit rounded-full text-stone-700 hover:bg-stone-200/60 md:inline-flex"
                asChild
              >
                <Link href={CASA_SITE} target="_blank" rel="noopener noreferrer">
                  Conheça o projeto no site
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Wrench,
                  title: "Escolha o que precisa",
                  text: "Consulte itens disponíveis na ferramentoteca e planeje seu uso com antecedência.",
                },
                {
                  icon: Clock,
                  title: "Solicite o empréstimo",
                  text: "Registre a retirada e combine prazos — clareza para todos na rede.",
                },
                {
                  icon: MapPin,
                  title: "Retire no local combinado",
                  text: "O ponto de entrega é também espaço de convivência e troca de experiências.",
                },
                {
                  icon: CheckCircle2,
                  title: "Devolva no prazo",
                  text: "Assim o ciclo continua: mais gente reforma, constrói e resolve o dia a dia.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <Card
                  key={title}
                  className="group rounded-2xl border-stone-200/90 bg-white p-6 shadow-md shadow-stone-200/40 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md shadow-red-600/25 transition group-hover:scale-[1.02]">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-stone-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {text}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section
            id="comunidade"
            className="mt-20 scroll-mt-28 md:mt-28"
          >
            <div className="overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-950 text-stone-100 shadow-2xl shadow-stone-900/30">
              <div className="grid lg:grid-cols-2">
                <div className="space-y-6 p-8 md:p-12 lg:p-14">
                  <Badge className="rounded-full bg-amber-400/20 text-amber-100 hover:bg-amber-400/25">
                    <HeartHandshake className="size-3.5" />
                    Benefícios para a comunidade
                  </Badge>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Integração, organização e empoderamento
                  </h2>
                  <p className="text-stone-400 leading-relaxed">
                    Oficinas, biblioteca, estúdio, horta e muitas frentes
                    somam-se ao Empresta Aí — cada ação fortalece vínculos e
                    autonomia no território.
                  </p>
                  <ul className="space-y-5">
                    {[
                      {
                        n: "1",
                        title: "Integração social",
                        body: "O ponto de retirada vira convivência, escuta e apoio mútuo entre vizinhança e coletivos.",
                      },
                      {
                        n: "2",
                        title: "Organização",
                        body: "Empréstimos com registro e transparência: tudo no prazo e em bom estado para a próxima pessoa.",
                      },
                      {
                        n: "3",
                        title: "Empoderamento",
                        body: "Com ferramentas acessíveis, a comunidade ganha autonomia para reformar e realizar reparos.",
                      },
                    ].map((item) => (
                      <li key={item.n} className="flex gap-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                          {item.n}
                        </span>
                        <div>
                          <h3 className="font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-stone-400 leading-relaxed">
                            {item.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative flex min-h-[320px] items-end bg-gradient-to-br from-red-900/40 via-stone-900 to-stone-950 p-8 md:p-12 lg:min-h-full lg:p-14">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
                  <div className="relative space-y-4">
                    <p className="text-sm font-medium uppercase tracking-widest text-amber-200/90">
                      Casa do Hip Hop
                    </p>
                    <p className="max-w-md text-lg leading-relaxed text-stone-200">
                      Cultura hip hop, educação e políticas públicas populares —
                      construindo futuro com quem vive a quebrada.
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-2 rounded-full bg-white text-stone-900 hover:bg-stone-100"
                      asChild
                    >
                      <Link
                        href={CASA_SITE}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visitar casadohiphop.com.br
                        <ExternalLink className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contato" className="mt-20 scroll-mt-28 md:mt-28">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
              Fale com a Casa
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-stone-600">
              Os mesmos canais do projeto presencial — estamos na rede para
              somar.
            </p>
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
              <Card className="rounded-2xl border-stone-200 bg-white p-6 text-center shadow-md">
                <Mail className="mx-auto mb-3 size-8 text-amber-700" />
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  E-mail
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 block text-sm font-medium text-stone-900 underline-offset-4 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </Card>
              <Card className="rounded-2xl border-stone-200 bg-white p-6 text-center shadow-md">
                <Phone className="mx-auto mb-3 size-8 text-amber-700" />
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Telefone
                </p>
                <a
                  href={PHONE_HREF}
                  className="mt-2 block text-sm font-medium text-stone-900 underline-offset-4 hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>
              </Card>
              <Card className="rounded-2xl border-stone-200 bg-white p-6 text-center shadow-md">
                <MapPin className="mx-auto mb-3 size-8 text-amber-700" />
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  CNPJ
                </p>
                <p className="mt-2 text-sm font-medium text-stone-900">
                  {CNPJ}
                </p>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 md:mt-28">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-600 via-red-600 to-red-800 p-10 text-center shadow-2xl shadow-red-900/25 md:p-14">
              <h2 className="text-2xl font-semibold tracking-tight text-white text-balance md:text-3xl">
                Vamos construir juntos uma comunidade mais forte
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-red-100">
                Compartilhe, economize e ajude o próximo — a ferramentoteca
                digital é mais um braço dessa rede.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-white px-8 text-base text-stone-900 shadow-lg hover:bg-stone-100"
                  onClick={() => router.push("/register")}
                >
                  Participar da ferramentoteca
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-transparent px-8 text-base text-white hover:bg-white/10"
                  onClick={() => router.push("/login")}
                >
                  Já tenho cadastro
                </Button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-stone-200 bg-[#1c1917] text-stone-400">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="space-y-2">
              <p className="text-sm text-stone-300">
                © {new Date().getFullYear()} Ferramentoteca · Casa do Hip Hop
                Piracicaba
              </p>
              <p className="max-w-md text-xs leading-relaxed">
                Associação Comunitária, Cultural, Educativa e Política Casa do
                Hip Hop de Piracicaba — CNPJ {CNPJ}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Link
                href={CASA_SITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 transition hover:text-white"
              >
                Site institucional
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-white">
                Contato
              </a>
              <Link href="/login" className="transition hover:text-white">
                Acesso ao sistema
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
