# Pixel App Frontend

Aplicação mobile desenvolvida exclusivamente para uso da nossa Empresa Júnior Pixel. O aplicativo permite que membros da empresa compartilhem posts, interajam através de comentários e curtidas, e mantenham-se conectados através de um feed social interno.

## 🎯 Objetivo do Projeto

O **Pixel App Frontend** é uma aplicação mobile React Native que fornece uma interface intuitiva para os membros da Empresa Júnior Pixel interagirem e se conectarem. O aplicativo implementa funcionalidades de rede social interna, incluindo:

- **Feed Social**: Visualização de posts compartilhados pelos membros
- **Sistema de Interação**: Curtidas e comentários em posts
- **Gestão de Perfil**: Configuração de perfil pessoal e configurações
- **Notificações**: Sistema de notificações para interações
- **Autenticação Segura**: Integração com Clerk para autenticação OAuth

### Contexto de Negócio
Este aplicativo faz parte do ecossistema digital da Empresa Júnior Pixel, complementando outras ferramentas e sistemas utilizados pela organização.

## 🏗️ Arquitetura e Stack

### Arquitetura
O projeto segue uma **arquitetura de componentes** com separação clara de responsabilidades:

- **App Router**: Utiliza Expo Router para navegação baseada em arquivos
- **Componentes Reutilizáveis**: Biblioteca de componentes customizados
- **Gerenciamento de Estado**: Estado local com React hooks
- **Autenticação**: Integração com Clerk para OAuth seguro

### Stack Tecnológica

- **Frontend**: React Native com Expo
- **Navegação**: Expo Router v4
- **UI Framework**: React Native Paper
- **Autenticação**: Clerk OAuth
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: React Hooks
- **Armazenamento**: Expo Secure Store

### Dependências Principais
- `@clerk/clerk-expo`: Autenticação OAuth
- `expo-router`: Sistema de roteamento
- `react-native-paper`: Componentes de UI
- `expo-image-picker`: Seleção de imagens
- `expo-secure-store`: Armazenamento seguro

## 📱 Acesso e Execução do Código

### Localização do Código
- **Repositório**: `pixel-app/pixel-app/`
- **Descrição**: Frontend Mobile para funcionalidades da solução Pixel App

### Configuração do Ambiente

1. **Pré-requisitos**
   - Node.js (versão 18+)
   - npm ou yarn
   - Expo CLI
   - Android Studio / Xcode (para desenvolvimento nativo)

2. **Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto com:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   API_BASE_URI=http://localhost:3040
   ```

### Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/pixel-ufsc/pixel-app.git
   cd pixel-app/pixel-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   # Desenvolvimento
   npx expo start
   
   # Plataformas específicas
   npx expo start --android
   npx expo start --ios
   npx expo start --web
   ```

4. **Scripts disponíveis**
   ```bash
   npm run start    # Inicia o servidor de desenvolvimento
   npm run android  # Executa no Android
   npm run ios      # Executa no iOS
   npm run web      # Executa no navegador
   npm run test     # Executa os testes
   ```

## 🔄 Alterações, Testes e Validações

### Processo de Desenvolvimento
- **Versionamento**: Git Flow
- **Branch Principal**: `main`
- **Desenvolvimento**: Branches feature/`nome-da-feature`

### Testes
```bash
# Executar testes
npm run test

# Executar testes em modo watch
npm run test -- --watchAll
```

### Validação de Código
- **TypeScript**: Verificação de tipos automática
- **Prettier**: Formatação de código configurada
- **ESLint**: Análise de qualidade do código

### Estrutura de Componentes
```
src/
├── app/                 # Rotas da aplicação
│   ├── (auth)/         # Rotas autenticadas
│   └── (public)/       # Rotas públicas
├── components/         # Componentes reutilizáveis
│   ├── Button/
│   ├── FeedCard/
│   ├── CommentModal/
│   └── ...
├── utils/              # Utilitários
│   └── api.ts          # Cliente HTTP
└── storage/            # Gerenciamento de armazenamento
    └── tokenCache.ts   # Cache de tokens
```

## 📊 Monitoramento e Atualização

### Ambientes
- **Desenvolvimento**: `localhost:8081` (Expo Dev Server)
- **Produção**: Builds nativos para Android/iOS

### Monitoramento
- **Logs**: Console do Expo Dev Tools
- **Performance**: React Native Performance Monitor
- **Erros**: Expo Error Reporting

### Atualização
- **Hot Reload**: Atualização automática durante desenvolvimento
- **Over-the-Air Updates**: Expo Updates para atualizações sem rebuild
- **Builds**: Expo Build Service para builds de produção

## 🔧 Manutenção e Utilização

### Contribuição
1. Crie uma branch feature a partir de `main`
2. Implemente as alterações seguindo os padrões do projeto
3. Execute os testes e validações
4. Submeta um Pull Request

### Padrões de Código
- **Componentes**: PascalCase para nomes de arquivos
- **Hooks**: Prefixo `use` para hooks customizados
- **Estilos**: Arquivos separados com sufixo `.style.ts`
- **Tipos**: Interfaces com prefixo `I` (ex: `IUser`)

### Documentação Adicional
- **Componentes**: Documentação inline para componentes complexos
- **APIs**: [Documentação completa das APIs](../docs/API.md)
- **Arquitetura**: [Documentação detalhada da arquitetura](../docs/ARCHITECTURE.md)
- **Configuração**: Documentação de variáveis de ambiente

