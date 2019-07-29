const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { genHash, checkHash } = require("./utils/bcryptPromises");
const { userResponse } = require("./utils/userResponse");

const { handleUsers } = require("./controllers/users");
const { handleProfile } = require("./controllers/profile");
const { handleSignIn } = require("./controllers/signIn");
const { handleRegister } = require("./controllers/register");
const { handleImage } = require("./controllers/image");

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL
  // connection: require("./temp").db
});

const app = express();

// middle-ware to log to console
app.use((request, response, next) => {
  console.log(request.method, request.url, new Date().toTimeString());
  next();
});

app.use(bodyParser.json());
app.use(cors());

// Default page
app.get("/", (request, response) =>
  response.send(
    "<p>Face Recognition API</p><p>App Location: https://asjadjawed.github.io/face-recognition-app/</p>"
  )
);

// Get all users
app.get("/users", (request, response) => handleUsers(request, response, knex));

// Get specific user
app.get("/profile/:id", (request, response) =>
  handleProfile(request, response, knex)
);

// Signin post request
app.post("/signin", (request, response) =>
  handleSignIn(request, response, knex, checkHash, userResponse)
);

// register new user
app.post("/register", (request, response) =>
  handleRegister(request, response, genHash, knex, userResponse)
);

// does the face recognition
app.put("/image", (request, response) =>
  handleImage(request, response, knex, userResponse)
);

// start the server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
