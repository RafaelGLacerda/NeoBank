"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2, UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { Dashboard } from "@/components/dashboard"
import { getAccounts, saveAccount } from "@/lib/api"

interface User {
  name: string
  cpf: string
  balance: number
  accountNumber: string
  agency: string
  password: string
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

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)

  // Validar CPF
  const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "")

    if (cleanCPF.length !== 11) return false

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    // Validar primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0

    if (Number.parseInt(cleanCPF.charAt(9)) !== digit1) return false

    // Validar segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0

    return Number.parseInt(cleanCPF.charAt(10)) === digit2
  }

  // Gerar número de conta único
  const generateAccountNumber = async (): Promise<string> => {
    const accounts = await getAccounts()
    let accountNumber: string

    do {
      accountNumber = Math.floor(100000 + Math.random() * 900000).toString()
    } while (accounts.some((acc) => acc.accountNumber === accountNumber))

    return accountNumber
  }

  // Verificar se CPF já existe
  const cpfExists = async (cpf: string): Promise<boolean> => {
    const accounts = await getAccounts()
    const cleanCPF = cpf.replace(/\D/g, "")
    return accounts.some((acc) => acc.cpf.replace(/\D/g, "") === cleanCPF)
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    if (formatted.length <= 14) {
      setCpf(formatted)
      setMessage(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Validar CPF
      if (!isValidCPF(cpf)) {
        setMessage({ type: "error", text: "CPF inválido" })
        setIsLoading(false)
        return
      }

      // Verificar se a conta existe
      const accounts = await getAccounts()
      const cleanCPF = cpf.replace(/\D/g, "")
      const account = accounts.find((acc) => acc.cpf.replace(/\D/g, "") === cleanCPF && acc.password === password)

      if (!account) {
        setMessage({ type: "error", text: "CPF ou senha incorretos" })
        setIsLoading(false)
        return
      }

      // Simular delay de autenticação
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        name: account.name,
        cpf: account.cpf,
        balance: account.balance,
        accountNumber: account.accountNumber,
        agency: account.agency,
        password: account.password,
      }

      setUser(userData)
      setIsLoggedIn(true)
      setIsLoading(false)

      // Salvar sessão
      localStorage.setItem("neobank-session", JSON.stringify(userData))
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao fazer login. Tente novamente." })
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Validações
      if (!name.trim()) {
        setMessage({ type: "error", text: "Nome é obrigatório" })
        setIsLoading(false)
        return
      }

      if (!isValidCPF(cpf)) {
        setMessage({ type: "error", text: "CPF inválido" })
        setIsLoading(false)
        return
      }

      if (await cpfExists(cpf)) {
        setMessage({ type: "error", text: "CPF já cadastrado" })
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setMessage({ type: "error", text: "Senha deve ter pelo menos 6 caracteres" })
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Senhas não coincidem" })
        setIsLoading(false)
        return
      }

      // Simular delay de criação
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Criar nova conta
      const newAccount: StoredAccount = {
        cpf: cpf,
        password: password,
        name: name.trim(),
        balance: 5000, // Saldo inicial de R$ 5.000
        accountNumber: await generateAccountNumber(),
        agency: "0001",
        createdAt: new Date().toISOString(),
      }

      const success = await saveAccount(newAccount)

      if (!success) {
        setMessage({ type: "error", text: "Erro ao criar conta. Tente novamente." })
        setIsLoading(false)
        return
      }

      // Fazer login automático
      const userData: User = {
        name: newAccount.name,
        cpf: newAccount.cpf,
        balance: newAccount.balance,
        accountNumber: newAccount.accountNumber,
        agency: newAccount.agency,
        password: newAccount.password,
      }

      setUser(userData)
      setIsLoggedIn(true)
      setIsLoading(false)

      // Salvar sessão
      localStorage.setItem("neobank-session", JSON.stringify(userData))
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao criar conta. Tente novamente." })
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setCpf("")
    setPassword("")
    setName("")
    setConfirmPassword("")
    setMessage(null)
    localStorage.removeItem("neobank-session")
  }

  // Verificar sessão salva ao carregar
  useEffect(() => {
    const savedSession = localStorage.getItem("neobank-session")
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        localStorage.removeItem("neobank-session")
      }
    }
  }, [])

  if (isLoggedIn && user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NeoBank
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Seu banco digital do futuro</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isCreatingAccount ? "Criar Conta" : "Entrar"}
            </CardTitle>
            <CardDescription className="text-center">
              {isCreatingAccount
                ? "Preencha os dados para criar sua conta"
                : "Digite suas credenciais para acessar sua conta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mensagem de feedback */}
            {message && (
              <Card
                className={`mb-4 border-l-4 ${
                  message.type === "success"
                    ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                    : message.type === "error"
                      ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    {message.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {message.type === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                    <p
                      className={`text-sm font-medium ${
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

            <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin} className="space-y-4">
              {isCreatingAccount && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCPFChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isCreatingAccount ? "Mínimo 6 caracteres" : "Digite sua senha"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {isCreatingAccount && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading
                  ? isCreatingAccount
                    ? "Criando conta..."
                    : "Entrando..."
                  : isCreatingAccount
                    ? "Criar Conta"
                    : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Button
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => {
                  setIsCreatingAccount(!isCreatingAccount)
                  setMessage(null)
                  setCpf("")
                  setPassword("")
                  setName("")
                  setConfirmPassword("")
                }}
              >
                {isCreatingAccount ? (
                  "Já tem conta? Fazer login"
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Não tem conta? Criar conta grátis
                  </>
                )}
              </Button>

              {!isCreatingAccount && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700">
                    Esqueci minha senha
                  </Button>
                </div>
              )}
            </div>

            {isCreatingAccount && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400 text-center">
                  🎉 Sua conta iniciará com R$ 5.000,00 de saldo!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 NeoBank. Todos os direitos reservados.</p>
          <p className="mt-1">Banco fictício para demonstração</p>
        </div>
      </div>
    </div>
  )
}
