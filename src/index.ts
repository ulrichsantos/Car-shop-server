import express from 'express';
import { createConnection } from 'mysql2';
import Connection from 'mysql2/typings/mysql/lib/Connection';

const app = express();

app.use(express.json());

interface Carro {
  valor: number;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;
  siglaCombustivel: string;
  dataConsulta: Date;
}

// Conecta ao banco de dados MySQL
const connection: Connection = createConnection({
  host: 'localhost',
  user: 'ulrich',
  password: '123456',
  database: 'carros'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conexão bem-sucedia com o banco de dados!');
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Serviço iniciado na porta 3000!');
});

app.get('/carros', (req, res) => {
  connection.query('SELECT * FROM carros_infos', (err, results) => {
    if (err) {
      alert("Erro ao consultar os carros: ");
      res.status(500).json({message: 'Erro ao consultar os carros'});
      return
    }
    res.json(results);
  });
});

app.get('/carros/:codigoFipe', (req, res) => {
  const codigoFipe = req.params.codigoFipe;
  const query = `SELECT * FROM carros_infos WHERE codigoFipe = ${codigoFipe}`;
  connection.query(query, (err, rows: Carro[]) => { // Especifica o tipo "Carro[]"
    if (err) {
      console.error('Erro ao executar a consulta: ', err);
      res.status(500).send('Erro ao buscar o carro');
      return;
    }
    if (rows.length === 0) { 
      res.status(404).send('Carro não encontrado');
      return;
    }
    const carro = rows[0];
    res.json(carro);
  });
});

app.post('/carros', (req, res) => {
  console.log(req)
  const { valor, marca, modelo, anoModelo, combustivel, codigoFipe, mesReferencia, tipoVeiculo, siglaCombustivel, dataConsulta } = req.body;
  connection.query('INSERT INTO carros_infos(valor, marca, modelo, anoModelo, combustivel, codigoFipe, mesReferencia, tipoVeiculo, siglaCombustivel, dataConsulta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [valor, marca, modelo, anoModelo, combustivel, codigoFipe, mesReferencia, tipoVeiculo, siglaCombustivel, dataConsulta], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar o carro: ', err);
      res.status(500).json({ message: 'Erro ao adicionar o carro' });
      return;
    }
    res.status(201).json({ message: 'Carro adicionado com sucesso' });
  });
});

app.delete('/carros/:codigoFipe', (req, res) => {
  const codigoFipe = req.params.codigoFipe;
  const query = `DELETE FROM carros_infos WHERE codigoFipe = ${codigoFipe}`;
  connection.query(query, (err, result: Carro[]) => {
    if (err) {
      console.error('Erro ao executar a consulta: ', err);
      res.status(500).send('Erro ao excluir o carro');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Carro não encontrado');
      return;
    }
    res.status(204).send();
  });
});
