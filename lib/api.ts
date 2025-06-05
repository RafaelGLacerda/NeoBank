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

// Funções para contas
export async function getAccounts(): Promise<StoredAccount[]> {
  try {
    const response = await fetch("/api/accounts")
    if (!response.ok) throw new Error("Failed to fetch accounts")
    return await response.json()
  } catch (error) {
    console.error("Error fetching accounts:", error)
    // Fallback para localStorage se a API falhar
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("neobank-accounts")
      return stored ? JSON.parse(stored) : []
    }
    return []
  }
}

export async function saveAccount(account: StoredAccount): Promise<boolean> {
  try {
    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    })

    if (!response.ok) throw new Error("Failed to save account")

    // Também salvar no localStorage como backup
    if (typeof window !== "undefined") {
      const accounts = await getAccounts()
      accounts.push(account)
      localStorage.setItem("neobank-accounts", JSON.stringify(accounts))
    }

    return true
  } catch (error) {
    console.error("Error saving account:", error)

    // Fallback para localStorage se a API falhar
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("neobank-accounts")
      const accounts = stored ? JSON.parse(stored) : []
      accounts.push(account)
      localStorage.setItem("neobank-accounts", JSON.stringify(accounts))
      return true
    }

    return false
  }
}

export async function updateAccounts(accounts: StoredAccount[]): Promise<boolean> {
  try {
    const response = await fetch("/api/accounts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accounts),
    })

    if (!response.ok) throw new Error("Failed to update accounts")

    // Também atualizar no localStorage como backup
    if (typeof window !== "undefined") {
      localStorage.setItem("neobank-accounts", JSON.stringify(accounts))
    }

    return true
  } catch (error) {
    console.error("Error updating accounts:", error)

    // Fallback para localStorage se a API falhar
    if (typeof window !== "undefined") {
      localStorage.setItem("neobank-accounts", JSON.stringify(accounts))
      return true
    }

    return false
  }
}

// Funções para transações
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch("/api/transactions")
    if (!response.ok) throw new Error("Failed to fetch transactions")
    return await response.json()
  } catch (error) {
    console.error("Error fetching transactions:", error)
    // Fallback para localStorage se a API falhar
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("neobank-transactions")
      return stored ? JSON.parse(stored) : []
    }
    return []
  }
}

export async function saveTransaction(transaction: Transaction): Promise<boolean> {
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    })

    if (!response.ok) throw new Error("Failed to save transaction")

    // Também salvar no localStorage como backup
    if (typeof window !== "undefined") {
      const transactions = await getTransactions()
      transactions.push(transaction)
      localStorage.setItem("neobank-transactions", JSON.stringify(transactions))
    }

    return true
  } catch (error) {
    console.error("Error saving transaction:", error)

    // Fallback para localStorage se a API falhar
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("neobank-transactions")
      const transactions = stored ? JSON.parse(stored) : []
      transactions.push(transaction)
      localStorage.setItem("neobank-transactions", JSON.stringify(transactions))
      return true
    }

    return false
  }
}
