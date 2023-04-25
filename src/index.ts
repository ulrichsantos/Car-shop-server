import express from 'express';
import { createConnection } from 'mysql2';

const app = express();

// Conecta ao banco de dados MySQL
const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ithigo321',
  database: 'carro'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conexão bem-sucedida com o banco de dados!');
});

// Rota de teste
app.get('/', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
    if (err) {
      console.error('Erro ao executar a consulta: ', err);
      return res.status(500).json({ error: 'Erro ao executar a consulta' });
    }
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000!');
});
