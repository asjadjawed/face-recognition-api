const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const genHash = string =>
  new Promise((resolve, reject) => {
    bcrypt.hash(string, null, null, (error, result) =>
      error
        ? reject(error)
        : !string
        ? reject(new Error("null/undefined string argument"))
        : resolve(result)
    );
  });

const checkHash = (string, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(string, hash, (error, result) =>
      error
        ? reject(error)
        : !result
        ? reject(new Error(false))
        : resolve(result)
    );
  });

const database = [
  {
    id: 123,
    name: "John",
    email: "john@gmail.com",
    password: "$2a$10$/qThbK8nUDtZbJ2COrJCXesJWfgp8CmCRy93nW.KxMoQOgpOkR8cW", //cookies
    entries: 3,
    joined: new Date()
  },
  {
    id: 124,
    name: "Sally",
    email: "sally@gmail.com",
    password: "$2a$10$ijirY/VALOBJT6sT7ji3OeyVC71jGFF.8JpANyR70nqWmbQi5YB2S", //bananas
    entries: 3,
    joined: new Date()
  }
];

const app = express();

app.use((request, response, next) => {
  console.log(request.method, request.url, new Date().toTimeString());
  next();
});
app.use(bodyParser.json());
app.use(cors());

app.get("/", (request, response) => response.json(database));

app.get("/profile/:id", (request, response) => {
  const user = database.filter(user => user.id === Number(request.params.id));
  user.length
    ? response.json(user[0])
    : response.status(400).json({ status: "No user profile" });
});

app.post("/signin", (request, response) => {
  const user = database.filter(user => user.email === request.body.email);
  if (!user.length) {
    response.json({ status: false });
  } else {
    checkHash(request.body.password, user[0].password)
      .then(() =>
        response.json({
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          entries: user[0].entries,
          joined: user[0].joined
        })
      )
      .catch(() => response.json({ status: false }));
  }
});

app.post("/register", (request, response) => {
  request.body.user.joined = new Date();
  genHash(request.body.user.password)
    .then(hash => {
      request.body.user.password = hash;
      database.push(request.body.user);
      response.json({
        id: database[database.length - 1].id,
        name: database[database.length - 1].name,
        email: database[database.length - 1].email,
        entries: database[database.length - 1].entries,
        joined: database[database.length - 1].joined
      });
    })
    .catch(() => response.status(400).json({ status: false }));
});

app.put("/image", (request, response) => {
  let found = false;
  for (const [i, user] of database.entries()) {
    if (user.id === request.body.id) {
      found = true;
      user.entries++;
      response.json({
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
    response.status(400).json({ status: "User not found" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
