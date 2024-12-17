const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, "h!32@J#3aI9$%jKlQ^Z*2PaX&v^Mn3X", {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
