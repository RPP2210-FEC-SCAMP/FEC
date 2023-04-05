const express = require('express');
const app = express.Router();
const axios = require('axios');
const api = require('../../config.js');

//retrieve list of questions for a product
app.get('/', async (req, res) => {
  let options = {
    'method': 'get',
    'url': api.QUESTIONS,
    'params': {
      'product_id': req.query.product_id,
      'page': 2,
      'count': 10
    },
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  try {
    let questions = await axios.request(options);
    res.send(questions.data.results)
  } catch(err) {
    console.log(err);
  }
});

//post question
app.post('/add', async (req, res) => {
  let options = {
    'url': api.QUESTIONS,
    'method': 'post',
    'headers': {
      'Authorization': api.TOKEN
    },
    'data': {
      'body': req.body.question,
      'name': req.body.nickname,
      'email': req.body.email,
      'product_id': req.body.product_id
    }
  }

  try {
    let result = await axios.request(options);
    console.log(result);
    res.send('Working');
  } catch (err){
    res.status(404).send(err);
  }
});

//increase helpfulness of question
app.put('/helpful', async (req, res) => {
  let options = {
    'url': api.QUESTIONS + `/${req.body.question_id}/helpful`,
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  await axios.request(options);
  res.status(201).send('working');

});

module.exports = app