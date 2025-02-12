function formattedData(data) {
    let newObj = {};
  data.map((obj) => {
    Object.keys(obj).forEach((key) => {
      let newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObj[newKey] = obj[key];
    });
  });
  return newObj;
}

export default formattedData;