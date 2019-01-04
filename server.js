const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const hash = string =>
  new Promise((res, rej) => {
    bcrypt.hash(string, null, null, (error, result) =>
      error ? rej(error) : res(result)
    );
  });

const checkHash = (string, hash) =>
  new Promise((res, rej) => {
    bcrypt.compare(string, hash, (error, result) =>
      error || !result ? rej(error) : res(result)
    );
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = [
  {
    id: "123",
    name: "John",
    email: "john@gmail.com",
    password: "$2a$10$/qThbK8nUDtZbJ2COrJCXesJWfgp8CmCRy93nW.KxMoQOgpOkR8cW", //cookies
    entries: 0,
    joined: new Date()
  },
  {
    id: "124",
    name: "Sally",
    email: "sally@gmail.com",
    password: "$2a$10$ijirY/VALOBJT6sT7ji3OeyVC71jGFF.8JpANyR70nqWmbQi5YB2S", //bananas
    entries: 0,
    joined: new Date()
  }
];

// New User
// {
//   "user": {
//       "id": "125",
//       "name": "Jim",
//       "email": "jim@gmail.com",
//       "password": "pizza",
//       "entries": 0
//   }
// }

app.get("/", (req, res) => res.json(database));

app.get("/profile/:id", (req, res) => {
  const user = database.filter(user => user.id === req.params.id);
  user.length
    ? res.json(user)
    : res.status(400).json({ status: "User not found" });
});

app.post("/signin", (req, res) => {
  const user = database.filter(user => user.id === req.body.id);
  if (!user.length) {
    res.status(400).json({ status: "Error Logging In" });
  } else {
    checkHash(req.body.password, user[0].password)
      .then(() => res.json({ status: "Signing In" }))
      .catch(() => res.json({ Status: "Error Logging In" }));
  }
});

app.post("/register", (req, res) => {
  req.body.user.joined = new Date();
  hash(req.body.user.password)
    .then(hash => {
      req.body.user.password = hash;
      database.push(req.body.user);
      res.json(database[database.length - 1]);
    })
    .catch(() => res.status(400).json({ status: "Error Registering User" }));
});

app.put("/image", (req, res) => {
  let found = false;
  for (const [i, user] of database.entries()) {
    if (user.id === req.body.id) {
      found = true;
      user.entries++;
      res.json(database[i]);
      break;
    }
  }
  if (!found) {
    res.status(400).json({ status: "User not found" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
