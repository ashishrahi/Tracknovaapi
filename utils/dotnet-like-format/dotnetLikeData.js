function formattedData(data) {
    const response = data.map((obj) => {
      let newObj = {};
    Object.keys(obj).forEach((key) => {
      let newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObj[newKey] = obj[key];
    });
    return newObj;
  });
  return response;
}

export default formattedData;