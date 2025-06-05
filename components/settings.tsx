"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Bell, Smartphone, Eye, EyeOff, Check, AlertTriangle } from "lucide-react"

interface SettingsProps {
  user: {
    name: string
    cpf: string
    balance: number
    accountNumber: string
    agency: string
  }
}

export function Settings({ user }: SettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    transactions: true,
    marketing: false,
  })
  const [twoFactor, setTwoFactor] = useState(false)
  const [biometric, setBiometric] = useState(true)

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }

    // Simular mudança de senha
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("Senha alterada com sucesso!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie sua conta e preferências</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Atualize seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={user.cpf} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua, número, bairro" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="São Paulo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" placeholder="SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" />
                </div>
              </div>

              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
              <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={!currentPassword || !newPassword || !confirmPassword}>
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
              <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Autenticação por SMS</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receba códigos por SMS para confirmar transações
                  </p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Biometria</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use sua digital ou reconhecimento facial</p>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} />
              </div>

              {twoFactor && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">2FA Ativado</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Você receberá códigos de verificação no seu celular cadastrado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>Escolha como e quando receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba notificações no seu dispositivo</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange("push", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">E-mail</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba notificações por e-mail</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange("email", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba notificações por SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange("sms", value)}
                  />
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Notificação</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Transações</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">PIX, transferências e compras no cartão</p>
                  </div>
                  <Switch
                    checked={notifications.transactions}
                    onCheckedChange={(value) => handleNotificationChange("transactions", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Marketing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ofertas especiais e novidades</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(value) => handleNotificationChange("marketing", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacidade e Dados</CardTitle>
              <CardDescription>Controle como seus dados são utilizados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Dados Criptografados</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Todas as suas informações são protegidas com criptografia de ponta
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Conformidade LGPD</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seguimos todas as diretrizes da Lei Geral de Proteção de Dados
                  </p>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="space-y-4">
                <h4 className="font-medium">Ações de Privacidade</h4>

                <Button variant="outline" className="w-full justify-start">
                  Baixar Meus Dados
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  Política de Privacidade
                </Button>

                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Excluir Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
