"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QrCode, Scan, Send, Copy, Check, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getAccounts, updateAccounts, saveTransaction } from "@/lib/api"

interface User {
  name: string
  cpf: string
  balance: number
  accountNumber: string
  agency: string
}

interface PIXTransferProps {
  user: User
  onBalanceUpdate?: (newBalance: number) => void
}

interface StoredAccount {
  cpf: string
  password: string
  name: string
  balance: number
  accountNumber: string
  agency: string
  createdAt: string
}

interface Transaction {
  id: string
  type: string
  description: string
  amount: number
  date: Date
  status: string
  category: string
  fromCPF?: string
  toCPF?: string
}

export function PIXTransfer({ user, onBalanceUpdate }: PIXTransferProps) {
  const [pixKey, setPixKey] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)

  const myPixKeys = [
    { type: "CPF", key: user.cpf, primary: true },
    { type: "Email", key: "usuario@email.com", primary: false },
    { type: "Telefone", key: "+55 11 99999-9999", primary: false },
    { type: "Chave Aleatória", key: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", primary: false },
  ]

  // Validar CPF
  const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0

    if (Number.parseInt(cleanCPF.charAt(9)) !== digit1) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0

    return Number.parseInt(cleanCPF.charAt(10)) === digit2
  }

  // Formatar CPF automaticamente
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const amount = Number.parseFloat(numbers) / 100
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setAmount(value)
  }

  const handlePixKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Se contém apenas números, formatar como CPF
    if (/^\d+$/.test(value.replace(/\D/g, ""))) {
      const formatted = formatCPF(value)
      if (formatted.length <= 14) {
        setPixKey(formatted)
      }
    } else {
      // Para outros tipos de chave (email, telefone, etc.)
      setPixKey(value)
    }
  }

  const handleTransfer = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Validações
      if (!pixKey.trim()) {
        setMessage({ type: "error", text: "Digite uma chave PIX válida" })
        setIsLoading(false)
        return
      }

      if (!amount || Number.parseFloat(amount) === 0) {
        setMessage({ type: "error", text: "Digite um valor válido" })
        setIsLoading(false)
        return
      }

      const transferAmount = Number.parseFloat(amount) / 100

      if (transferAmount > user.balance) {
        setMessage({ type: "error", text: "Saldo insuficiente" })
        setIsLoading(false)
        return
      }

      // Verificar se a chave PIX é um CPF válido
      let destinationCPF = ""
      if (isValidCPF(pixKey)) {
        destinationCPF = pixKey.replace(/\D/g, "")
      } else {
        setMessage({ type: "error", text: "Chave PIX inválida. Use um CPF válido." })
        setIsLoading(false)
        return
      }

      // Verificar se não está enviando para si mesmo
      if (destinationCPF === user.cpf.replace(/\D/g, "")) {
        setMessage({ type: "error", text: "Você não pode enviar PIX para si mesmo" })
        setIsLoading(false)
        return
      }

      // Buscar conta de destino
      const accounts = await getAccounts()
      const destinationAccount = accounts.find((acc) => acc.cpf.replace(/\D/g, "") === destinationCPF)

      if (!destinationAccount) {
        setMessage({ type: "error", text: "Chave PIX não encontrada" })
        setIsLoading(false)
        return
      }

      // Simular delay de transferência
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Atualizar saldos
      const senderAccount = accounts.find((acc) => acc.cpf.replace(/\D/g, "") === user.cpf.replace(/\D/g, ""))
      if (senderAccount) {
        senderAccount.balance -= transferAmount
        destinationAccount.balance += transferAmount

        await updateAccounts(accounts)

        // Atualizar sessão do usuário atual
        const updatedUser = { ...user, balance: senderAccount.balance }
        localStorage.setItem("neobank-session", JSON.stringify(updatedUser))

        // Chamar callback para atualizar o saldo na interface
        if (onBalanceUpdate) {
          onBalanceUpdate(senderAccount.balance)
        }
      }

      // Criar transações
      const transactionId = Date.now().toString()

      // Transação de saída (remetente)
      const outgoingTransaction: Transaction = {
        id: `${transactionId}_out`,
        type: "pix_sent",
        description: `PIX enviado para ${destinationAccount.name}`,
        amount: -transferAmount,
        date: new Date(),
        status: "completed",
        category: "Transferência",
        fromCPF: user.cpf,
        toCPF: destinationAccount.cpf,
      }

      // Transação de entrada (destinatário)
      const incomingTransaction: Transaction = {
        id: `${transactionId}_in`,
        type: "pix_received",
        description: `PIX recebido de ${user.name}`,
        amount: transferAmount,
        date: new Date(),
        status: "completed",
        category: "Transferência",
        fromCPF: user.cpf,
        toCPF: destinationAccount.cpf,
      }

      await saveTransaction(outgoingTransaction)
      await saveTransaction(incomingTransaction)

      setMessage({
        type: "success",
        text: `PIX de ${formatCurrency(amount)} enviado com sucesso para ${destinationAccount.name}!`,
      })

      // Reset form
      setPixKey("")
      setAmount("")
      setDescription("")
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao processar PIX. Tente novamente." })
    }

    setIsLoading(false)
  }

  const generateQRCode = () => {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5RUiBDb2RlIFBJWDwvdGV4dD4KPC9zdmc+"
  }

  const copyPixKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setMessage({ type: "success", text: "Chave PIX copiada!" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">PIX</h2>
          <p className="text-gray-600 dark:text-gray-400">Transferências instantâneas 24h por dia</p>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <Card
          className={`border-l-4 ${
            message.type === "success"
              ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
              : message.type === "error"
                ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {message.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
              {message.type === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
              <p
                className={`font-medium ${
                  message.type === "success"
                    ? "text-green-800 dark:text-green-200"
                    : message.type === "error"
                      ? "text-red-800 dark:text-red-200"
                      : "text-blue-800 dark:text-blue-200"
                }`}
              >
                {message.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Enviar</TabsTrigger>
          <TabsTrigger value="receive">Receber</TabsTrigger>
          <TabsTrigger value="keys">Minhas Chaves</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar PIX
              </CardTitle>
              <CardDescription>Digite a chave PIX do destinatário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pixKey">Chave PIX (CPF)</Label>
                <Input id="pixKey" placeholder="000.000.000-00" value={pixKey} onChange={handlePixKeyChange} />
                <p className="text-xs text-gray-500">Digite apenas números para formatar automaticamente como CPF</p>
              </div>

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
                  placeholder="Para que é essa transferência?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button onClick={handleTransfer} disabled={!pixKey || !amount || isLoading} className="w-full">
                {isLoading ? "Enviando..." : "Enviar PIX"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code PIX
                </CardTitle>
                <CardDescription>Gere um QR Code para receber pagamentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receiveAmount">Valor (opcional)</Label>
                  <Input id="receiveAmount" placeholder="R$ 0,00" onChange={handleAmountChange} />
                </div>

                <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Gerar QR Code</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>QR Code PIX</DialogTitle>
                      <DialogDescription>Escaneie o código para fazer o pagamento</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-white rounded-lg">
                        <img src={generateQRCode() || "/placeholder.svg"} alt="QR Code PIX" className="w-48 h-48" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Valor: R$ 50,00</p>
                        <p className="text-xs text-gray-500 mt-1">Válido por 30 minutos</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Ler QR Code
                </CardTitle>
                <CardDescription>Escaneie um QR Code para fazer pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Scan className="h-4 w-4 mr-2" />
                  Abrir Câmera
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Chaves PIX</CardTitle>
              <CardDescription>Gerencie suas chaves PIX cadastradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myPixKeys.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={key.primary ? "default" : "secondary"}>{key.type}</Badge>
                      {key.primary && <Badge variant="outline">Principal</Badge>}
                    </div>
                    <p className="font-mono text-sm mt-1 text-gray-600 dark:text-gray-400">{key.key}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyPixKey(key.key)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Cadastrar Nova Chave
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
