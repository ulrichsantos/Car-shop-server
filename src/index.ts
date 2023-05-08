import express from 'express';
import { OkPacket, createConnection } from 'mysql2';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import cors = require('cors');
import fs from 'fs';
import multer from 'multer';


const app = express();

app.use(cors({
  origin: ['http://localhost:5173']
}));

app.listen

app.use(express.json());

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const carroId = req.params.carroId;
    const folderPath = `imagens/${carroId}`;
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

interface Carro {
  valor: number;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: number;
  kilometragem: number;
  imagens: FileList | null;
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

app.post('/carros', upload.array('imagens', 5), (req, res) => {
  const { valor, marca, modelo, anoModelo, combustivel, codigoFipe, kilometragem, imagens } = req.body;
  
  connection.query('INSERT INTO carros_infos (valor, marca, modelo, anoModelo, combustivel, codigoFipe, kilometragem) VALUES (?, ?, ?, ?, ?, ?, ?)', [valor, marca, modelo, anoModelo, combustivel, codigoFipe, kilometragem], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar o carro:', err);
      res.status(500).json({ message: 'Erro ao adicionar o carro' });
      return;
    }

    const carroId = (results as OkPacket).insertId; // Obtém o ID do carro inserido

    const folderPath = `imagens/${carroId}`;
    fs.mkdirSync(folderPath, { recursive: true });

    // Move as imagens para a pasta
    if (imagens && imagens.length > 0) {
      for (let i = 0; i < imagens.length; i++) {
        const imagem = imagens[i];
        const imagePath = `${folderPath}/${imagem.name}`;
        fs.writeFileSync(imagePath, Buffer.from(imagem.data, 'base64'));
      }
    }

    res.status(201).json({ message: 'Carro adicionado com sucesso' });
  });
});

app.put('/carros/:codigoFipe', (req, res) => {
  const codigoFipe = req.params.codigoFipe;
  const { valor } = req.body;

  const query = `UPDATE carros_infos SET valor = ? WHERE codigoFipe = ?`;
  connection.query(query, [valor, codigoFipe], (err, result: OkPacket) => {
    if (err) {
      console.error('Erro ao executar a consulta: ', err);
      res.status(500).send('Erro ao atualizar o valor do carro');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Carro não encontrado');
      return;
    }

    res.status(200).send('Valor do carro atualizado com sucesso');
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
    res.status(204).send('Veiculo excluido');
  });
});
