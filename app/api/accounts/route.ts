import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const accountsFile = path.join(dataDir, "accounts.json")

// Garantir que o diretório existe
async function ensureDataDir() {
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Garantir que o arquivo existe
async function ensureAccountsFile() {
  await ensureDataDir()
  try {
    await fs.access(accountsFile)
  } catch {
    await fs.writeFile(accountsFile, JSON.stringify([]))
  }
}

export async function GET() {
  try {
    await ensureAccountsFile()
    const data = await fs.readFile(accountsFile, "utf8")
    const accounts = JSON.parse(data)
    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error reading accounts:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAccountsFile()
    const newAccount = await request.json()

    const data = await fs.readFile(accountsFile, "utf8")
    const accounts = JSON.parse(data)

    accounts.push(newAccount)

    await fs.writeFile(accountsFile, JSON.stringify(accounts, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving account:", error)
    return NextResponse.json({ success: false, error: "Failed to save account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureAccountsFile()
    const updatedAccounts = await request.json()

    await fs.writeFile(accountsFile, JSON.stringify(updatedAccounts, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating accounts:", error)
    return NextResponse.json({ success: false, error: "Failed to update accounts" }, { status: 500 })
  }
}
