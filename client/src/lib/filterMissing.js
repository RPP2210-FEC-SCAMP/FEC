const missing = (obj) => {
  let missing = Object.keys(obj)
  .filter(field => obj[`${field}`] === '')
  .join(', ');

  return missing;
};

export default missing