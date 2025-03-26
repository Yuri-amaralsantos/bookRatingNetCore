# 🗨️ **Aplicativo de Chat**  

Um site de avaliação de livros com frontend React, backend dotnet core, autenticação JWT, e PostgreSQL para gerenciamento de usuários.  

![Demonstração](Animação.gif)

---

### 🚀 **Funcionalidades**  

- ✅ Autenticação de Usuários (Login/Registro com JWT & PostgreSQL)  
- ✅ Sistema para adicionar livros favoritos do usuário 
- ✅ API Segura (dotnet core + PostgreSQL)  
- ✅ Sistema de gerenciamento de avaliação de livro com nota e comentário
- ✅ Interface Simples & Responsiva  

---

## 🛠️ **Como Instalar**

### 1️⃣ **Clonar o Repositório**

git clone https://github.com/Yuri-amaralsantos/bookRatingNetCore.git

---

### 2️⃣ **Configurar o Backend**

cd AuthUserApi
dotnet restore

#### **Alterar o connectionStrings no appsettings.json:**

"ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=bookDb;Username={usuário};Password={senha}"
},

#### **Iniciar o backend:**

dotnet run

---

### 3️⃣ **Configurar o Frontend**

cd Frontend
npm run dev

---

## 🏗️ **Tecnologias Utilizadas**

Frontend: HTML, CSS, JavaScript, React, Axios, React router
Backend: Dotnet, swagger, JWT
Banco de Dados: PostgreSQL

---

## ⚠️ **Notas Importantes**

O site ainda não tem funções de cargos, nem funções para os administradores enviarem novos livros. 
Qualquer usuário com acesso pode gerenciar os livros através do swagger que pode ser acessado em localhost/swagger.
Somente o usuário pode remover sua avaliação, mas ela é vista por todos.

---

## 🤝 **Futuras melhorias**

- ✅ Adicionar cargos para adminstradores.
- ✅ Adicionar função no frontend para adminstradores adicionarem novos livros.
- ✅ Adicionar função para pesquisar e acessar o perfil de outros usuários.
- ✅ Adicionar função para fazer upload na capa do livro.

---

## 🤝 **Contribuição**

Contribuições são bem-vindas! Sinta-se à vontade para enviar issues e pull requests.

---

## 📜 **Licença**

Este projeto está licenciado sob a Licença MIT
