import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const transactionsFile = path.join(dataDir, "transactions.json")

// Garantir que o diretório existe
async function ensureDataDir() {
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Garantir que o arquivo existe
async function ensureTransactionsFile() {
  await ensureDataDir()
  try {
    await fs.access(transactionsFile)
  } catch {
    await fs.writeFile(transactionsFile, JSON.stringify([]))
  }
}

export async function GET() {
  try {
    await ensureTransactionsFile()
    const data = await fs.readFile(transactionsFile, "utf8")
    const transactions = JSON.parse(data)
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error reading transactions:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTransactionsFile()
    const newTransaction = await request.json()

    const data = await fs.readFile(transactionsFile, "utf8")
    const transactions = JSON.parse(data)

    transactions.push(newTransaction)

    await fs.writeFile(transactionsFile, JSON.stringify(transactions, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to save transaction" }, { status: 500 })
  }
}
