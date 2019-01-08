const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "4a1dcea0b8ee4974b20ffefea7bed5cd"
});

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
