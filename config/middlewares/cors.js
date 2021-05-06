module.exports = function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'X-POICA-Access-Token, Content-Type');
  res.set('Access-Control-Request-Method', 'GET, POST');
  next();
};
