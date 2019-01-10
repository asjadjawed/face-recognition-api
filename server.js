const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { genHash, checkHash } = require("./bcryptPromises");
const { userResponse } = require("./userResponse");

const { handleRoot } = require("./controllers/root");
const { handleProfile } = require("./controllers/profile");
const { handleSignIn } = require("./controllers/signIn");
const { handleRegister } = require("./controllers/register");
const { handleImage } = require("./controllers/image");

const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "hunter2",
    database: "face-recognition"
  }
});

const app = express();

app.use((request, response, next) => {
  console.log(request.method, request.url, new Date().toTimeString());
  next();
});
app.use(bodyParser.json());
app.use(cors());

app.get("/", (request, response) => handleRoot(request, response, knex));

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

app.listen(5000, () => console.log("Server running on port 5000"));
