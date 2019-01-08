const handleImage = (request, response, knex, userResponse) => {
  const { id } = request.body;
  const returnedUser = {};
  knex("users")
    .where({ id: Number(id) })
    .increment("entries", 1)
    .returning("*")
    .then(updatedUser => {
      Object.assign(returnedUser, updatedUser[0]);
      response.json(userResponse(returnedUser));
    })
    .catch(() => response.status(400).json({ status: "Error updating entry" }));
};

module.exports = {
  handleImage
};
