const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
  // apiKey: require("../temp").key
});

/**
 * Receives user info and image in request, returns facials coordinates
 * and increments user entry else sends fail response *
 * @param {Request} request
 * @param {Response} response
 * @param {Knex} knex - knex connection
 * @param {Function} userResponse - the user mapping function
 */
const handleImage = (request, response, knex, userResponse) => {
  const { id, input } = request.body;
  let boxes = [];
  const returnedUser = {};
  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", input)
    .then(res => {
      if (res.outputs[0].data.regions) {
        boxes = res.outputs[0].data.regions.map(
          box => box.region_info.bounding_box
        );
      } else {
        throw new Error("Face not found");
      }
    })
    .then(() =>
      knex("users")
        .where({ id: Number(id) })
        .increment("entries", 1)
        .returning("*")
        .then(updatedUser => {
          Object.assign(returnedUser, updatedUser[0]);

          response.json({ user: userResponse(returnedUser), boxes });
        })
    )
    .catch(error => response.json({ status: error, boxes }));
};

module.exports = {
  handleImage
};
