// const http = require('http');
// const port = process.env.PORT || 3000;
// const app = require('./app');
// const server = http.createServer(app);
// server.listen(port);
const http = require('http');
const WebSocket = require('ws'); // Importa o pacote 'ws'
const port = process.env.PORT || 3000;
const app = require('./app');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Cria o servidor WebSocket

// Lida com conexões WebSocket
wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida.');

    // Lida com mensagens recebidas do cliente WebSocket
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Mensagem recebida do cliente:', data);

        // Aqui você pode processar a mensagem e enviar uma resposta se necessário
        // ws.send('Resposta para o cliente: ' + message);
    });

    // Lida com o evento de fechamento da conexão WebSocket
    ws.on('close', () => {
        console.log('Conexão WebSocket fechada.');
    });
});

// Inicia o servidor HTTP
server.listen(port, () => {
    // console.log(`Servidor rodando na porta ${port}.`);
});
