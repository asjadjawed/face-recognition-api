const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { genHash, checkHash } = require("./bcryptPromises");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "sqpants77",
    database: "face-recognition"
  }
});

const userResponse = userInfo => {
  return {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    entries: userInfo.entries,
    joined: userInfo.joined
  };
};

const app = express();

app.use((request, response, next) => {
  console.log(request.method, request.url, new Date().toTimeString());
  next();
});
app.use(bodyParser.json());
app.use(cors());

app.get("/", (request, response) =>
  knex
    .select("users.id", "name", "email", "entries", "joined", "hash")
    .from("users")
    .innerJoin("login", "users.id", "login.user_id")
    .then(userList => response.json(userList))
);

app.get("/profile/:id", (request, response) => {
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
});

app.post("/signin", (request, response) => {
  let signInUser = [];
  knex
    .select("users.id", "name", "email", "entries", "joined", "hash")
    .from("users")
    .innerJoin("login", "users.id", "login.user_id")
    .where({ email: request.body.email })
    .then(userInfo => {
      signInUser = userInfo;
      if (!userInfo.length) {
        throw new Error("user not found");
      }
    })
    .then(() => checkHash(request.body.password, signInUser[0].hash))
    .then(() => response.json(userResponse(signInUser[0])))
    .catch(() => response.status(400).json({ status: false }));
});

app.post("/register", (request, response) => {
  let returnedUser = {};
  genHash(request.body.user.password)
    .then(hashedPass => Object.assign(returnedUser, { password: hashedPass }))
    .then(() =>
      knex("users")
        .returning("*")
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
});

app.put("/image", (request, response) => {
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
});

app.listen(5000, () => console.log("Server running on port 5000"));
