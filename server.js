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

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(bodyParser.json());
app.use(cors());

const database = [
  {
    id: "123",
    name: "John",
    email: "john@gmail.com",
    password: "$2a$10$/qThbK8nUDtZbJ2COrJCXesJWfgp8CmCRy93nW.KxMoQOgpOkR8cW", //cookies
    entries: 3,
    joined: new Date()
  },
  {
    id: "124",
    name: "Sally",
    email: "sally@gmail.com",
    password: "$2a$10$ijirY/VALOBJT6sT7ji3OeyVC71jGFF.8JpANyR70nqWmbQi5YB2S", //bananas
    entries: 3,
    joined: new Date()
  }
];

app.get("/", (req, res) => res.json(database));

app.get("/profile/:id", (req, res) => {
  const user = database.filter(user => user.id === req.params.id);
  user.length
    ? res.json(user)
    : res.status(400).json({ status: "User not found" });
});

app.post("/signin", (req, res) => {
  const user = database.filter(user => user.email === req.body.email);
  if (!user.length) {
    res.json({ status: false });
  } else {
    checkHash(req.body.password, user[0].password)
      .then(() =>
        res.json({
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          entries: user[0].entries,
          joined: user[0].joined
        })
      )
      .catch(() => res.json({ status: false }));
  }
});

app.post("/register", (req, res) => {
  req.body.user.joined = new Date();
  hash(req.body.user.password)
    .then(hash => {
      req.body.user.password = hash;
      database.push(req.body.user);
      res.json({
        id: database[database.length - 1].id,
        name: database[database.length - 1].name,
        email: database[database.length - 1].email,
        entries: database[database.length - 1].entries,
        joined: database[database.length - 1].joined
      });
    })
    .catch(() => res.status(400).json({ status: false }));
});

app.put("/image", (req, res) => {
  let found = false;
  for (const [i, user] of database.entries()) {
    if (user.id === req.body.id) {
      found = true;
      user.entries++;
      res.json({
        id: database[i].id,
        name: database[i].name,
        email: database[i].email,
        entries: database[i].entries,
        joined: database[i].joined
      });
      break;
    }
  }
  if (!found) {
    res.status(400).json({ status: "User not found" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
