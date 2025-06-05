"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  EyeOff,
  Send,
  Receipt,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Building2,
  Shield,
  TrendingUp,
} from "lucide-react"
import { useTheme } from "next-themes"
import { PIXTransfer } from "./pix-transfer"
import { BankTransfer } from "./bank-transfer"
import { Statement } from "./statement"
import { getTransactions } from "@/lib/api"

interface User {
  name: string
  cpf: string
  balance: number
  accountNumber: string
  agency: string
}

interface DashboardProps {
  user: User
  onLogout: () => void
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

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [currentUser, setCurrentUser] = useState(user)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadRecentTransactions()
  }, [])

  const loadRecentTransactions = async () => {
    try {
      const allTransactions = await getTransactions()
      // Filtrar transações do usuário atual e pegar as 3 mais recentes
      const userTransactions = allTransactions
        .filter((transaction) => transaction.fromCPF === currentUser.cpf || transaction.toCPF === currentUser.cpf)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)

      setRecentTransactions(userTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleBalanceUpdate = (newBalance: number) => {
    setCurrentUser((prev) => ({ ...prev, balance: newBalance }))
    loadRecentTransactions() // Recarregar transações após atualização
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NeoBank
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Olá, {currentUser.name.split(" ")[0]}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Início</span>
            </TabsTrigger>
            <TabsTrigger value="pix" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">PIX</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Transferir</span>
            </TabsTrigger>
            <TabsTrigger value="statement" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Extrato</span>
            </TabsTrigger>
            <TabsTrigger value="more" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Mais</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardDescription className="text-blue-100">Saldo disponível</CardDescription>
                    <CardTitle className="text-3xl font-bold flex items-center gap-2">
                      {showBalance ? formatCurrency(currentUser.balance) : "••••••"}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-white hover:bg-white/20"
                      >
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Conta</p>
                    <p className="font-mono">
                      {currentUser.agency}-{currentUser.accountNumber}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab("pix")}>
                <QrCode className="h-6 w-6" />
                <span>PIX</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab("transfer")}>
                <Send className="h-6 w-6" />
                <span>Transferir</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab("statement")}>
                <Receipt className="h-6 w-6" />
                <span>Extrato</span>
              </Button>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Últimas transações
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("statement")}>
                    Ver todas
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.amount > 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Concluída
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma transação ainda</p>
                    <p className="text-sm">Suas transações aparecerão aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pix">
            <PIXTransfer user={currentUser} onBalanceUpdate={handleBalanceUpdate} />
          </TabsContent>

          <TabsContent value="transfer">
            <BankTransfer user={currentUser} />
          </TabsContent>

          <TabsContent value="statement">
            <Statement user={currentUser} />
          </TabsContent>

          <TabsContent value="more" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações
                  </CardTitle>
                  <CardDescription>Gerencie sua conta e preferências</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Suporte
                  </CardTitle>
                  <CardDescription>Precisa de ajuda? Fale conosco</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Segurança
                  </CardTitle>
                  <CardDescription>Altere senhas e configure segurança</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investimentos
                  </CardTitle>
                  <CardDescription>Faça seu dinheiro render mais</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
