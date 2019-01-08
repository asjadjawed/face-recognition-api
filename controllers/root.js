const handleRoot = (request, response, knex) =>
  knex
    .select("users.id", "name", "email", "entries", "joined", "hash")
    .from("users")
    .innerJoin("login", "users.id", "login.user_id")
    .then(userList => response.json(userList));

module.exports = {
  handleRoot
};
