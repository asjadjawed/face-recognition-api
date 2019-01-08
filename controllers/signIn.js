const handleSignIn = (request, response, knex, checkHash, userResponse) => {
  let signInUser = [];
  knex
    .select("users.id", "name", "email", "entries", "joined", "hash")
    .from("users")
    .innerJoin("login", "users.id", "login.user_id")
    .where({ email: request.body.email })
    .then(userInfo => {
      signInUser = userInfo;
      if (!userInfo.length) {
        throw new Error("user not found");
      }
    })
    .then(() => checkHash(request.body.password, signInUser[0].hash))
    .then(() => response.json(userResponse(signInUser[0])))
    .catch(() => response.status(400).json({ status: false }));
};

module.exports = {
  handleSignIn
};
