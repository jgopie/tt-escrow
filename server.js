require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const cors = require('cors');

const PORT = process.env.PORT || 3500;
console.log(`${process.env.NODE_ENV} Mode started`);

app.use(logger);

app.use(cors(corsOptions));

// app.use(cookieParser);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./router/root'));
app.use('/users', require('./router/userRoutes'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: 'Resource not found - 404' });
    } else {
        res.type('txt').send('Resource not found - 404');
    }
});

app.use(errorHandler);


app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
