const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { genHash, checkHash } = require("./bcryptPromises");
const { userResponse } = require("./userResponse");

const { handleUsers } = require("./controllers/users");
const { handleProfile } = require("./controllers/profile");
const { handleSignIn } = require("./controllers/signIn");
const { handleRegister } = require("./controllers/register");
const { handleImage } = require("./controllers/image");

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-107-20-183-142.compute-1.amazonaws.com",
    user: "tadbyhedseqsno",
    password:
      "4aec518a727e081cfd4b8aa2e645c81a693a2ec6f7fcb038fe09ca6772b577f6",
    database: "d3moqgm7oihtkv"
  }
});

const app = express();

app.use((request, response, next) => {
  console.log(request.method, request.url, new Date().toTimeString());
  next();
});
app.use(bodyParser.json());
app.use(cors());

app.get("/", (request, response) =>
  response.send(
    "<p>Face Recognition API</p><p>App Location: https://asjadjawed.github.io/face-recognition-app/</p>"
  )
);

app.get("/users", (request, response) => handleUsers(request, response, knex));

app.get("/profile/:id", (request, response) =>
  handleProfile(request, response, knex)
);

app.post("/signin", (request, response) =>
  handleSignIn(request, response, knex, checkHash, userResponse)
);

app.post("/register", (request, response) =>
  handleRegister(request, response, genHash, knex, userResponse)
);

app.put("/image", (request, response) =>
  handleImage(request, response, knex, userResponse)
);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
