/**
 * Queries the DB to return promise which resolves to JSON of users
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Knex} knex
 */
const handleUsers = (request, response, knex) =>
  knex
    .select("users.id", "name", "email", "entries", "joined", "hash")
    .from("users")
    .innerJoin("login", "users.id", "login.user_id")
    .then(userList => response.json(userList));

module.exports = {
  handleUsers
};
