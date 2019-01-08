const bcrypt = require("bcrypt-nodejs");

const genHash = string =>
  new Promise((resolve, reject) => {
    bcrypt.hash(string, null, null, (error, result) =>
      error
        ? reject(error)
        : !string
        ? reject(new Error("null/undefined string argument"))
        : resolve(result)
    );
  });

const checkHash = (string, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(string, hash, (error, result) =>
      error
        ? reject(error)
        : !result
        ? reject(new Error(false))
        : resolve(result)
    );
  });

module.exports = {
  genHash,
  checkHash
};
