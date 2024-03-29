import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './database/db.js';
import cors from 'cors';
import auth from './api/auth.js';
import users from './api/users.js';
import deals from './api/deals.js';
import contacts from './api/contacts.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
//import { sampleData } from './sampleData.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

connectDB();

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

if(process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:3000'
    }));
}

// JSON Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/contacts', contacts);
app.use('/api/deals', deals);

// Serve frontend
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './client/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './', 'client', 'build', 'index.html')))
}

const server = createServer(app);

let io;
if(process.env.NODE_ENV === 'development') {
    io = new Server(server, {
        cors: '*'
    });
} else {
    io = new Server(server)
}

io.on('connection', (socket) => {
    socket.on('joinRoom', data => {
        socket.join(data);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV}`));
//sampleData();
export default io;