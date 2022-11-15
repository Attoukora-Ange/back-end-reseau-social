const JWT = require("jsonwebtoken");

const createToken = (payload) => {
  const token = JWT.sign({payload}, process.env.JWT_KEY, { expiresIn: '1d' });
  return token;
};

const verifieToken = (req, res, next) => {
  const payload = req.cookies?.access_token;
  if (!payload) {
    console.log('pas de token')
    // return res.status(500).json( {SESSION_EXPIRE : "Veuillez vous connecté"});
    return next()
  }
  try {
    const data = JWT.verify(payload, process.env.JWT_KEY);
    req.user = data;
    // console.log(req.user)
    return next();
  } catch {
    console.log('token expiré')
    return next();
    // return res.status(403).json({SESSION_EXPIRE : "La session à expirée"});
  }
};

const verifieTokenJWT = (req, res, next) => {
  const payload = req.cookies?.access_token;
  if (!payload) {
    console.log('pas token')
    // return res.status(200).json({data: req.user}) ;
   return ;
    // return res.status(500).json( {SESSION_EXPIRE : "Veuillez vous connecté"});
  }
  try {
    const data = JWT.verify(payload, process.env.JWT_KEY);
    req.user = data;
    // console.log(req.user)
    // next()
    // return ;
    return res.status(200).json({data: req.user.payload}) ;
  } catch {
    console.log('pas token')
    return res.status(200).json({data: req.user}) ;
    // return res.status(403).json({SESSION_EXPIRE : "La session à expirée"});
  }
};


module.exports = { createToken, verifieToken, verifieTokenJWT };
