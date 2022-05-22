/* eslint-disable no-tabs */
const express = require('express');
const expressWinston = require('express-winston');
const path = require('path');
const cookieParser = require('cookie-parser');

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5433,
  password: 'postgres',
  database: 'postgres',
});

client.connect();

const authRouter = require('./routes/auth');

const createApp = (logger) => {
  const app = express();

  const router = express.Router();

  app.use(expressWinston.logger({ winstonInstance: logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // TODO: Serve your React App using the express server
  const buildPath = path.normalize(path.join(__dirname, './client/build'));
  app.use(express.static(buildPath));

  app.use('/auth', authRouter);

  app.use('/gallery', router.get('/', async (req, res) => {
    let categories = [];
    let photos = [];

    client.query('Select * from animal_categories', (dbCatErr, dbCatRes) => {
      if (!dbCatErr) {
        categories = dbCatRes.rows;
        client.query(
          'Select category_id, photo_url from animal_photos',
          (dbAnErr, dbAnRes) => {
            if (!dbAnErr) {
              photos = dbAnRes.rows;

              const groupByCategoryID = photos.reduce((group, photo) => {
                // eslint-disable-next-line camelcase
                const { category_id } = photo;
                let categoryName = '';

                // eslint-disable-next-line no-restricted-syntax
                for (const type of categories) {
                  // eslint-disable-next-line camelcase
                  if (type.id === category_id) {
                    categoryName = type.category;
                    break;
                  }
                }
                // eslint-disable-next-line no-param-reassign
                group[categoryName] = group[categoryName] ?? [];
                group[categoryName].push(photo.photo_url);
                return group;
              }, {});

              res.send({
                imgs: groupByCategoryID,
                categories: categories.map((item) => item.category),
              });
            } else {
              console.error(dbAnRes.message);
              res.sendStatus(500);
            }
          },
        );
      } else {
        console.error(dbCatErr.message);
        res.sendStatus(500);
      }
    });
  }));

  // catch 404 and forward to error handler
  app.use((req, res) => {
    res.status(404).send('Not found');
  });

  // error handler
  app.use((err, req, res) => {
    res.status(err.status || 500);
  });

  return app;
};

module.exports = createApp;
