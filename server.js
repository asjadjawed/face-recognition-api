const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");

const app = express();

app.use(bodyParser.json());

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
    bcrypt.compare(req.body.password, user[0].password, function(
      error,
      resolve
    ) {
      if (!error && resolve) {
        res.json({ status: "Signing In" });
      } else {
        res.status(400).json({ status: "Error Logging In" });
      }
    });
  }
});

app.post("/register", (req, res) => {
  req.body.user.joined = new Date();
  bcrypt.hash(req.body.user.password, null, null, function(err, hash) {
    if (!err) {
      req.body.user.password = hash;
      database.push(req.body.user);
      res.json(database[database.length - 1]);
    } else {
      res.status(400).json({ status: "Error Registering" });
    }
  });
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

app.listen(3000, () => console.log("Server running on port 3000"));
