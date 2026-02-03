# ✅ Checklist de Fluxos de Teste Kos

Este documento serve como checklist para validação dos principais fluxos do sistema Kos. Marque cada etapa conforme for validada.

---

## 1. Autenticação e Registro

- [ ] Acessar página de login
- [ ] Tentar login com credenciais inválidas (espera erro)
- [ ] Registrar novo usuário (paciente) via página de registro
- [ ] Verificar recebimento de e-mail de confirmação
- [ ] Realizar login com credenciais válidas
- [ ] Acessar página de recuperação de senha
- [ ] Solicitar redefinição de senha (verificar e-mail)
- [ ] Redefinir senha e realizar login com nova senha

**Fluxograma:**
```
[Início]
   |
   v
[Acessa Login] --> [Tenta login inválido] --> [Erro exibido?]
   |                                         |
   v                                         v
[Registra novo usuário] --> [Recebe e-mail?] --> [Login válido]
   |                                         |
   v                                         v
[Recupera senha] --> [Recebe e-mail?] --> [Redefine senha] --> [Login com nova senha]
   |
   v
[Fim]
```

---

## 2. Agendamento de Consulta

- [ ] Login como paciente
- [ ] Acessar página de agendamento
- [ ] Preencher dados e agendar consulta
- [ ] Verificar consulta na lista do paciente
- [ ] Login como médico e verificar consulta na agenda
- [ ] Login como recepcionista e editar/cancelar consulta
- [ ] Cancelar consulta e verificar recebimento de e-mail de notificação

**Fluxograma:**
```
[Login paciente]
   |
   v
[Acessa agendamento] --> [Agenda consulta] --> [Consulta aparece na lista?]
   |
   v
[Login médico] --> [Consulta aparece na agenda?]
   |
   v
[Login recepcionista] --> [Edita/cancela consulta] --> [Recebe e-mail de cancelamento?]
   |
   v
[Fim]
```

---

## 3. Gestão de Usuários (ADMIN/MASTER)

- [ ] Login como ADMIN ou MASTER
- [ ] Acessar página de gestão de usuários
- [ ] Listar todos os usuários
- [ ] Criar novo usuário (médico, paciente, recepcionista)
- [ ] Editar dados de um usuário existente
- [ ] Desativar usuário
- [ ] Alterar perfil/permissão de usuário

**Fluxograma:**
```
[Login ADMIN/MASTER]
   |
   v
[Acessa gestão de usuários] --> [Lista usuários]
   |
   v
[Criar usuário] --> [Usuário aparece na lista?]
   |
   v
[Editar usuário] --> [Alterações salvas?]
   |
   v
[Desativar usuário] --> [Usuário desativado?]
   |
   v
[Alterar perfil] --> [Permissão alterada?]
   |
   v
[Fim]
```

---

## 4. Navegação e Proteção de Rotas

- [ ] Tentar acessar rota privada sem login (espera redirecionamento para login)
- [ ] Login como cada perfil (ADMIN, DOCTOR, PATIENT, RECEPTIONIST)
- [ ] Navegar entre páginas privadas e públicas
- [ ] Verificar se páginas e funcionalidades exibidas correspondem ao perfil logado

**Fluxograma:**
```
[Acessa rota privada sem login] --> [Redireciona para login?]
   |
   v
[Login como perfil X] --> [Navega entre páginas]
   |
   v
[Páginas exibidas correspondem ao perfil?]
   |
   v
[Fim]
```

---

## 5. Envio de E-mail (Mail Service)

- [ ] Realizar registro de usuário (verificar e-mail de confirmação)
- [ ] Agendar consulta (verificar e-mail de confirmação)
- [ ] Cancelar consulta (verificar e-mail de cancelamento)
- [ ] Verificar histórico de e-mails enviados no Mail Service

**Fluxograma:**
```
[Registro usuário] --> [Recebe e-mail de confirmação?]
   |
   v
[Agendamento consulta] --> [Recebe e-mail de confirmação?]
   |
   v
[Cancelamento consulta] --> [Recebe e-mail de cancelamento?]
   |
   v
[Verifica histórico de e-mails]
   |
   v
[Fim]
```

---

## 6. Dashboard e Monitoramento

- [ ] Login como ADMIN/MASTER
- [ ] Acessar dashboard
- [ ] Verificar exibição de métricas (consultas, usuários, etc.)
- [ ] Acessar página de monitoramento
- [ ] Validar exibição de estatísticas e gráficos

**Fluxograma:**
```
[Login ADMIN/MASTER]
   |
   v
[Acessa dashboard] --> [Métricas exibidas?]
   |
   v
[Acessa monitoramento] --> [Estatísticas exibidas?]
   |
   v
[Fim]
```

---

## 7. Infraestrutura (Docker, RabbitMQ, PostgreSQL)

- [ ] Subir containers com Docker Compose
- [ ] Verificar status dos containers
- [ ] Acessar RabbitMQ Management e verificar filas
- [ ] Acessar bancos PostgreSQL e verificar conexões
- [ ] Derrubar containers e verificar parada dos serviços

**Fluxograma:**
```
[Subir containers]
   |
   v
[Verificar status] --> [RabbitMQ ok?] --> [PostgreSQL ok?]
   |
   v
[Derrubar containers] --> [Serviços parados?]
   |
   v
[Fim]
```

---

> Preencha cada item conforme for validando os fluxos do sistema Kos.
