const express = require('express');
const bodyParser = require('body-parser');

const socketio = require('socket.io');

const app = express();
const port = 3001;

const server = app.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`);
});

const io = socketio(server);

app.use(bodyParser.json());

app.post('/nivel', (req, res) => {
  const nivelAgua = req.body.nivel;
  console.log('Nível de Água:', nivelAgua);
  io.emit('valorNivel', nivelAgua);
  res.sendStatus(200);
});
