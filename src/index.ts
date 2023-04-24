const mysql = require('mysql');

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Dartveider123',
  database: 'teste_server_carros'
})

connection.connect((error: { stack: string; }) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados: ' + error.stack);
    return;
  }
  console.log('Conexão bem sucedida com o banco de dados.');
});

connection.query('SELECT * FROM tabela', (error: { stack: string; }, results: any, fields: any) => {
  if (error) {
    console.error('Erro ao executar a consulta: ' + error.stack);
    return;
  }
  console.log('Resultado da consulta: ', results);
});