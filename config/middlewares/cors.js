module.exports = function (req, res, next) {
  res.set('Access-Control-Allow-Origin', process.env.FE_URL);
  res.set('Access-Control-Allow-Headers', 'X-POICA-Access-Token');
  res.set('Access-Control-Request-Method', 'GET, POST');
  next();
};