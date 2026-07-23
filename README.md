# 💼 Smart HR Platform

> Plataforma completa para gestão de Recursos Humanos, desenvolvida com React + TypeScript, oferecendo um ambiente moderno para recrutamento, contratação, gestão de colaboradores e processos de desligamento.

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=react-router)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs)
![License](https://img.shields.io/badge/License-Academic-blue?style=for-the-badge)

</p>

---

# 📖 Sobre o Projeto

O **Smart HR Platform** é uma plataforma web desenvolvida para centralizar e otimizar os principais processos do setor de Recursos Humanos.

O sistema foi projetado para oferecer uma experiência intuitiva tanto para candidatos quanto para profissionais de RH, separando completamente os ambientes de utilização e proporcionando uma navegação simples, rápida e responsiva.

A aplicação possui funcionalidades voltadas para:

- recrutamento;
- cadastro de candidatos;
- contratação;
- gestão de funcionários;
- acompanhamento de processos;
- desligamento de colaboradores;
- dashboards gerenciais;
- gerenciamento de benefícios;
- monitoramento operacional.

---

# 🎯 Objetivos

O projeto busca:

- Modernizar processos de RH;
- Centralizar informações em uma única plataforma;
- Melhorar a experiência do usuário;
- Facilitar o gerenciamento de colaboradores;
- Automatizar etapas do recrutamento;
- Fornecer dashboards para tomada de decisão.

---

# 🖥️ Funcionalidades

## Área do Candidato

- Login
- Cadastro
- Cadastro completo de candidato
- Perfil do candidato
- Atualização de informações
- Envio de documentação
- Formulário de contratação

---

## Área do RH

- Dashboard administrativo
- Gestão de candidatos
- Processo de contratação
- Gestão de colaboradores
- Perfil completo de funcionários
- Monitoramento
- Gestão de VT/VR
- Templates de vagas
- Processo de Offboarding
- Templates de desligamento
- Integrações do Offboarding

---

## Interface

- Layout responsivo
- Dark Mode exclusivo da área RH
- Tema separado para candidatos
- Componentes reutilizáveis
- Feedback visual através de Toasts
- Navegação protegida
- Interface moderna

---

# 🚀 Tecnologias Utilizadas

## Front-end

- React 18
- TypeScript
- React Router DOM
- Tailwind CSS
- React Hook Form
- Axios
- React Hot Toast
- Lucide React
- React Icons
- Recharts
- Chart.js

---

## Arquitetura

- Context API
- Componentização
- Protected Routes
- Layouts independentes
- Organização por Features
- Hooks customizados

---

# 📂 Estrutura do Projeto

```text
frontend
│
├── src
│   │
│   ├── components
│   ├── context
│   ├── features
│   │
│   │   ├── auth
│   │   ├── candidate
│   │   ├── employee
│   │   ├── offboarding
│   │   └── RH
│   │
│   ├── layout
│   │   ├── candidato
│   │   └── RH
│   │
│   ├── routes
│   ├── services
│   ├── utils
│   ├── App.tsx
│   └── index.tsx
│
└── package.json
```

---

# 🎨 Sistema de Temas

O projeto utiliza um sistema próprio de gerenciamento de temas através da Context API.

### Área do Candidato

- Tema claro fixo

### Área RH

- Tema claro
- Tema escuro
- Preferência salva no navegador

---

# 🔐 Controle de Acesso

A plataforma possui separação entre áreas:

- Área pública
- Área do candidato
- Área administrativa RH

O acesso ao ambiente RH é protegido utilizando rotas protegidas (`ProtectedRoute`).

---

# 📊 Recursos

- Dashboards
- Gráficos
- Indicadores
- Monitoramento
- Gestão de benefícios
- Gestão de colaboradores
- Gestão de vagas
- Gestão de candidatos

---

# 📱 Responsividade

A aplicação foi construída seguindo o conceito **Mobile First**, adaptando-se para:

- Desktop
- Notebook
- Tablet
- Smartphone

---

# ⚙️ Instalação

Clone o projeto:

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
```

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm start
```

O projeto será iniciado em:

```
http://localhost:3000
```

---

# 📦 Principais Dependências

```json
React
TypeScript
React Router
Axios
Tailwind CSS
React Hook Form
Chart.js
Recharts
React Hot Toast
Lucide React
React Icons
```

---

# 🛠️ Ferramentas Utilizadas

- Visual Studio Code
- Git
- GitHub
- npm
- TypeScript
- ESLint
- PostCSS

---

# 💡 Boas Práticas Aplicadas

- Componentização
- Context API
- Hooks customizados
- Separação por Features
- Código reutilizável
- Organização modular
- Responsividade
- Clean Code
- Tipagem forte com TypeScript
- Navegação protegida
- Persistência de preferências do usuário

---

# 🔄 Fluxo da Aplicação

```text
Login
      │
      ▼
Identificação do Perfil
      │
      ├─────────────► Área do Candidato
      │
      │             ├── Perfil
      │             ├── Cadastro
      │             └── Contrato
      │
      ▼
Área RH
      │
      ├── Dashboard
      ├── Funcionários
      ├── Contratação
      ├── Processamento
      ├── Monitoramento
      ├── Benefícios
      ├── Templates
      └── Offboarding
```

---

# 📷 Capturas de Tela

## Login

> *(Adicionar imagem)*

---

## Dashboard RH

> *(Adicionar imagem)*

---

## Área do Candidato

> *(Adicionar imagem)*

---

## Gestão de Funcionários

> *(Adicionar imagem)*

---

## Offboarding

> *(Adicionar imagem)*

---

## Dark Mode

> *(Adicionar imagem)*

---

# 🚀 Melhorias Futuras

- Integração completa com API REST
- Autenticação JWT
- Upload de documentos
- Notificações em tempo real
- Chat interno
- Dashboard analítico avançado
- Exportação de relatórios
- Controle de permissões
- Logs administrativos
- Testes automatizados
- Docker
- Deploy em nuvem

---

# 📈 Status

🟢 Em desenvolvimento.

Novas funcionalidades continuam sendo implementadas.

---

# 👩‍💻 Desenvolvedora

**Eduarda Pontes Silva**

GitHub

```
https://github.com/SrtaPontesSilva
```

LinkedIn

```
https://linkedin.com/in/SEU-LINK
```

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos e de portfólio.

---

# ⭐ Se este projeto foi útil

Deixe uma ⭐ no repositório para apoiar o desenvolvimento.