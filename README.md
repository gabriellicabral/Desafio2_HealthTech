# 🏥 Sistema de Gestão para Cuidores Autônomos (Cuidadora Digital)

Este projeto foi desenvolvido como solução para o desafio de Back-end, focado em resolver a fragmentação de informações na rotina de cuidadores de idosos.

## 📋 Cenário e Problema Identificado
A cuidadora atende múltiplos pacientes de forma autônoma. O problema central identificado foi a **fragmentação de dados**: informações críticas (medicamentos, humor, intercorrências) estavam espalhadas entre cadernos físicos, mensagens de WhatsApp e memória. 

Isso gerava:
1. Perda de tempo na busca por históricos.
2. Dificuldade em fornecer relatórios precisos para familiares.
3. Risco de esquecimento de particularidades médicas (alergias, horários).

## 💡 Solução Proposta
Uma aplicação Backend centralizada que utiliza um banco de dados relacional para conectar:
- **Pacientes:** Dados fixos e observações médicas permanentes.
- **Diário de Bordo:** Registros diários de cada atendimento, permitindo uma linha do tempo clara da evolução do idoso.

## 🛠️ Tecnologias Utilizadas
- **Node.js**: Ambiente de execução.
- **SQLite3**: Banco de dados leve e persistente (não requer instalação de servidor de banco).
- **SQLite (Biblioteca)**: Para facilitar o uso de `async/await` em consultas SQL.
- **Nodemon**: Para atualização em tempo real durante o desenvolvimento.

## 🗄️ Estrutura do Banco de Dados
A solução utiliza duas tabelas relacionadas:
- `pacientes`: Armazena `id`, `nome`, `idade` e `observacoes_medicas`.
- `registros_diarios`: Armazena a rotina (`humor`, `medicamentos`, `alimentacao`, `intercorrencias`) ligada ao paciente via `paciente_id` (Foreign Key).

## 🚀 Como Executar
1. Instale as dependências:
   ```bash
   npm install
