const auth = require('../../app/auth.js');

module.exports = async function (req, res, next) {
  const accessToken = req.get('X-POICA-Access-Token', process.env.FE_URL);
  try {
    await auth.authorize(accessToken);
  } catch (e) {
    res.status(403).json({
      result: 'error',
      type: 'UNAUTHORIZED',
    });
    return next('router');
  }
  next();
};