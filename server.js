
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(express.json());
const dbPath = path.join(__dirname, 'data', 'users.json');
function readUsers() {
  return JSON.parse(fs.readFileSync(dbPath));
}
function writeUsers(users) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}
function registrarTransacao(user, tipo, valor) {
  if (!user.transacoes) user.transacoes = [];
  user.transacoes.push({ tipo, valor, data: new Date().toLocaleString() });
}
app.post('/api/register', (req, res) => {
  const { nome, email, senha } = req.body;
  let users = readUsers();
  if (users.find(u => u.email === email)) return res.json({ success: false, message: 'Já existe' });
  users.push({ nome, email, senha, saldo: 0, transacoes: [] });
  writeUsers(users);
  res.json({ success: true });
});
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.senha === senha);
  if (!user) return res.json({ success: false, message: 'Login inválido' });
  res.json({ success: true, user });
});
app.post('/api/depositar', (req, res) => {
  const { email, valor } = req.body;
  let users = readUsers();
  const user = users.find(u => u.email === email);
  user.saldo += valor;
  registrarTransacao(user, "Depósito", valor);
  writeUsers(users);
  res.json({ success: true, user });
});
app.post('/api/sacar', (req, res) => {
  const { email, valor } = req.body;
  let users = readUsers();
  const user = users.find(u => u.email === email);
  if (user.saldo < valor) return res.json({ success: false, message: 'Saldo insuficiente' });
  user.saldo -= valor;
  registrarTransacao(user, "Saque", valor);
  writeUsers(users);
  res.json({ success: true, user });
});
app.post('/api/transferir', (req, res) => {
  const { remetente, destinatario, valor } = req.body;
  let users = readUsers();
  const u1 = users.find(u => u.email === remetente);
  const u2 = users.find(u => u.email === destinatario);
  if (!u1 || !u2 || u1.saldo < valor) return res.json({ success: false, message: 'Erro na transferência' });
  u1.saldo -= valor;
  u2.saldo += valor;
  registrarTransacao(u1, "Envio Pix", -valor);
  registrarTransacao(u2, "Recebido Pix", valor);
  writeUsers(users);
  res.json({ success: true, user: u1 });
});
app.get('/api/extrato', (req, res) => {
  const { email } = req.query;
  let users = readUsers();
  const user = users.find(u => u.email === email);
  res.json({ extrato: user.transacoes || [] });
});
app.listen(PORT, () => console.log("Servidor no ar http://localhost:" + PORT));
