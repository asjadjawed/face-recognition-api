// @ts-check
"use strict";

const bcrypt = require("bcrypt-nodejs");

/**
 * Hashes the string using bcrypt
 * @name genHash
 * @param {string} string the string to hash
 * @returns {Promise<string|Error>}
 */
const genHash = string =>
  new Promise((resolve, reject) => {
    // checking arguments
    if (typeof string !== "string") {
      reject(new Error("Invalid string argument"));
    }

    // hashing
    bcrypt.hash(string, null, null, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });

/**
 * Checks the hash against the string
 * @name checkHash
 * @param {string} string the string to check
 * @param {string} hash the hash value
 * @returns {Promise<boolean|Error>} promise resolves true on match / throws error if there is a mismatch
 */
const checkHash = (string, hash) =>
  new Promise((resolve, reject) => {
    // checking arguments
    if (typeof string !== "string" || typeof hash !== "string") {
      reject("Invalid string / hash argument");
    }

    // checking hash
    bcrypt.compare(string, hash, (error, result) => {
      if (error) {
        reject(error);
      }
      if (!result) {
        reject(new Error("string/hash mismatch!"));
      }
      resolve(result);
    });
  });

module.exports = {
  genHash,
  checkHash
};
