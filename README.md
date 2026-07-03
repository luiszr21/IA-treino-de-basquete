# 🏀 SwishLab IA

O **SwishLab IA** é um treinador inteligente de basquete que utiliza Inteligência Artificial para gerar treinos personalizados de acordo com a posição e a habilidade que o jogador deseja desenvolver.



# 📋 Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

- Node.js (versão 18 ou superior)
- NPM

Para verificar:

```bash
node -v
npm -v
```

---

# 📥 Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd  IA-treino-de-basquete
```

Instale as dependências:

```bash
npm install 
```

---

# 🔑 Configuração da API

Crie um arquivo chamado:

```text
.env
```

Na raiz do projeto.

Adicione sua chave da OpenRouter:

```env
OPENROUTER_API_KEY=sua_chave_aqui
```

Você pode obter uma chave em:

https://openrouter.ai/

---

# ▶️ Executando o projeto

Inicie o servidor utilizando:


```bash
npm start
```

Se tudo estiver correto será exibido:

```text
Servidor rodando em http://localhost:3000
```

Abra o navegador e acesse:

```
http://localhost:3000
```

---

# 💬 Como utilizar

Informe ao treinador:

- sua posição
- a habilidade que deseja melhorar

Exemplo:

```
Sou armador e quero melhorar meu drible.
```

ou

```
Sou pivô e quero melhorar minha bandeja.
```

O sistema irá gerar um treino personalizado.

---

# 📂 Estrutura do projeto

```text
IA-TREINO-DE-BASQUETE/
│
├── node_modules/
│
├── public/
│   ├── index.html
│   ├── main.js
│   └── style.css
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── Server.js
```

