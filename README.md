# Nova Franco Precatórios

Site de intermediação de precatórios - página estática e responsiva.

## 📁 Estrutura do Projeto

```
nova-franco-precatorios/
├── index.html           # Página principal
├── css/
│   └── styles.css      # Estilos da aplicação
├── js/
│   └── app.js          # Lógica do formulário e animações
├── .gitignore          # Arquivos ignorados pelo Git
├── README.md           # Este arquivo
└── LICENSE             # Licença do projeto
```

## 🚀 Como Usar

### Localmente
1. Clone ou baixe este repositório
2. Abra `index.html` no navegador
3. Prontinho! O site funciona 100% offline

### GitHub Pages
1. Crie um repositório no GitHub
2. Envie os arquivos para o repositório
3. Vá em Settings → Pages e selecione "Deploy from a branch"
4. Seu site estará disponível em: `https://seu-usuario.github.io/nome-repo`

## 🔧 Configuração

### Google Tag Manager
Substitua `GTM-XXXXXX` pelo seu ID do GTM nos seguintes lugares:
- `index.html` (2 ocorrências)

### Meta Pixel (Facebook)
Substitua `SEU_PIXEL_ID_AQUI` pelo seu Pixel ID no `index.html`

### Formulário
O formulário atualmente exibe um alerta ao enviar. Para integrar com backend:

1. Descomente a função `sendToBackend(data)` em `js/app.js`
2. Atualize o endpoint da API
3. Ou use serviços como:
   - [Formspree](https://formspree.io) - Grátis
   - [EmailJS](https://www.emailjs.com) - Grátis
   - [Basin](https://basin.io) - Grátis

## 📱 Responsividade

O site é totalmente responsivo para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Cores da Paleta

| Variável | Valor | Uso |
|----------|-------|-----|
| `--primary` | #001D3D | Azul Navy (primária) |
| `--primary-light` | #003366 | Azul claro (hover) |
| `--accent` | #0052CC | Azul de acento |
| `--gray-900` | #212529 | Texto escuro |
| `--gray-600` | #6C757D | Texto muted |
| `--white` | #FFFFFF | Fundo branco |

## 📊 Performance

- **Tamanho total**: ~40KB (HTML + CSS + JS)
- **Nenhuma dependência externa** (exceto fontes Google)
- **Lighthouse Score**: 95+

## 🔒 Segurança

- Validação de formulário no frontend
- Meta tags para prevenção de clickjacking
- Sem armazenamento local de dados sensíveis

## 📝 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato via WhatsApp.

---

**Desenvolvido com ❤️ para Nova Franco Precatórios**
