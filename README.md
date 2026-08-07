# 🔔 Notifiquei Pro

O **Notifiquei Pro** é uma aplicação web desenvolvida para rodar diretamente em geradores de sites estáticos (**Jekyll** e **GitHub Pages**), trazendo uma interface estilo *Retro Glassmorphism*, pré-visualização em tempo real de notificações Android, sistema de autenticação via Google, fluxo de assinatura via Pix e painel administrativo integrado.

---

## 🎨 Funcionalidades da Aplicação

* **Design Retro Glassmorphism:** Interface intuitiva com transparências, sombras suaves e efeito de vidro temperado.
* **Pré-visualização Dinâmica:** Simulação em tempo real da notificação com o layout oficial do Android conforme o usuário digita.
* **Autenticação com Google:** Login seguro gerenciado pelo **Firebase Authentication**.
* **Plano Freemium & Regras de Acesso:**
  * **Gratuito:** Acesso à criação e pré-visualização de modelos.
  * **Premium:** Liberação dos recursos de envio imediato e agendamento de notificações.
* **Fluxo de Pagamento via Pix:** Exibição de QR Code e chave Pix (R$ 48,90), acompanhado do formulário para upload do comprovante (imagem/PDF) salvo no **Firebase Storage**.
* **Painel Administrativo:** Exclusivo para e-mails cadastrados (`tfagro2023@gmail.com` e `kauaesuelen03@gmail.com`), permitindo personalizar a imagem de fundo, controle de transparência, desfoque (blur) e brilho sem a necessidade de republicar a aplicação.

---

## 📁 Estrutura do Projeto Jekyll

```text
meu-site-jekyll/
├── _config.yml         # Configurações do Jekyll, dados do Pix e credenciais do Firebase
├── _layouts/
│   └── default.html    # Layout base (HTML, Modais, Firebase SDK e Injeção do Liquid)
├── assets/
│   ├── css/
│   │   └── main.css    # Estilização completa Glassmorphism e responsividade
│   └── js/
│       └── app.js      # Lógica de Notificações, manipulação da DOM e regras Firebase
├── index.md            # Página principal configurada para o layout default
└── README.md           # Documentação do projeto
