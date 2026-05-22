# 🚀 Como Configurar Formspree (Recomendado)

O Formspree permite receber leads do formulário **sem precisar de backend próprio**.

## Passo 1: Criar Conta no Formspree
1. Acesse https://formspree.io/
2. Clique em "Sign Up"
3. Use seu email (lucasfranco2077@gmail.com)
4. Confirme o email

## Passo 2: Criar Novo Formulário
1. No dashboard, clique em "New Form"
2. Escolha um nome: `nova-franco-leads`
3. Selecione o email onde quer receber os leads
4. Copie o **Form ID** (algo como: `xxxxxxxx`)

## Passo 3: Integrar com o Site

### Opção A: Submissão Simples (Recomendado para GitHub Pages)

No `index.html`, procure pela tag `<form>` e adicione:

```html
<form action="https://formspree.io/f/SEU_FORM_ID" method="POST" class="hero-form" id="contato">
  <!-- resto do formulário -->
</form>
```

Substitua `SEU_FORM_ID` pelo ID fornecido pelo Formspree.

**Exemplo:**
```html
<form action="https://formspree.io/f/xyzabc123" method="POST" class="hero-form" id="contato">
```

### Opção B: Submissão com JavaScript (Mais Controle)

Em `js/app.js`, substitua a função `sendToBackend` por:

```javascript
function sendToBackend(data) {
  const formId = 'SEU_FORM_ID'; // Copie do Formspree
  const endpoint = `https://formspree.io/f/${formId}`;

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      tipo: data.tipo,
      valor: data.valor,
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Lead enviado com sucesso!');
      showSuccessMessage(document.querySelector('.hero-form'));
    }
  })
  .catch(error => console.error('Erro:', error));
}
```

Depois descomente a chamada em `handleFormSubmit`:

```javascript
// You can send to your backend here
sendToBackend(data); // ← Descomente esta linha
```

## Passo 4: Teste

1. Abra o site
2. Preencha o formulário com dados de teste
3. Clique em "Quero minha proposta gratuita"
4. Verifique o email configurado no Formspree

## 📧 Configurações Opcionais no Formspree

### Redirecionamento após envio
1. No dashboard, vá para Settings
2. Em "Redirect to URL", adicione: `https://seu-site.com/obrigado` (ou a URL que preferir)

### Autoresposta
1. Vá para "Email Notifications"
2. Configure uma mensagem automática para seus clientes

### SPAM Protection
1. Ative reCAPTCHA v3 na aba "SPAM Protection"
2. (Isso requer chave do Google reCAPTCHA)

## 💡 Dicas

- Formspree é **100% grátis** para até 50 submissões/mês
- Acima disso, custa $5/mês por formulário
- Não é necessário código de backend
- Funciona perfeito com GitHub Pages

## ❌ Alternativas (Se preferir outra solução)

### EmailJS
```javascript
// npm install @emailjs/browser
emailjs.send('SERVICE_ID', 'TEMPLATE_ID', data);
```

### Basin
Similar ao Formspree, endpoint: `https://usebasin.com/api/v1/455a90fa3267`

### API Própria
Se tiver um backend (Node/Python/etc), use:
```javascript
fetch('https://seu-backend.com/api/leads', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

---

**Escolha Formspree e configure em 2 minutos!** ⚡
