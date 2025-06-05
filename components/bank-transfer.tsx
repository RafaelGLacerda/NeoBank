"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Users, Clock } from "lucide-react"

interface User {
  name: string
  cpf: string
  balance: number
  accountNumber: string
  agency: string
}

interface BankTransferProps {
  user: User
}

export function BankTransfer({ user }: BankTransferProps) {
  const [bank, setBank] = useState("")
  const [agency, setAgency] = useState("")
  const [account, setAccount] = useState("")
  const [accountType, setAccountType] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientCPF, setRecipientCPF] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [transferType, setTransferType] = useState("ted")
  const [isLoading, setIsLoading] = useState(false)

  const banks = [
    { code: "001", name: "Banco do Brasil" },
    { code: "104", name: "Caixa Econômica Federal" },
    { code: "237", name: "Bradesco" },
    { code: "341", name: "Itaú" },
    { code: "033", name: "Santander" },
    { code: "260", name: "Nu Pagamentos" },
    { code: "077", name: "Inter" },
    { code: "290", name: "PagSeguro" },
  ]

  const savedContacts = [
    {
      id: 1,
      name: "Maria Silva",
      bank: "Itaú",
      agency: "1234",
      account: "12345-6",
      type: "Conta Corrente",
    },
    {
      id: 2,
      name: "João Santos",
      bank: "Bradesco",
      agency: "5678",
      account: "98765-4",
      type: "Conta Poupança",
    },
  ]

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const amount = Number.parseFloat(numbers) / 100
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setAmount(value)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    if (formatted.length <= 14) {
      setRecipientCPF(formatted)
    }
  }

  const handleTransfer = async () => {
    setIsLoading(true)
    // Simular transferência
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    alert(`${transferType.toUpperCase()} enviada com sucesso!`)
    // Reset form
    resetForm()
  }

  const resetForm = () => {
    setBank("")
    setAgency("")
    setAccount("")
    setAccountType("")
    setRecipientName("")
    setRecipientCPF("")
    setAmount("")
    setDescription("")
  }

  const loadContact = (contact: any) => {
    setRecipientName(contact.name)
    setBank(contact.bank)
    setAgency(contact.agency)
    setAccount(contact.account)
    setAccountType(contact.type)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transferências</h2>
          <p className="text-gray-600 dark:text-gray-400">Envie dinheiro para outras contas bancárias</p>
        </div>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Nova Transferência</TabsTrigger>
          <TabsTrigger value="contacts">Contatos Salvos</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Nova Transferência
              </CardTitle>
              <CardDescription>Preencha os dados do destinatário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tipo de Transferência */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Transferência</Label>
                  <Select value={transferType} onValueChange={setTransferType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ted">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          <div>
                            <p>TED</p>
                            <p className="text-xs text-gray-500">Até R$ 5,00</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="doc">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <div>
                            <p>DOC</p>
                            <p className="text-xs text-gray-500">Próximo dia útil</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dados do Destinatário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Nome do Destinatário</Label>
                  <Input
                    id="recipientName"
                    placeholder="Nome completo"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientCPF">CPF do Destinatário</Label>
                  <Input
                    id="recipientCPF"
                    placeholder="000.000.000-00"
                    value={recipientCPF}
                    onChange={handleCPFChange}
                  />
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Banco</Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bankItem) => (
                        <SelectItem key={bankItem.code} value={bankItem.code}>
                          {bankItem.code} - {bankItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency">Agência</Label>
                  <Input id="agency" placeholder="0000" value={agency} onChange={(e) => setAgency(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Conta</Label>
                  <Input
                    id="account"
                    placeholder="00000-0"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Tipo de Conta</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Conta Corrente</SelectItem>
                    <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Valor e Descrição */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    placeholder="R$ 0,00"
                    value={amount ? formatCurrency(amount) : ""}
                    onChange={handleAmountChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Motivo da transferência"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleTransfer}
                disabled={!bank || !agency || !account || !recipientName || !amount || isLoading}
                className="w-full"
              >
                {isLoading ? "Enviando..." : `Enviar ${transferType.toUpperCase()}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contatos Salvos
              </CardTitle>
              <CardDescription>Transfira rapidamente para contatos salvos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.bank} • Ag: {contact.agency} • Conta: {contact.account}
                    </p>
                    <p className="text-xs text-gray-500">{contact.type}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => loadContact(contact)}>
                    Usar
                  </Button>
                </div>
              ))}

              {savedContacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum contato salvo ainda</p>
                  <p className="text-sm">Faça uma transferência para salvar contatos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
