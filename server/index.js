const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
require('dotenv').config();
const api = require('../config.js');
const multer = require('multer');
const fs = require('fs');

const storeImage = require('./lib/storeImage.js');

app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(express.json());

// Set up multer to handle file uploads
// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../client/dist/images'));
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    cb(null, `${originalName}`);
  }
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, '../client/dist')));


app.post('/uploadReviewPic', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileName = file.originalname;

  const filePath = path.join(__dirname, `../client/dist/images/${fileName}`)

  // Redirect to the storeReviewPic route with fileName as a query parameter
  res.redirect(`/storeReviewPic?filePath=${filePath}`);
});



app.get('/storeReviewPic', (req, res) => {
  const filePath = req.query.filePath;

  // Add image to cloudinary api
  storeImage(filePath, (file) => {
    res.send('' + file.url);
  });

})

app.post('/addReview', (req, res, next) => {


  console.log(JSON.stringify(req.body));
  let options = {
    'url': api.REVIEWSURL,
    'method': 'post',
    'maxBodyLength': Infinity,
    'maxContentLength': Infinity,
    'headers': {
      'Authorization': api.TOKEN,
      'Content-Type': 'application/json'
    },
    'data': req.body
  }

  axios.request(options).then((data) => {
    res.sendStatus(202);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(405);
  })
});

app.get('/product', (req, res, next) => {
  let options = {
    'url': req.query ? api.URL + req.query['product_id'] : api.testURL,
    // 'url': api.URL,
    // 'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }
  console.log(options);
  axios.request(options).then((data) => {
    // console.log(data.data);
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.get('/styles', (req, res, next) => {
  let options = {
    'url': req.query ? api.URL + req.query['product_id'] + '/styles' : api.testURL + 'styles',
    // 'url': api.URL + '/styles',
    'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  };

  axios.request(options)
  .then((styleData) => {
    console.log(styleData.data);
    res.send(styleData.data.results);
  })
  .catch((err) => {
    res.sendStatus(400, err)
  })
});

//retrieve list of questions
app.get('/questions', async (req, res) => {
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
app.post('/questions/add', async (req, res) => {
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

//post answer
app.post('/answer/add', async (req, res) => {
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


//increase helpfulness of question
app.put('/question/helpful', async (req, res) => {
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

//increase helpfulness of answer
app.put('/answer/helpful', async (req, res) => {
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

app.get('/reviews', (req, res, next) => {
  let options = {
    'url': api.REVIEWSURL,
    'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.get('/reviewsMeta', (req, res, next) => {
  console.log(req.query);
  let options = {
    'url': api.REVIEWSURL + 'meta',
    'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.get('/related', (req, res, next) => {
  let options = {
    //TODO: change this back when api.URL no longer hardcoded
    // 'url': req.query ? api.testURL + req.query['product_id'] + '/related' : api.URL + '/related',
    // 'url': api.URL + req.query['product_id'] + '/related',
    'url': api.URL + req.query['product_id'] + '/related',
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

// app.get('/relatedProduct', (req, res, next) => {
//   let options = {
//     'url': api.testURL + req.query['productID'],
//     'method': 'get',
//     'headers': {
//       'Authorization': api.TOKEN
//     }
//   }

//   axios.request(options)
//     .then((data) => {
//       res.send(data.data);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.sendStatus(404);
//     })
// });

// app.get('/relatedProduct', (req, res, next) => {
//   let options = {
//     'url': api.URL + req.query['product_id'],
//     'method': 'get',
//     'headers': {
//       'Authorization': api.TOKEN
//     }
//   }

//   axios.request(options)
//     .then((data) => {
//       res.send(data.data);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.sendStatus(404);
//     })
// });


app.put('/reviewsHelpful', (req, res, next) => {
  let options = {
    'url': api.REVIEWSURL + req.query['reviewID'] + '/helpful',
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
})

app.put('/reviewsReport', (req, res, next) => {
  let options = {
    'url': api.REVIEWSURL + req.query['reviewID'] + '/report',
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
})

app.post('/deleteImages', (req, res, next) => {
  const directory = path.join(__dirname, '../client/dist/images');
  fs.readdir(directory, (err, files) => {
    if (err) {
      res.sendStatus(405);
    };

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) {
          res.sendStatus(405);
        }
      });
    }
  });
  res.sendStatus(202);
})

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on ${port}`)
});