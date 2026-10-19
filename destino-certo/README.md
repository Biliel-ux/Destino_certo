# Destino Certo — Portal de Agência de Viagens

Projeto demonstrativo inspirado no desafio de implantação: catálogo digital de destinos e formulário de solicitação de orçamento.

## Requisitos
- Node.js 18 ou superior
- npm (incluído na instalação do Node.js)

## Executar no Windows (PowerShell ou terminal do VS Code)
1. Extraia o ZIP.
2. Entre na pasta do projeto:
   ```powershell
   cd destino-certo
   ```
3. Instale as dependências:
   ```powershell
   npm install
   ```
4. Inicie o servidor:
   ```powershell
   npm start
   ```
5. Abra `http://localhost:3000` no navegador.

Para encerrar, volte ao terminal e pressione `Ctrl + C`.

## Funcionalidades
- Página responsiva com destinos em destaque.
- Botões dos destinos que preenchem o formulário.
- Formulário com validação básica e checagem das datas.
- Solicitações demonstrativas armazenadas no `localStorage` do navegador usado.
- Endpoint de status em `http://localhost:3000/api/status`.

## Limitações importantes
Esta versão é demonstrativa: o formulário não envia e-mail, não faz reserva e não persiste dados em servidor. O armazenamento do navegador é apenas para simular a solicitação. `sql/schema.sql` contém um exemplo de tabela PostgreSQL para uma futura integração real.

## Publicação e domínio
Para publicar gratuitamente, envie o conteúdo para um repositório GitHub e conecte-o a um serviço de hospedagem compatível com Node.js, como Render. Para hospedagem estática (GitHub Pages/Netlify), o HTML pode ser publicado, mas a API Express não será executada nesses serviços estáticos. O registro de domínio e o apontamento DNS devem ser feitos no painel do registrador/provedor; consulte `docs/implantacao.md`.
