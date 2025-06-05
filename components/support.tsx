"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, MessageCircle, Phone, Mail, Clock, Search, ChevronRight, CheckCircle } from "lucide-react"

interface User {
  name: string
  cpf: string
  balance: number
  accountNumber: string
  agency: string
}

interface SupportProps {
  user: User
}

export function Support({ user }: SupportProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const faqItems = [
    {
      id: 1,
      category: "PIX",
      question: "Como fazer um PIX?",
      answer:
        "Para fazer um PIX, vá até a aba PIX, digite a chave do destinatário, o valor e confirme a transferência com sua senha.",
    },
    {
      id: 2,
      category: "PIX",
      question: "Qual o limite do PIX?",
      answer: "O limite padrão do PIX é de R$ 1.000 durante o dia e R$ 1.000 durante a noite (20h às 6h).",
    },
    {
      id: 5,
      category: "Conta",
      question: "Como alterar minha senha?",
      answer: "Vá em Configurações > Segurança > Alterar Senha. Digite sua senha atual e a nova senha duas vezes.",
    },
    {
      id: 6,
      category: "Transferência",
      question: "Qual a diferença entre TED e DOC?",
      answer:
        "TED é processada no mesmo dia útil, enquanto DOC é processada no próximo dia útil. TED tem taxa de até R$ 5,00.",
    },
  ]

  const tickets: any[] = []

  const contactOptions = [
    {
      type: "chat",
      title: "Chat Online",
      description: "Fale conosco agora",
      availability: "24h por dia",
      icon: MessageCircle,
    },
    {
      type: "phone",
      title: "Telefone",
      description: "0800 123 4567",
      availability: "Seg-Sex: 8h às 20h",
      icon: Phone,
    },
    {
      type: "email",
      title: "E-mail",
      description: "suporte@neobank.com",
      availability: "Resposta em até 24h",
      icon: Mail,
    },
  ]

  const filteredFAQ = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmitTicket = async () => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitMessage({ type: "success", text: "Ticket criado com sucesso! Você receberá uma resposta em breve." })
      setMessage("")
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Erro ao enviar ticket. Tente novamente." })
    }

    setIsSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Resolvido":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Média":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Baixa":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suporte</h2>
          <p className="text-gray-600 dark:text-gray-400">Estamos aqui para ajudar você</p>
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="ticket">Novo Ticket</TabsTrigger>
          <TabsTrigger value="tickets">Meus Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Busca e Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>Encontre respostas para as dúvidas mais comuns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar nas perguntas frequentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Todas as categorias</option>
                  <option value="PIX">PIX</option>
                  <option value="Conta">Conta</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de FAQ */}
          <div className="space-y-4">
            {filteredFAQ.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <h4 className="font-medium mb-2">{item.question}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredFAQ.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">Nenhuma pergunta encontrada</p>
                  <p className="text-sm text-gray-500 mt-1">Tente usar outros termos de busca</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <Card key={option.type} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{option.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{option.description}</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {option.availability}
                  </div>
                  <Button className="w-full mt-4">Entrar em Contato</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ticket" className="space-y-6">
          {/* Mensagem de feedback */}
          {submitMessage && (
            <Card
              className={`border-l-4 ${
                submitMessage.type === "success"
                  ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-l-red-500 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${submitMessage.type === "success" ? "text-green-600" : "text-red-600"}`}
                  />
                  <p
                    className={`font-medium ${
                      submitMessage.type === "success"
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {submitMessage.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Abrir Novo Ticket</CardTitle>
              <CardDescription>Descreva seu problema e nossa equipe entrará em contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={user.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" placeholder="seu@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Descreva brevemente o problema" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <select className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value="">Selecione uma categoria</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência</option>
                  <option value="conta">Conta</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva detalhadamente seu problema..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>

              <Button onClick={handleSubmitTicket} disabled={!message || isSubmitting} className="w-full">
                {isSubmitting ? "Enviando..." : "Enviar Ticket"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Tickets</CardTitle>
              <CardDescription>Acompanhe o status dos seus chamados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ticket #{ticket.id} • {ticket.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </div>
                </div>
              ))}

              {tickets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum ticket encontrado</p>
                  <p className="text-sm">Seus chamados aparecerão aqui</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
