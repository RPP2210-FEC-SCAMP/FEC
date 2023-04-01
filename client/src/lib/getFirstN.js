const getFirstN = (text, n) => {
  const textArray = text.split(' ');
  const outputString = textArray.reduce((acc, word) => {
    if ((acc.length + word.length) < n) {
      acc = acc + word + ' ';
    }
    return acc;
  }, '')
  return outputString;
}

export default getFirstN;