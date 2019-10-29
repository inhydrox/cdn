const { server } = require('./config.json');
const { readdirSync } = require('fs');

// Server
const express = require('express');

// Middleware
const authHandler = require('./authHandler');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');

const app = express();

// Configuring Server
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(cookieParser());
app.use(authHandler.getUser);
app.use('/auth', authHandler.handler);
app.use(express.static(`${__dirname}/assets`));

// Route Registration
const routes = readdirSync('./routes/').map(path => require(`./routes/${path}`));

for (const { method, path, middleware, handler } of routes) {
  app[method](path, ...middleware, handler);
  console.info(`Registered route handler for ${path}`);
}

// Start Server
app.listen(server.port, server.address);