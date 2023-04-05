const express = require('express');
const app = express.Router();
const axios = require('axios');
const api = require('../../config.js');

//post answer
app.post('/add', async (req, res) => {
  let options = {
    'url': api.QUESTIONS + `/?0=${req.body.question_id}/answers`,
    // 'params': req.body.question_id,
    'method': 'post',
    'headers': {
      'Authorization': api.TOKEN
    },
    'data': {
      'body': req.body.answer,
      'name': req.body.nickname,
      'email': req.body.email,
      'photos': req.body.photos
    }
  }

  try {
    let result = await axios.request(options);
    console.log(result);
    res.send('Working');
  } catch(err) {
    res.status(404).send(err)
  }
});

//increase helpfulness of answer
app.put('/helpful', async (req, res) => {
  console.log(req.body.answer_id);
  let options = {
    'url': api.ANSWER + `/${req.body.answer_id}/helpful`,
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  await axios.request(options);
  res.status(201).send('working');

});

module.exports = app