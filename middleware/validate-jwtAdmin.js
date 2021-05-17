const jwt = require("jsonwebtoken");
const {AdminModel} = require("../models");

const validateJWTAdmin = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    const { authorization } = req.headers;
    const payload = authorization ? jwt.verify(authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization, process.env.JWT_SECRET): undefined;
    if (payload) {
      AdminModel.findOne({
        where: {
          id: payload.id
        }
      })
      .then(admin => {
        req.admin = admin;
        next();
      }).catch(err => {
        console.error(err)
        next()
      });
    } else {
      res.status(401).json({
        message: 'Not allowed'
      });
    }
  } else {
    res.status(401).json({
      message: 'Not allowed 2'
    });
  }
}

module.exports = validateJWTAdmin;