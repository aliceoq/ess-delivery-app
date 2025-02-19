const express = require('express');
const bodyParser = require('body-parser');

const { ClientService } = require('./src/clients/clients-service');
const { OrderService } = require('./src/orders/orders-service');

var app = express();

exports.app = app;

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

app.use(allowCrossDomain);
app.use(bodyParser.json());

var clientService = new ClientService();
var orderService = new OrderService();

app.get('/client/:id', function (req, res) {
  // get client data by ID
  const id = req.params.id;
  try {
    const result = clientService.getById(id);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'Client could not be found' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.get('/client/email/:email', function (req, res) {
  // get client data by email
  const email = req.params.email;
  try {
    const result = clientService.getByEmail(email);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'Client could not be found' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.put('/client/valid_phone/:id&:code', function (req, res) {
  // get code to valid phone number
  const id = req.params.id;
  const code = req.params.code;
  try {
    const resultID = clientService.getById(id);
    if(resultID){
      const result = clientService.updateValidNumberStatus(id, code);
      if (resultID && result.code === code) {
        res.status(200).send({ message: "Code OK" });
      } else{
        res.status(404).send({ message: "Wrong code" });
      }
    }else {
      res.status(404).send({ message: 'Client could not be found' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.post('/client', function (req, res) {
  // register
  const client = req.body;
  
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ message: 'Object missing' });
    return;
  }
  
  try {
    
    const result = clientService.add(client);
    if (typeof result === 'object') {
      res.status(201).send(result);
    } else if(result === "cpf") {
      res.status(403).send({ message: 'Client with CPF already registered' });
    } else if(result === "email") {
      res.status(403).send({ message: 'Client with email already registered' });
    }else if(result === "phone") {
      res.status(403).send({ message: 'Client with phone already registered' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.delete('/client/:id', function (req, res) {
  // delete
  const id = req.params.id;
  const reason = req.query.reason;
  try {
    const result = clientService.delete(id, reason);
    if (result) {
      res.status(201).send({ message: 'Client successfully deleted' });
    } else {
      res.status(200).send({ message: 'Client could not be deleted' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.put('/client', function (req, res) {
  // update
  const client = req.body;
  try {
    const result = clientService.update(client);
    if (result) {
      res.status(201).send(result);
    } else {
      res.status(403).send({ message: 'Client could not be updated' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.post('/client/login', function (req, res) {
  // login
  const email = req.body.email;
  const password = req.body.password;
  try {
    const result = clientService.authenticate(email, password);
    if (result) {
      const client = clientService.getByEmail(email);
      res
        .status(201)
        .send({ message: 'Client authenticated', token: client.id });
    } else {
      res.status(403).send({ message: 'Client could not authenticate' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.post('/client/check_password/:id', function (req, res) {
  // login
  
  const id = req.params.id;
  const password = req.body.password;
  try {
    const result = clientService.checkPassword(id, password);
    if (result) {
      res.status(200).send({ message: 'Correct password' });
    } else {
      res.status(201).send({ message: 'Incorrect password' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.post('/client/forgot_password/:email', function (req, res) {
  const email = req.params.email;
  try {
    clientService.forgotPassword(email).then((result) => {
      if (result) {
        res.status(201).send({ message: 'E-mail sent' });
      } else {
        res.status(200).send({ message: 'E-mail not sent' });
      }
    });
  }
  catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.get('/order/:id', function (req, res) {
  // get order data by ID
  const id = req.params.id;
  try {
    const result = orderService.getById(id);
    if (result) {
      res.status(201).send(result);
    } else {
      res.status(403).send({ message: 'Order could not be found' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.get('/orders/client/:clientId/:page', function (req, res) {
  // get order list
  const clientId = req.params.clientId;
  const page = req.params.page;
  var filters = req.query.filters
  try {
    const result = orderService.getByClientId(clientId, page, filters);
    if (result) {
      res.status(201).send(result);
    } else {
      res.status(403).send({ message: 'Order list could not be found' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.get('/orders/total_orders/:clientId', function (req, res) {
  // get order qt
  const clientId = req.params.clientId;
  try {
    const result = orderService.getTotalOrders(clientId);
    if (result >= 0) {
      res.status(201).send({ total_orders: result });
    } else {
      res.status(403).send({ message: 'Order list could not be found' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.post('/order', function (req, res) {
  // register
  const order = req.body;
  try {
    const result = orderService.add(order);
    if (result) {
      res.status(201).send(result);
    } else {
      res.status(403).send({ message: 'Order could not be added' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.delete('/order/:id', function (req, res) {
  // delete
  const id = req.params.id;
  try {
    const result = orderService.delete(id);
    if (result) {
      res.status(201).send({ message: 'Order successfully deleted' });
    } else {
      res.status(403).send({ message: 'Order could not be deleted' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.delete('/order/client/:clientId', function (req, res) {
  // delete all by clientID
  const clientId = req.params.clientId;
  try {
    const result = orderService.deleteByClientId(clientId);
    if (result) {
      res.status(201).send({ message: 'Order(s) successfully deleted' });
    } else {
      res.status(403).send({ message: 'Order(s) could not be deleted' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

app.get('/orders/analytics/:clientId', function (req, res) {
  // get order list
  const clientId = req.params.clientId;
  var filters = JSON.parse(req.query.filters);
  try {
    const result = orderService.getAnalytics(clientId, filters);
    /*
    result = {
      most_request = {
        food = [ {name: "", value: 3},  {name: "", value: 2}],
        total_food = 5,
        restaurant = [ {name: "", value: 3}, {name: "", value: 2} ],
        total_restaurant = 5
      },
      most_expensive = {
        food = [ {name: "", value: 13.00},  {name: "", value: 5.00}],
        total_food = 18.00,
        restaurant = [ {name: "", value: 13.00}, {name: "", value: 5.00} ],
        total_restaurant = 18.00
      }
    }
    */
    if (result) {
      res.status(201).send(result);
    } else {
      res
        .status(403)
        .send({ message: 'Order analytics could not be calculated' });
    }
  } catch (err) {
    const { message } = err;
    res.status(400).send({ message });
  }
});

var server = app.listen(3000, function () {
  console.log('\nExample app listening on port 3000!');
});
exports.server = server;

function closeServer() {
  server.close();
}
exports.closeServer = closeServer;
