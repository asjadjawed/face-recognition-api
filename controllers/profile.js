/**
 * Returns data on specific user return Promise resolves to JSON data of user / error
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Knex} knex - the knex connection
 */
const handleProfile = (request, response, knex) => {
  knex("users")
    .select()
    .where({ id: Number(request.params.id) })
    .then(user => {
      user.length
        ? response.json(user[0])
        : response.status(400).json({ status: "No user profile" });
    })
    .catch(() =>
      response.status(400).json({ status: "Error fetching profile" })
    );
};

module.exports = {
  handleProfile
};
