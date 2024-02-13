const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./db/configDb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 5000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for user-related operations
app.use('/users', userRoutes);

// Routes for blog-related operations
app.use('/blogs', blogRoutes);

// Routes for comment-related operations
app.use('/comments', commentRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Hello from home');
});

// Authenticate with the database
sequelize.authenticate()
    .then(() => {
        console.log('Connected to the MySQL database.');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`The server is running on port: http://localhost:${PORT}`);
});
