require('dotenv/config');
const express = require('express');
const cors = require('cors');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const https = require('https');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(staticMiddleware);
app.use(sessionMiddleware);

app.get('/api/products', (req, res, next) => {
  const sql = `
    SELECT "productId", "name", "price", "image", "shortDescription"
      FROM "products"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/products/:productId', (req, res, next) => {
  const productId = parseInt(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({
      error: '"productId" must be a positive integer'
    });
  }
  const sql = `
    SELECT "productId", "name", "price", "image", "shortDescription", "longDescription"
      FROM "products"
     WHERE "productId" = $1
  `;
  const params = [productId];
  db.query(sql, params)
    .then(result => {
      const product = result.rows[0];
      if (!product) {
        res.status(404).json({
          error: `Cannot find product with "productId" ${productId}`
        });
      } else {
        res.json(product);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/products/:pageNum/:itemsPerPage', (req, res, next) => {
  const pageNum = parseInt(req.params.pageNum) || 1;
  const itemsPerPage = parseInt(req.params.itemsPerPage) || 12;
  if (!Number.isInteger(pageNum) || pageNum <= 0) {
    return res.status(400).json({
      error: '"pageNum" must be a positive integer'
    });
  }
  if (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0) {
    return res.status(400).json({
      error: '"itemsPerPage" must be a positive integer'
    });
  }
  const sql = `
    SELECT "productId", "name", "price", "image", "shortDescription",
      (SELECT count("productId") FROM "products") AS "total"
      FROM "products"
    ORDER BY "productId" ASC
    OFFSET $1
     LIMIT $2
  `;
  const params = [(pageNum - 1) * itemsPerPage, itemsPerPage];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/cart', (req, res, next) => {
  const sql = `
    SELECT "c"."cartItemId",
            "c"."price",
            "p"."productId",
            "p"."image",
            "p"."name",
            "p"."shortDescription"
        FROM "cartItems" AS "c"
        JOIN "products" AS "p" USING ("productId")
      WHERE "c"."cartId" = $1
  `;
  const value = [req.session.cartId];
  db.query(sql, value)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      next(err);
    });
});

app.post('/api/cart', (req, res, next) => {
  const { productId, price } = req.body;
  if (!Number.isInteger(productId) || productId <= 0) {
    return next(new ClientError('"productId" must be a positive integer', 400));
  }
  const sqlInitialQuery = `
    SELECT "productId"
    FROM "products"
    WHERE "productId" = $1
  `;
  const valueInitial = [productId];
  db.query(sqlInitialQuery, valueInitial)
    .then(result => {
      if (!result.rows.length) {
        throw new ClientError(`Cannot find the productId:" ${productId}`, 400);
      }
      if (!req.session.cartId) {
        const sqlForCreateCart = `
          INSERT INTO "carts" ("cartId", "createdAt")
          VALUES (default, default)
          RETURNING "cartId"
        `;
        return db.query(sqlForCreateCart)
          .then(result => {
            return { cartId: result.rows[0].cartId, price: price };
          });
      } else {
        return { cartId: req.session.cartId, price: price };
      }
    })
    .then(result => {
      req.session.cartId = result.cartId;
      const sqlForCreateCartItem = `
          INSERT INTO "cartItems" ("cartId", "productId", "price")
          VALUES ($1, $2, $3)
          RETURNING "cartItemId"
        `;
      const valuesForCartItem = [req.session.cartId, productId, Number(price)];
      return db.query(sqlForCreateCartItem, valuesForCartItem)
        .then(result => {
          return { cartItemId: result.rows[0].cartItemId };
        });
    })
    .then(result => {
      req.session.cartItemId = result.cartItemId;
      const sqlForRetriveData = `
             SELECT "c"."cartItemId",
                    "c"."price",
                    "p"."productId",
                    "p"."image",
                    "p"."name",
                    "p"."shortDescription"
               FROM "cartItems" AS "c"
               JOIN "products" AS "p" USING ("productId")
              WHERE "c"."cartItemId" = $1
            `;
      const valuesForRetriveData = [req.session.cartItemId];
      return db.query(sqlForRetriveData, valuesForRetriveData)
        .then(result => {
          res.status(201).json(result.rows[0]);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.post('/api/order', (req, res, next) => {
  const { cartId } = req.session;
  const { name, creditCard, shippingAddress } = req.body;
  if (!cartId) {
    return next(new ClientError('"cartId" is not existed. Cart is empty.', 400));
  }
  if (!name) {
    return next(new ClientError('"name" is required.', 400));
  }
  if (!creditCard) {
    return next(new ClientError('"creditCard" is required.', 400));
  }
  if (!shippingAddress) {
    return next(new ClientError('"shippingAddress" is required.', 400));
  }
  const sql = `
    INSERT INTO "orders" ("cartId", "name", "creditCard", "shippingAddress")
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [cartId, name, creditCard, shippingAddress];

  db.query(sql, values)
    .then(result => {
      req.session.destroy();
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.delete('/api/cart', (req, res, next) => {
  const { cartId } = req.session;
  const { productId } = req.body;
  if (!cartId) {
    return next(new ClientError('"cartId" is not existed. Cart is empty.', 400));
  }
  if (!productId) {
    return next(new ClientError('"productId" is required.', 400));
  }

  const sql = `
    DELETE FROM "cartItems"
      WHERE "cartItemId"
        IN (
          SELECT "cartItemId"
          FROM "cartItems"
          WHERE "cartId" = $1
          AND "productId"= $2
          ORDER BY "cartItemId" ASC
          LIMIT 1)
      RETURNING *
  `;
  const values = [cartId, productId];

  db.query(sql, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

if (process.env.ENV === 'DEV') {
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', process.env.PORT);
  });
} else if (process.env.ENV === 'LIVE') {
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/city.heegu.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/city.heegu.net/fullchain.pem')
  },
  app).listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
    console.log(`[https] JSON Server listening on port ${process.env.PORT}`);
  });
}
