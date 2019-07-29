/**
 * Verifies user login info and returns JSON of user / error JSON
 * @param {Request} request
 * @param {Response} response
 * @param {Knex} knex - the knex connection
 * @param {checkHash} checkHash - the checkHash function
 * @param {userResponse} userResponse - the userResponse function
 */
const handleSignIn = (request, response, knex, checkHash, userResponse) => {
  let signInUser = {};
  knex
    .select("users.id", "name", "email", "entries", "joined", "hash")
    .from("users")
    .innerJoin("login", "users.id", "login.user_id")
    .where({ email: request.body.email })
    .then(userInfo => {
      signInUser = userInfo[0];
      if (!userInfo.length) {
        throw new Error("user not found");
      }
    })
    .then(() => checkHash(request.body.password, signInUser.hash))
    .then(() => response.json(userResponse(signInUser)))
    .catch(() => response.status(400).json({ status: false }));
};

module.exports = {
  handleSignIn
};
