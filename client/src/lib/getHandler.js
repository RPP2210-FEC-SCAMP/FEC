import axios from 'axios';

const getHandler = async (url, id, callback) => {
  let options = {
    'url': url,
    'params': {'product_id': id},
    'method': 'get'
  }

  try {
    const response = await axios.request(options);
    callback(response);
  } catch (err) {
    console.log('get' + url + 'Err', err);
  }
};

export default getHandler;