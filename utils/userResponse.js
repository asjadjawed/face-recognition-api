/**
 * Maps info to new Object which it returns
 * @param {Object} userInfo
 */
const userResponse = ({ id, name, email, entries, joined }) => {
  return {
    id,
    name,
    email,
    entries,
    joined
  };
};

module.exports = {
  userResponse
};
