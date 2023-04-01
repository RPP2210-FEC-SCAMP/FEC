const createFeatureSet = (originalProduct, relatedProduct) => {
  var newFeatureSet = [];
  var ogLength;

  try {
    originalProduct.features.map((feature) => {
      newFeatureSet.push({
        'feature': feature.feature,
        'originalValue': feature.value
      });
    });

    ogLength = newFeatureSet.length;

    relatedProduct.features.map((feature) => {
      var found;
      for(var i = 0; i < newFeatureSet.length; i++) {
        if (newFeatureSet[i].feature == feature.feature) {
          found = newFeatureSet[i];
          break;
        }
      }
      if (found) {
        newFeatureSet[i]['relatedValue'] = feature.value;
      } else {
        newFeatureSet.push({
          'feature': feature.feature,
          'relatedValue': feature.value
        })
      }
    });
  } catch (err) {
    console.log(err);
  }

  return newFeatureSet;
};

export default createFeatureSet;