
let user = JSON.parse(localStorage.getItem('loggedUser')) || null;
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
}
function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, senha})
  })
  .then(res => res.json()).then(data => {
    if (data.success) {
      localStorage.setItem('loggedUser', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else alert(data.message);
  });
}
function register() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const nome = document.getElementById('nome')?.value || "Usuário";
  fetch('/api/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, senha, nome})
  })
  .then(res => res.json()).then(data => {
    if (data.success) window.location.href = 'index.html';
    else alert(data.message);
  });
}
function logout() {
  localStorage.removeItem('loggedUser');
  window.location.href = 'index.html';
}
function atualizar() {
  if (!user) return;
  document.getElementById('user-name').textContent = user.nome;
  document.getElementById('saldo').textContent = user.saldo.toFixed(2);
}
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'extract') carregarExtrato();
}
function depositar() {
  const valor = parseFloat(document.getElementById('deposit-value').value);
  fetch('/api/depositar', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: user.email, valor})
  }).then(r => r.json()).then(d => {
    if (d.success) {
      user = d.user;
      localStorage.setItem('loggedUser', JSON.stringify(user));
      atualizar();
    } else alert(d.message);
  });
}
function sacar() {
  const valor = parseFloat(document.getElementById('withdraw-value').value);
  fetch('/api/sacar', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: user.email, valor})
  }).then(r => r.json()).then(d => {
    if (d.success) {
      user = d.user;
      localStorage.setItem('loggedUser', JSON.stringify(user));
      atualizar();
    } else alert(d.message);
  });
}
function pix() {
  const email = document.getElementById('pix-dest').value;
  const valor = parseFloat(document.getElementById('pix-value').value);
  fetch('/api/transferir', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({remetente: user.email, destinatario: email, valor})
  }).then(r => r.json()).then(d => {
    if (d.success) {
      user = d.user;
      localStorage.setItem('loggedUser', JSON.stringify(user));
      atualizar();
    } else alert(d.message);
  });
}
function carregarExtrato() {
  fetch('/api/extrato?email=' + user.email)
  .then(r => r.json())
  .then(d => {
    const ul = document.getElementById('extrato-list');
    ul.innerHTML = "";
    d.extrato.forEach(e => {
      const li = document.createElement('li');
      li.textContent = `[${e.tipo}] R$ ${e.valor} - ${e.data}`;
      ul.appendChild(li);
    });
  });
}
if (window.location.pathname.includes("dashboard")) atualizar();
