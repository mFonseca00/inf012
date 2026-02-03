# 🏥 Kos - Sistema de Gestão de Clínica Médica

Sistema completo para gestão de clínicas médicas desenvolvido com arquitetura de microsserviços. Permite o gerenciamento de pacientes, médicos, agendamentos de consultas e envio de notificações por e-mail.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Microsserviços](#-microsserviços)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração](#-configuração)
- [Inicialização](#-inicialização)
- [URLs Principais](#-urls-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)

---

## 🚀 Tecnologias

### Backend

**Java 21** foi escolhido como linguagem principal por ser uma versão LTS (Long Term Support) com recursos modernos como virtual threads e pattern matching, além de oferecer excelente performance e robustez para aplicações empresariais.

**Spring Boot 3.5.7** é o framework base que simplifica a configuração e desenvolvimento de aplicações Java, fornecendo auto-configuração, servidor embarcado e integração nativa com o ecossistema Spring.

**Spring Cloud 2024.0.0** fornece ferramentas essenciais para arquitetura de microsserviços, incluindo service discovery, configuração distribuída e circuit breakers, permitindo construir sistemas distribuídos resilientes.

**Spring Security** gerencia toda a autenticação e autorização do sistema, protegendo endpoints e controlando acesso baseado em perfis de usuário (ADMIN, DOCTOR, PATIENT, RECEPTIONIST).

**Spring Data JPA** abstrai a camada de persistência, permitindo trabalhar com banco de dados de forma orientada a objetos, reduzindo código boilerplate e aumentando a produtividade.

**Spring Cloud Gateway** atua como API Gateway, centralizando o roteamento de requisições, aplicando filtros e realizando balanceamento de carga entre instâncias dos microsserviços.

**Netflix Eureka** implementa o padrão Service Discovery, permitindo que os microsserviços se registrem e descubram uns aos outros dinamicamente, eliminando a necessidade de configurações estáticas de endereços.

**Spring AMQP** integra a aplicação com RabbitMQ para comunicação assíncrona entre microsserviços, essencial para operações que não precisam de resposta imediata, como envio de e-mails.

**PostgreSQL** é o banco de dados relacional escolhido por sua robustez, suporte a JSON, extensibilidade e excelente performance. Utilizamos a imagem `pgvector` que adiciona suporte a operações com vetores.

**Flyway** gerencia as migrations do banco de dados, versionando o schema e garantindo que mudanças sejam aplicadas de forma consistente em todos os ambientes.

**JWT (Auth0 java-jwt 4.5.0)** implementa autenticação stateless via tokens, ideal para arquiteturas de microsserviços onde não há estado compartilhado entre requisições.

**Lombok** reduz código boilerplate como getters, setters e construtores através de anotações, tornando o código mais limpo e legível.

**SpringDoc OpenAPI 2.8.14** gera automaticamente a documentação da API no padrão OpenAPI/Swagger, facilitando testes e integração com outros sistemas.

### Frontend

**React 19.2.0** foi escolhido por ser uma biblioteca moderna e amplamente adotada para construção de interfaces, oferecendo componentização, virtual DOM e um ecossistema rico de ferramentas.

**Vite 7.2.4** é o build tool utilizado por sua velocidade excepcional no desenvolvimento (Hot Module Replacement instantâneo) e builds otimizados para produção.

**React Router DOM 7.13.0** gerencia a navegação SPA (Single Page Application), permitindo rotas públicas e privadas com proteção baseada em autenticação.

**Axios 1.13.4** é o cliente HTTP que simplifica requisições à API, oferecendo interceptors para adicionar tokens de autenticação automaticamente.

**React Toastify 11.0.5** fornece notificações elegantes para feedback ao usuário em operações como login, cadastro e agendamentos.

**JS Cookie 3.0.5** gerencia cookies de forma segura, utilizado para armazenar o token JWT de autenticação.

**JWT Decode 4.0.0** permite decodificar tokens JWT no frontend para extrair informações do usuário logado sem necessidade de requisições adicionais.

### Infraestrutura

**Docker e Docker Compose** containerizam toda a infraestrutura (bancos de dados e message broker), garantindo ambientes consistentes e facilitando a configuração inicial do projeto.

**RabbitMQ 3.12** é o message broker que implementa o padrão de mensageria, permitindo comunicação assíncrona e desacoplada entre o serviço de clínica e o serviço de e-mail.

---

## 🏗 Arquitetura

O projeto utiliza uma **arquitetura de microsserviços** com os seguintes componentes:

```
                                    ┌─────────────────┐
                                    │    Frontend     │
                                    │   (React/Vite)  │
                                    │   Port: 5173    │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   API Gateway   │
                                    │   Port: 8090    │
                                    └────────┬────────┘
                                             │
                         ┌───────────────────┼───────────────────┐
                         │                   │                   │
                         ▼                   ▼                   ▼
               ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
               │  Eureka Server  │ │     Clinic      │ │      Mail       │
               │   Port: 8082    │ │   Port: 8080    │ │   Port: 8081    │
               └─────────────────┘ └────────┬────────┘ └────────┬────────┘
                                            │                   │
                    ┌───────────────────────┼───────────────────┤
                    │                       │                   │
                    ▼                       ▼                   ▼
           ┌─────────────────┐    ┌─────────────────┐  ┌─────────────────┐
           │    RabbitMQ     │    │  PostgreSQL     │  │   PostgreSQL    │
           │  Port: 5672     │    │  (clinic_db)    │  │ (clinic_email)  │
           │  UI: 15672      │    │  Port: 5432     │  │   Port: 5435    │
           └─────────────────┘    └─────────────────┘  └─────────────────┘
```

### Padrões Arquiteturais

- **Service Discovery**: Netflix Eureka para registro e descoberta de serviços
- **API Gateway**: Spring Cloud Gateway como ponto único de entrada
- **Event-Driven**: RabbitMQ para comunicação assíncrona entre microsserviços
- **Database per Service**: Cada microsserviço possui seu próprio banco de dados

---

## 💻 Backend

O backend é composto por quatro microsserviços Java/Spring Boot que trabalham em conjunto para fornecer todas as funcionalidades do sistema.

A comunicação externa acontece através do **API Gateway**, que roteia as requisições para os serviços apropriados. Internamente, os serviços se comunicam de forma assíncrona via **RabbitMQ** - por exemplo, quando uma consulta é agendada no serviço Clinic, uma mensagem é publicada na fila e o serviço Mail a consome para enviar o e-mail de confirmação.

Os serviços clinic e mail possuem, cada um, seu próprio banco de dados PostgreSQL, seguindo o padrão Database per Service, o que garante isolamento e permite que cada equipe evolua seu schema independentemente.

A autenticação é centralizada no serviço Clinic, que gera tokens JWT validados pelo Gateway antes de encaminhar as requisições.

---

## 🎨 Frontend

O frontend é uma Single Page Application (SPA) desenvolvida em React que consome a API através do Gateway.

A aplicação implementa um sistema de rotas protegidas: páginas públicas (login, registro, recuperação de senha) são acessíveis sem autenticação, enquanto páginas privadas (dashboard, agendamentos, listagens) requerem um token JWT válido armazenado em cookie.

O contexto de autenticação (`AuthContext`) gerencia o estado do usuário logado e é acessível em toda a aplicação através de hooks customizados (`useAuth`, `useUserType`).

A interface é organizada em componentes reutilizáveis (botões, campos de texto, modais) e páginas específicas para cada funcionalidade. O layout principal (`MainLayout`) inclui sidebar de navegação e navbar, envolvendo o conteúdo das rotas privadas.

As chamadas à API são centralizadas em serviços (`authService`, `appointmentService`, etc.) que utilizam uma instância configurada do Axios com interceptor para injeção automática do token de autenticação.

---

## 🔧 Microsserviços

### 1. Eureka Server (`eureka-server`)
**Porta:** `8082`

Servidor de descoberta de serviços (Service Discovery). Responsável por:
- Registrar todos os microsserviços da aplicação
- Permitir que os serviços se encontrem dinamicamente
- Monitorar a saúde dos serviços registrados
- Fornecer balanceamento de carga através do registro

### 2. API Gateway (`gateway`)
**Porta:** `8090`

Ponto único de entrada para todas as requisições externas. Responsável por:
- Roteamento de requisições para os microsserviços corretos
- Balanceamento de carga (Load Balancer)
- Integração com Eureka para descoberta dinâmica de rotas
- Centralização dos endpoints da API

### 3. Clinic Service (`clinic`)
**Porta:** `8080`

Microsserviço principal que contém a lógica de negócio da clínica. Responsável por:
- **Autenticação e Autorização**: Login, registro e gerenciamento de tokens JWT
- **Gestão de Usuários**: CRUD de pacientes, médicos e recepcionistas
- **Agendamentos**: Criação, consulta e cancelamento de consultas
- **Dashboard**: Métricas e estatísticas do sistema (também implementado no gateway por redundância)
- **Integração com RabbitMQ**: Publicação de eventos para envio de e-mails

**Banco de Dados:** `clinicdb` (PostgreSQL - porta 5432)

### 4. Mail Service (`mail`)
**Porta:** `8081`

Microsserviço dedicado ao envio de e-mails. Responsável por:
- **Consumo de Filas de E-mail**: Escuta eventos do RabbitMQ
- **Envio de E-mails**: Confirmações, lembretes e notificações
- **Templates de E-mail**: Formatação de mensagens
- **Histórico**: Registro de e-mails enviados

**Banco de Dados:** `clinicemaildb` (PostgreSQL - porta 5435)

---

## 📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Java 21** (JDK)
- **Maven** 3.8+
- **Node.js** 18+ e **npm** 9+
- **Docker** e **Docker Compose**
- **Git**

---

## ⚙ Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/mFonseca00/Kos.git
cd Kos
```

### 2. Configure as variáveis de ambiente do serviço de e-mail

O serviço de e-mail requer configuração SMTP para funcionar. Crie o arquivo `.env` no diretório `backend/mail/`:

```bash
cd backend/mail
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais SMTP:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app
```

⚠️ **Importante para Gmail:** Você precisa gerar uma [Senha de App](https://support.google.com/accounts/answer/185833) nas configurações de segurança da sua conta Google. A senha normal não funcionará se você tiver autenticação em dois fatores ativada.

**Outros provedores:** Ajuste `MAIL_HOST` e `MAIL_PORT` conforme seu provedor SMTP (Outlook, Yahoo, SendGrid, etc.).

### 3. Instale as dependências do frontend

```bash
cd frontend/kos-app
npm install
```

---

## 🚀 Inicialização

### ⚠️ Ordem de Inicialização (IMPORTANTE)

Os serviços devem ser iniciados na seguinte ordem para garantir que as dependências estejam disponíveis:

```
1. Docker (Infraestrutura) → PostgreSQL e RabbitMQ
2. Eureka Server → Service Discovery precisa estar pronto primeiro
3. Clinic Service → Serviço principal
4. Mail Service → Depende do RabbitMQ
5. Gateway → Precisa encontrar os serviços no Eureka
6. Frontend → Consome a API via Gateway
```

### Passo 1: Iniciar a Infraestrutura (Docker)

Na raiz do projeto, execute:

```bash
docker-compose up -d
```

Aguarde os containers iniciarem (PostgreSQL e RabbitMQ).

Verifique se estão rodando:

```bash
docker-compose ps
```

### Passo 2: Iniciar o Eureka Server

```bash
cd backend/eureka-server
mvn spring-boot:run
```

Aguarde a mensagem de inicialização e acesse http://localhost:8082 para verificar.

### Passo 3: Iniciar o Clinic Service

Em um novo terminal:

```bash
cd backend/clinic
mvn spring-boot:run
```

### Passo 4: Iniciar o Mail Service

Em um novo terminal:

```bash
cd backend/mail
mvn spring-boot:run
```

### Passo 5: Iniciar o API Gateway

Em um novo terminal:

```bash
cd backend/gateway
mvn spring-boot:run
```

### Passo 6: Iniciar o Frontend

Em um novo terminal:

```bash
cd frontend/kos-app
npm run dev
```

---

## 🔗 URLs Principais

### Aplicação

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface do usuário |
| **API Gateway** | http://localhost:8090 | Ponto de entrada da API |

### Backend (Acesso direto - desenvolvimento)

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Clinic API** | http://localhost:8080 | Serviço principal |
| **Mail API** | http://localhost:8081 | Serviço de e-mail |
| **Eureka Dashboard** | http://localhost:8082 | Painel de serviços |

### Documentação da API

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentação interativa |
| **OpenAPI JSON** | http://localhost:8080/v3/api-docs | Especificação OpenAPI |

### Infraestrutura

| Serviço | URL/Porta | Credenciais |
|---------|-----------|-------------|
| **RabbitMQ Management** | http://localhost:15672 | `admin` / `admin123` |
| **PostgreSQL (Clinic)** | localhost:5432 | `clinic` / `clinicpass` |
| **PostgreSQL (Mail)** | localhost:5435 | `email` / `clinicemailpass` |

## 📁 Estrutura do Projeto

```
Kos/
├── docker-compose.yaml          # Orquestração dos containers
├── README.md                    # Este arquivo
│
├── backend/
│   ├── clinic/                  # Microsserviço principal
│   │   ├── src/
│   │   │   ├── main/java/       # Código fonte
│   │   │   └── main/resources/  # Configurações e migrations
│   │   └── pom.xml
│   │
│   ├── eureka-server/           # Service Discovery
│   │   ├── src/
│   │   └── pom.xml
│   │
│   ├── gateway/                 # API Gateway
│   │   ├── src/
│   │   └── pom.xml
│   │
│   └── mail/                    # Serviço de e-mail
│       ├── src/
│       ├── .env                 # Variáveis de ambiente (criar a partir do .env.example)
│       ├── .env.example         # Exemplo de variáveis
│       └── pom.xml
│
└── frontend/
    └── kos-app/                 # Aplicação React
        ├── src/
        │   ├── components/      # Componentes reutilizáveis
        │   ├── contexts/        # Context API (Auth)
        │   ├── hooks/           # Custom hooks
        │   ├── pages/           # Páginas da aplicação
        │   ├── services/        # Chamadas à API
        │   ├── styles/          # Estilos globais
        │   └── utils/           # Utilitários
        ├── package.json
        └── vite.config.js
```

---

## 👥 Tipos de Usuário

O sistema suporta diferentes perfis de acesso:

| Perfil | Permissões |
|--------|------------|
| **MASTER** | Super administrador com controle total do sistema |
| **ADMIN** | Acesso total, dashboard, gerenciamento de usuários |
| **DOCTOR** | Visualização de agenda, consultas próprias |
| **PATIENT** | Agendamento e visualização de consultas próprias |
| **RECEPTIONIST** | Gerenciamento de agendamentos e pacientes |

---

## 🛠 Scripts Úteis

### Docker

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar um serviço específico
docker-compose restart rabbitmq
```

### Backend (Maven)

```bash
# Compilar
./mvnw clean compile

# Executar testes
./mvnw test

# Gerar JAR
./mvnw clean package -DskipTests

# Executar aplicação
./mvnw spring-boot:run
```

### Frontend (npm)

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

---

## � Funcionalidades Futuras

Durante o planejamento do projeto, foi idealizada uma **tela de gestão de usuários** que permitiria aos perfis **MASTER** e **ADMIN** gerenciar todos os usuários do sistema de forma centralizada, incluindo:

- Listagem completa de usuários com filtros e busca
- Criação, edição e desativação de contas
- Alteração de perfis e permissões
- Visualização de logs de atividades

Devido ao prazo de entrega do projeto acadêmico, essa funcionalidade ficou planejada para uma **implementação futura**, mantendo o foco nas funcionalidades essenciais de agendamento e gestão de consultas.

---

## 📝 Licença

Este projeto foi desenvolvido como trabalho acadêmico para o IFBA - Instituto Federal da Bahia, disciplina INF012 - Análise e Desenvolvimento de Sistemas.

---

## 🤝 Contribuidores

Desenvolvido por estudantes do curso de ADS do IFBA.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/mFonseca00">
        <img src="https://github.com/mFonseca00.png" width="100px;" alt="Marcus Fonseca"/><br />
        <sub><b>Marcus Fonseca</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/RenatoRayfgson">
        <img src="https://github.com/RenatoRayfgson.png" width="100px;" alt="Renato Rayfgson"/><br />
        <sub><b>Renato Rayfgson</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/IuriiViana">
        <img src="https://github.com/IuriiViana.png" width="100px;" alt="Iuri Viana"/><br />
        <sub><b>Iuri Viana</b></sub>
      </a>
    </td>
  </tr>
</table>
