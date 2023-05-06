"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql2_1 = require("mysql2");
const cors = require("cors");
const app = (0, express_1.default)();
app.use(cors({
    origin: ['http://localhost:5173']
}));
app.listen;
app.use(express_1.default.json());
// Conecta ao banco de dados MySQL
const connection = (0, mysql2_1.createConnection)({
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
            res.status(500).json({ message: 'Erro ao consultar os carros' });
            return;
        }
        res.json(results);
    });
});
app.get('/carros/:codigoFipe', (req, res) => {
    const codigoFipe = req.params.codigoFipe;
    const query = `SELECT * FROM carros_infos WHERE codigoFipe = ${codigoFipe}`;
    connection.query(query, (err, rows) => {
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
    const { valor, marca, modelo, anoModelo, combustivel, codigoFipe, kilometragem } = req.body;
    connection.query('INSERT INTO carros_infos (valor, marca, modelo, anoModelo, combustivel, codigoFipe, kilometragem) VALUES (?, ?, ?, ?, ?, ?, ?)', [valor, marca, modelo, anoModelo, combustivel, codigoFipe, kilometragem], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar o carro:', err);
            res.status(500).json({ message: 'Erro ao adicionar o carro' });
            return;
        }
        res.status(201).json({ message: 'Carro adicionado com sucesso' });
    });
});
app.put('/carros/:codigoFipe', (req, res) => {
    const codigoFipe = req.params.codigoFipe;
    const { valor } = req.body;
    const query = `UPDATE carros_infos SET valor = ? WHERE codigoFipe = ?`;
    connection.query(query, [valor, codigoFipe], (err, result) => {
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
    connection.query(query, (err, result) => {
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
//# sourceMappingURL=index.js.map