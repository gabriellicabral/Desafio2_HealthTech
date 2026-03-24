const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

/**
 * ANÁLISE DO CENÁRIO E PROBLEMA:
 * A cuidadora enfrenta fragmentação de dados (cadernos, mensagens e memória).
 * PROBLEMA IDENTIFICADO: Dificuldade em rastrear a evolução do paciente e responder familiares com precisão.
 * RECORTE DA SOLUÇÃO: Criar um sistema centralizado de 'Diário de Bordo' digital, conectando 
 * informações fixas do paciente com seus registros de saúde diários.
 */

const criarBanco = async () => {
    // Inicializa a conexão com o banco SQLite. 
    // O uso do SQLite garante que os dados persistam mesmo após fechar a aplicação.
    const db = await open({
        filename: './cuidadora_digital.db',
        driver: sqlite3.Database
    });

    /**
     * 1. TABELA DE PACIENTES (Informações Estruturais)
     * Resolve o problema de esquecer particularidades como alergias ou idade.
     * Centraliza o prontuário básico de cada idoso atendido.
     */
    await db.exec(`
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER,
            observacoes_medicas TEXT -- Espaço para Alergias, comorbidades e avisos urgentes.
        )
    `);

    /**
     * 2. TABELA DE REGISTROS DIÁRIOS (O "Diário de Bordo")
     * Resolve o problema das anotações em papéis perdidos.
     * Usa uma CHAVE ESTRANGEIRA (FOREIGN KEY) para ligar o registro diretamente ao idoso.
     * Isso permite gerar relatórios históricos precisos para os familiares.
     */
    await db.exec(`
        CREATE TABLE IF NOT EXISTS registros_diarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_id INTEGER,
            data_atendimento TEXT,        -- Data do plantão/visita
            humor_paciente TEXT,          -- Estado emocional (importante para evolução geriátrica)
            medicamentos_aplicados TEXT,  -- Controle rigoroso de medicação ministrada
            alimentacao TEXT,             -- Registro nutricional
            intercorrencias TEXT,         -- Relato de eventos anormais (quedas, febre, confusão)
            FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
        )
    `);

    console.log('✅ Banco de dados configurado: Central de Cuidados Ativa.');

    // SEEDING: Popular o banco com dados iniciais para validar a estrutura e lógica.
    const checagem = await db.get(`SELECT COUNT(*) AS total FROM pacientes`);

    if (checagem.total === 0) {
        console.log('📝 Inserindo pacientes e registros de exemplo...');

        // Cadastro de paciente fictício baseado no cenário realista.
        await db.run(`INSERT INTO pacientes (nome, idade, observacoes_medicas) 
                      VALUES ('Dona Benta', 82, 'Diabética e hipertensa. Alérgica a Dipirona.')`);
        
        const paciente = await db.get(`SELECT id FROM pacientes WHERE nome = 'Dona Benta'`);

        /**
         * REGISTROS DIÁRIOS:
         * Demonstra a evolução do quadro de saúde ao longo de dois dias diferentes.
         * Isso resolve a "sensação de esforço maior que o necessário" ao tentar lembrar do passado.
         */
        await db.run(`
            INSERT INTO registros_diarios (paciente_id, data_atendimento, humor_paciente, medicamentos_aplicados, alimentacao, intercorrencias)
            VALUES 
            (?, '2026-03-24', 'Calmo', 'Insulina 10ui, Enalapril 20mg', 'Almoçou bem (sopa de legumes)', 'Nenhuma intercorrência.'),
            (?, '2026-03-25', 'Agitada', 'Insulina 10ui', 'Recusou o café da manhã', 'Apresentou leve confusão mental pela manhã.')
        `, [paciente.id, paciente.id]);
    }

    /**
     * CONSULTA DE VALIDAÇÃO (Relatório para familiares):
     * Resolve a dor de "familiares solicitarem atualizações detalhadas".
     * O JOIN une as duas tabelas para mostrar o nome do paciente ao lado de sua evolução.
     */
    console.log('------ 📊 RELATÓRIO DE EVOLUÇÃO PARA FAMILIARES ------');
    const historico = await db.all(`
        SELECT p.nome AS Paciente, r.data_atendimento AS Data, r.humor_paciente AS Humor, r.intercorrencias AS Notas
        FROM registros_diarios r
        JOIN pacientes p ON r.paciente_id = p.id
        WHERE p.nome = 'Dona Benta'
        ORDER BY r.data_atendimento DESC
    `);
    
    // Mostra os dados de forma organizada no console
    console.table(historico);

    return db;
};

// Executa a inicialização ao rodar o arquivo
criarBanco();

// Exporta para que o Express possa utilizar a mesma conexão no futuro
module.exports = { criarBanco };