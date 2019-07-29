/**
 * Stores new user in database
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Function} genHash - the genHash Function: generates new hash
 * @param {Knex} knex - the Knex connection
 * @param {Function} userResponse - the userResponse function
 */
const handleRegister = (request, response, genHash, knex, userResponse) => {
  let returnedUser = {};
  genHash(request.body.user.password)
    .then(hashedPass => Object.assign(returnedUser, { password: hashedPass }))
    .then(() =>
      knex("users")
        .returning("*") // returns the inserted record
        .insert({
          name: request.body.user.name,
          email: request.body.user.email,
          joined: new Date()
        })
    )
    .then(registeredUser => {
      Object.assign(returnedUser, registeredUser[0]);
    })
    .then(() =>
      knex("login").insert({
        user_id: returnedUser.id,
        hash: returnedUser.password
      })
    )
    .then(() => response.json(userResponse(returnedUser)))
    .catch(() => response.status(400).json({ status: false }));
};

module.exports = {
  handleRegister
};
