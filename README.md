# reStora

reStora é um projeto criado para explorar a **criação de APIs**, **integração de IA**, **sistemas SaaS** e a **conexão fullstack entre frontend e backend** utilizando o Supabase.

A ideia inicial era construir um aplicativo que permitisse restaurar imagens danificadas, combinando **tecnologia de ponta** com uma **experiência de usuário simples e eficiente**.

## 🚀 Tecnologias Utilizadas

- **Supabase** - Armazenamento de imagens e gestão de permissões
- **Replicate API** - Processamento de imagens via IA
- **Next.js** - Estruturação do frontend
- **TypeScript** - Tipagem segura e confiável
- **Tailwind CSS** - Estilização moderna e responsiva

## 🛠️ Como Funciona

O aplicativo segue um fluxo simples e eficiente:

1. **Upload da Imagem** - O usuário envia uma imagem, que é armazenada em um bucket do Supabase.
2. **Processamento com IA** - A imagem é enviada para a API do Replicate, que executa a restauração.
3. **Exibição e Download** - O resultado final é exibido para o usuário, que pode baixar a versão restaurada.

## ⚡ Desafios e Aprendizados

- **Configuração de APIs de IA**
- **Problemas de tipagem no TypeScript**
- **Gerenciamento de permissões no Supabase**
- **Otimização do fluxo de upload e processamento**

Esses desafios foram essenciais para aprofundar meu conhecimento em desenvolvimento fullstack e na integração de tecnologias modernas.

## 📂 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/reStora.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd reStora
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente no arquivo `.env.local`
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   REPLICATE_API_KEY=your_replicate_api_key
   ```
5. Execute o projeto:
   ```bash
   npm run dev
   ```
6. Acesse **http://localhost:3000** no navegador.

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias e novas funcionalidades! Para isso:

1. Fork o repositório
2. Crie uma nova branch:
   ```bash
   git checkout -b minha-melhoria
   ```
3. Faça suas modificações e commite:
   ```bash
   git commit -m "Melhoria: Adicionei nova funcionalidade X"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-melhoria
   ```
5. Abra um Pull Request 🚀

## 📜 Licença

Este projeto foi desenvolvido com fins educacionais e exploratórios. Caso tenha interesse em utilizá-lo, entre em contato!

---

🎯 **reStora** é um marco no meu aprendizado, demonstrando habilidades em desenvolvimento fullstack, solução de problemas e criação de sistemas escaláveis. Obrigado por conferir este projeto! 😊

