const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const routes = require('./controllers/');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ defaultLayout: main });
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const PORT = process.env.PORT || 3001;
const secret = process.env.SESSION_SECRET;

const app = express();

const sess = {
  secret: secret,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')))

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {console.log('sequelize now listening.')});
})