const userResponse = userInfo => {
  return {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    entries: userInfo.entries,
    joined: userInfo.joined
  };
};

module.exports = {
  userResponse
};
