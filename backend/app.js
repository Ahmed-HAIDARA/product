const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb+srv://Ahmed:Hind6969@cluster0.rmpso.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  	{ 
		useNewUrlParser: true,
		useUnifiedTopology: true 
	}).then(() => console.log('Connexion à MongoDB réussie !'))
  	.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//app.use(express.urlencoded());

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/product', (req, res, next) => {
    delete req.body._id;
    const product = new Product({
      ...req.body
    });
    product.save().then(
        () => {
            const message = {};
            message.success = true;
            message.status = req.responseStatus || 201;
            res.status(message.status).json(message);
            return next();
        }
    ).catch(error => res.status(400).json({ error }));
});

app.get('/api/product/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(
        product => {
            const message = {};
            message.data = product;
            message.success = true;
            message.status = req.responseStatus || 200;
            res.status(message.status).json(message);
            return next();
        }
    ).catch(error => res.status(404).json({ error }));
});

app.put('/api/product/:id', (req, res, next) => {
    Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(
        () => {
            const message = {};
            message.success = true;
            message.status = req.responseStatus || 200;
            res.status(message.status).json(message);
            return next();
        }
    ).catch(error => res.status(400).json({ error }));
  });

app.get('/api/products', (req, res, next) => {
    Product.find().then(
        product => {
            const message = {};
            message.data = product;
            message.success = true;
            message.status = req.responseStatus || 200;
            res.status(message.status).json(message);
            return next();
        }      
    ).catch(error => res.status(400).json({ error }));
});

app.delete('/api/product/:id', (req, res, next) => {
    Product.deleteOne({ _id: req.params.id }).then(
        () => {
            const message = {};
            message.success = true;
            message.status = req.responseStatus || 200;
            res.status(message.status).json(message);
            return next();
        }
    ).catch(error => res.status(400).json({ error }));
  });

module.exports = app;