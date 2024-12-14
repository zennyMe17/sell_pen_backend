const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, "h!32@J#3aI9$%jKlQ^Z*2PaX&v^Mn3X", {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
