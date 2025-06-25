# GuinchoLink - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Sistema de gerenciamento de guincho desenvolvido com React e Vite. Interface moderna e responsiva para controle completo de serviços, clientes, veículos, funcionários e relatórios.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Arquitetura](#-arquitetura)
- [Componentes Principais](#-componentes-principais)
- [Serviços e API](#-serviços-e-api)
- [Estilização](#-estilização)
- [Autenticação](#-autenticação)
- [Roteamento](#-roteamento)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O GuinchoLink Frontend é uma aplicação SPA (Single Page Application) desenvolvida para gerenciar serviços de guincho de forma eficiente e intuitiva. O sistema oferece interface completa para:

- Gerenciamento de clientes e seus veículos
- Controle de funcionários e administradores
- Cadastro e acompanhamento de serviços
- Finalização de serviços com relatórios
- Sistema de feedback dos clientes
- Estatísticas e relatórios gerenciais
- Dashboard com métricas em tempo real

## 🛠 Tecnologias Utilizadas

### **Core Framework**
- **[React 18.2.0](https://reactjs.org/)** - Biblioteca JavaScript para construção de interfaces
- **[Vite 4.4.5](https://vitejs.dev/)** - Build tool e dev server ultrarrápido
- **[JavaScript ES6+](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - Linguagem de programação principal

### **Roteamento e Navegação**
- **[React Router DOM 6.15.0](https://reactrouter.com/)** - Roteamento declarativo para React
  ```javascript
  // Configuração de rotas protegidas
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  ```

### **Estilização e UI**
- **[Bootstrap 5.3.1](https://getbootstrap.com/)** - Framework CSS responsivo
- **[Bootstrap Icons 1.10.5](https://icons.getbootstrap.com/)** - Biblioteca de ícones
- **CSS3 Personalizado** - Estilos customizados no `App.css`

### **Comunicação HTTP**
- **[Axios 1.5.0](https://axios-http.com/)** - Cliente HTTP para requisições à API
  ```javascript
  // Interceptor para refresh token automático
  api.interceptors.response.use(response => response, async error => {
    if (error.response?.status === 401) {
      // Auto refresh token logic
    }
  });
  ```

### **Ferramentas de Desenvolvimento**
- **[ESLint 8.45.0](https://eslint.org/)** - Linter para JavaScript/React
- **[@vitejs/plugin-react 4.0.3](https://github.com/vitejs/vite-plugin-react)** - Plugin Vite para React
- **[Vite HMR](https://vitejs.dev/guide/features.html#hot-module-replacement)** - Hot Module Replacement

## 📁 Estrutura do Projeto

```
GuinchoLink-Front/
├── public/                          # Arquivos públicos estáticos
│   ├── favicon.ico
│   └── index.html
├── src/                            # Código fonte da aplicação
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── AdministradorForm.jsx   # Formulário de administradores
│   │   ├── AdministradorList.jsx   # Listagem de administradores
│   │   ├── ClienteForm.jsx         # Formulário de clientes
│   │   ├── ClienteList.jsx         # Listagem de clientes
│   │   ├── FeedbackForm.jsx        # Formulário de feedback
│   │   ├── FeedbackList.jsx        # Listagem de feedbacks
│   │   ├── FeedbackView.jsx        # Visualização de feedback
│   │   ├── FimServicoForm.jsx      # Formulário de fim de serviço
│   │   ├── FuncionarioForm.jsx     # Formulário de funcionários
│   │   ├── FuncionarioList.jsx     # Listagem de funcionários
│   │   ├── Layout.jsx              # Layout principal com sidebar
│   │   ├── Modal.jsx               # Componente modal reutilizável
│   │   ├── ProtectedRoute.jsx      # Rota protegida por autenticação
│   │   ├── ServicoForm.jsx         # Formulário de serviços
│   │   ├── TipoServicoForm.jsx     # Formulário de tipos de serviço
│   │   ├── TipoServicoList.jsx     # Listagem de tipos de serviço
│   │   ├── VeiculoClienteForm.jsx  # Formulário de veículos de cliente
│   │   ├── VeiculoClienteList.jsx  # Listagem de veículos de cliente
│   │   ├── VeiculoEmpresaForm.jsx  # Formulário de veículos da empresa
│   │   └── VeiculoEmpresaList.jsx  # Listagem de veículos da empresa
│   ├── contexts/                   # Contextos React
│   │   └── AuthContext.jsx         # Contexto de autenticação
│   ├── pages/                      # Páginas da aplicação
│   │   ├── AdministradoresPage.jsx # Página de administradores
│   │   ├── Clientes.jsx           # Página de clientes
│   │   ├── Dashboard.jsx          # Dashboard principal
│   │   ├── EstatisticasGerais.jsx # Estatísticas gerais
│   │   ├── EstatisticasPorCliente.jsx # Estatísticas por cliente
│   │   ├── Feedbacks.jsx          # Página de feedbacks
│   │   ├── FimServicos.jsx        # Página de fim de serviços
│   │   ├── Funcionarios.jsx       # Página de funcionários
│   │   ├── Login.jsx             # Página de login
│   │   ├── Perfil.jsx            # Página de perfil do usuário
│   │   ├── Relatorios.jsx        # Página de relatórios
│   │   ├── Servicos.jsx          # Página de cadastro de serviços
│   │   ├── ServicosListagem.jsx  # Listagem de serviços
│   │   ├── ServicosPorFuncionario.jsx # Serviços por funcionário
│   │   ├── TipoServicoPage.jsx   # Página de tipos de serviço
│   │   ├── VeiculosClientes.jsx  # Página de veículos de clientes
│   │   └── VeiculosEmpresa.jsx   # Página de veículos da empresa
│   ├── services/                  # Serviços de comunicação com API
│   │   ├── administradorService.js
│   │   ├── api.js                # Configuração base do Axios
│   │   ├── authService.js        # Serviços de autenticação
│   │   ├── clienteService.js
│   │   ├── feedbackService.js
│   │   ├── fimServicoService.js
│   │   ├── funcionarioService.js
│   │   ├── servicoService.js
│   │   ├── tipoServicoService.js
│   │   ├── veiculoClienteService.js
│   │   └── veiculoEmpresaService.js
│   ├── App.css                   # Estilos principais da aplicação
│   ├── App.jsx                   # Componente raiz da aplicação
│   ├── index.css                 # Estilos globais
│   └── main.jsx                  # Ponto de entrada da aplicação
├── .eslintrc.cjs                # Configuração do ESLint
├── .gitignore                   # Arquivos ignorados pelo Git
├── index.html                   # Template HTML principal
├── package.json                 # Dependências e scripts
├── package-lock.json            # Lock file das dependências
├── README.md                    # Documentação do projeto
└── vite.config.js              # Configuração do Vite
```

## ✨ Funcionalidades

### **🔐 Autenticação e Autorização**
- Login seguro com JWT tokens
- Refresh token automático
- Contexto de autenticação global
- Rotas protegidas por permissão

### **👥 Gerenciamento de Usuários**
- **Clientes**: CRUD completo com CPF, telefone, endereço
- **Funcionários**: Controle de funcionários ativos
- **Administradores**: Gerenciamento de admins do sistema

### **🚗 Gerenciamento de Veículos**
- **Veículos de Clientes**: Placa, modelo, cor, tipo de veículo
- **Veículos da Empresa**: Frota própria da empresa
- Formatação automática de placas (ABC-1234)

### **🔧 Gerenciamento de Serviços**
- **Tipos de Serviço**: Categorização de serviços oferecidos
- **Cadastro de Serviços**: Solicitações de guincho
- **Fim de Serviços**: Finalização com valor e descrição
- **Status Tracking**: Acompanhamento em tempo real

### **⭐ Sistema de Feedback**
- Avaliações de 1 a 5 estrelas
- Comentários dos clientes
- Visualização detalhada dos feedbacks
- Estatísticas de satisfação

### **📊 Relatórios e Estatísticas**
- **Dashboard**: Métricas principais em tempo real
- **Estatísticas Gerais**: Visão geral dos serviços
- **Estatísticas por Cliente**: Análise individual
- **Relatórios**: Exportação de dados

## 📋 Pré-requisitos

- **Node.js 18+ e npm/yarn**
- **Backend GuinchoLink** rodando na porta 3000
- **Navegador moderno** com suporte a ES6+

## 🚀 Instalação

### 1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/GuinchoLink-Front.git
cd GuinchoLink-Front
```

### 2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

### 3. **Configure o ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env
```

## ⚙️ Configuração

### **Configuração da API**
Edite o arquivo `src/services/api.js`:

```javascript
// Base URL da API backend
const API_BASE_URL = 'http://localhost:3000/';

// Configuração do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### **Configuração do Vite**
O arquivo `vite.config.js` já está configurado:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

## 🏃‍♂️ Execução

### **Modo Desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```
Acesse: `http://localhost:5173`

### **Build para Produção**
```bash
npm run build
# ou
yarn build
```

### **Preview da Build**
```bash
npm run preview
# ou
yarn preview
```

## 📜 Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "vite",                    // Servidor de desenvolvimento
    "build": "vite build",            // Build para produção
    "lint": "eslint . --ext js,jsx",  // Análise de código
    "preview": "vite preview"         // Preview da build
  }
}
```

## 🏗 Arquitetura

### **Padrão de Arquitetura**
```
Presentation Layer (Pages/Components)
         ↕
Business Logic Layer (Services)
         ↕
Data Access Layer (API/Backend)
```

### **Fluxo de Dados**
1. **User Action** → Component
2. **Component** → Service
3. **Service** → API Call
4. **API Response** → Service
5. **Service** → Component State
6. **State Update** → UI Re-render

### **Gerenciamento de Estado**
- **Context API** para estado global (autenticação)
- **useState/useEffect** para estado local dos componentes
- **Service Layer** para cache e transformação de dados

## 🧩 Componentes Principais

### **Layout.jsx** - Layout Principal
```javascript
// Sidebar responsiva com menu de navegação
const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  // Menu items com ícones Bootstrap
  // Sidebar colapsável para mobile
  // Header com info do usuário
};
```

### **Modal.jsx** - Modal Reutilizável
```javascript
// Modal customizável com tamanhos diferentes
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Backdrop click para fechar
  // Ícones dinâmicos baseados no título
  // Tamanhos: sm, md, lg, xl
};
```

### **ProtectedRoute.jsx** - Rota Protegida
```javascript
// Verifica autenticação antes de renderizar
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};
```

## 🔌 Serviços e API

### **api.js** - Configuração Base
```javascript
// Interceptor para adicionar token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token automático
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Lógica de refresh token
    }
    return Promise.reject(error);
  }
);
```

### **Serviços Implementados**

#### **clienteService.js**
```javascript
class ClienteService {
  async findAll() { /* GET /clientes */ }
  async findByPk(id) { /* GET /clientes/:id */ }
  async create(data) { /* POST /clientes */ }
  async update(id, data) { /* PUT /clientes/:id */ }
  async delete(id) { /* DELETE /clientes/:id */ }
}
```

#### **feedbackService.js**
```javascript
class FeedbackService {
  async findAll() { /* GET /feedback */ }
  async create(data) { /* POST /feedback */ }
  async findByNota(nota) { /* GET /feedback/nota/:nota */ }
  // Tratamento específico de erros do backend
}
```

### **Tratamento de Erros**
```javascript
// Padrão de tratamento de erros em todos os services
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error) {
  // Verifica diferentes formatos de erro do backend
  if (error.response?.data?.err) {
    throw new Error(error.response.data.err);
  } else if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('Erro genérico');
}
```

## 🎨 Estilização

### **Bootstrap 5.3.1**
- **Grid System**: Layout responsivo com breakpoints
- **Components**: Buttons, cards, modals, forms, tables
- **Utilities**: Spacing, colors, typography, flexbox

### **Bootstrap Icons 1.10.5**
```javascript
// Ícones utilizados em todo o sistema
<i className="bi bi-person-fill"></i>        // Usuários
<i className="bi bi-car-front-fill"></i>     // Veículos
<i className="bi bi-gear-fill"></i>          // Serviços
<i className="bi bi-star-fill"></i>          // Avaliações
<i className="bi bi-graph-up"></i>           // Estatísticas
```

### **CSS Customizado** (App.css)
```css
/* Cores do tema */
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
}

/* Sidebar responsiva */
.sidebar {
  width: 280px;
  transition: all 0.3s ease;
}

/* Cards com hover effect */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Formulários aprimorados */
.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
```

## 🔐 Autenticação

### **AuthContext.jsx** - Contexto Global
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica token no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Valida token com o backend
      validateToken(token);
    }
  }, []);

  const login = async (credentials) => {
    // Autentica e salva tokens
  };

  const logout = () => {
    // Remove tokens e redireciona
  };
};
```

### **Fluxo de Autenticação**
1. **Login**: Credenciais → Backend → JWT Tokens
2. **Storage**: Access/Refresh tokens no localStorage
3. **Validation**: Verificação automática na inicialização
4. **Auto-refresh**: Renovação automática de tokens expirados
5. **Logout**: Limpeza de tokens e redirecionamento

## 🛣 Roteamento

### **App.jsx** - Configuração de Rotas
```javascript
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Módulos principais */}
          <Route path="/clientes" element={<ProtectedRoute><Layout><Clientes /></Layout></ProtectedRoute>} />
          <Route path="/feedbacks" element={<ProtectedRoute><Layout><Feedbacks /></Layout></ProtectedRoute>} />
          // ... outras rotas
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

### **Rotas Implementadas**
```
/                           # Dashboard principal
/login                      # Página de login
/perfil                     # Perfil do usuário

# Gestão de Pessoas
/clientes                   # Gerenciar clientes
/funcionarios              # Gerenciar funcionários  
/administradores           # Gerenciar administradores

# Gestão de Veículos
/veiculos-clientes         # Veículos de clientes
/veiculos-empresa          # Veículos da empresa

# Gestão de Serviços
/tipos-servico             # Tipos de serviço
/servicos                  # Cadastrar serviços
/servicos-listagem         # Listagem de serviços
/servicos-por-funcionario  # Serviços por funcionário
/fim-servicos              # Finalizar serviços

# Feedback e Estatísticas
/feedbacks                 # Gerenciar feedbacks
/estatisticas-gerais       # Estatísticas gerais
/estatisticas-cliente      # Estatísticas por cliente
/relatorios               # Relatórios do sistema
```

## 🔧 Funcionalidades Avançadas

### **Formatação Automática**
```javascript
// Formatação de CPF
const formatCPF = (value) => {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatação de telefone
const formatPhone = (value) => {
  return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Formatação de placa
const formatPlate = (value) => {
  return value.replace(/(\w{3})(\d{4})/, '$1-$2');
};
```

### **Sistema de Notificações**
```javascript
// Mensagens de sucesso/erro com auto-dismiss
const [message, setMessage] = useState({ type: '', text: '' });

useEffect(() => {
  if (message.text) {
    const timer = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [message]);
```

### **Filtros e Busca**
```javascript
// Filtro por nota no sistema de feedback
const handleFilterByNota = async (nota) => {
  if (!nota) {
    await loadFeedbacks();
  } else {
    const data = await feedbackService.findByNota(nota);
    setFeedbacks(data.feedbackNota || []);
  }
};
```

## 📱 Responsividade

### **Breakpoints Bootstrap**
- **xs**: < 576px (Mobile)
- **sm**: ≥ 576px (Mobile Large)
- **md**: ≥ 768px (Tablet)
- **lg**: ≥ 992px (Desktop)
- **xl**: ≥ 1200px (Desktop Large)

### **Componentes Responsivos**
```javascript
// Grid responsivo
<div className="row">
  <div className="col-12 col-md-6 col-lg-4">
    // Conteúdo adaptativo
  </div>
</div>

// Sidebar colapsável
<div className="d-lg-block d-none"> // Desktop only
<div className="d-lg-none d-block"> // Mobile only
```

## 🚀 Deploy

### **Build de Produção**
```bash
npm run build
```

### **Arquivos Gerados**
```
dist/
├── assets/
│   ├── index.[hash].js      # JavaScript bundled
│   └── index.[hash].css     # CSS bundled
└── index.html              # HTML principal
```

### **Configuração de Servidor**
```nginx
# Nginx example
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Cache estático
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🤝 Contribuição

### **Padrões de Código**

#### **Estrutura de Componentes**
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { serviceExample } from '../services/serviceExample';

// 2. Component
const ExampleComponent = ({ prop1, prop2 }) => {
  // 3. State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 4. Effects
  useEffect(() => {
    loadData();
  }, []);

  // 5. Functions
  const loadData = async () => {
    // Implementation
  };

  // 6. JSX
  return (
    <div className="container">
      {/* Content */}
    </div>
  );
};

// 7. Export
export default ExampleComponent;
```

#### **Nomenclatura**
- **Componentes**: PascalCase (`ClienteForm.jsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: kebab-case (`btn-primary`)

#### **Git Workflow**
```bash
# Feature branch
git checkout -b feature/nova-funcionalidade

# Commits semânticos
git commit -m "feat: adicionar sistema de feedback"
git commit -m "fix: corrigir formatação de CPF"
git commit -m "style: ajustar cores do tema"

# Pull request
git push origin feature/nova-funcionalidade
```

### **Checklist para PRs**
- [ ] Código segue os padrões estabelecidos
- [ ] Componentes são responsivos
- [ ] Tratamento de erros implementado
- [ ] Loading states adicionados
- [ ] Validações de formulário incluídas
- [ ] Documentação atualizada

## 📞 Suporte

- **Email**: suporte@guincholink.com
- **Documentação**: [docs.guincholink.com](https://docs.guincholink.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/GuinchoLink-Front/issues)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ por [Leandro Carvalho](https://github.com/leandro-carvalho)**

---

*Última atualização: Dezembro 2024*
