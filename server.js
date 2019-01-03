const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const database = [
  {
    id: "123",
    name: "John",
    email: "john@gmail.com",
    password: "cookies",
    entries: 0,
    joined: new Date()
  },
  {
    id: "124",
    name: "Sally",
    email: "sally@gmail.com",
    password: "bananas",
    entries: 0,
    joined: new Date()
  }
];

app.get("/", (req, res) => res.json(database));

app.get("/profile/:id", (req, res) => {
  const user = database.filter(user => user.id === req.params.id);
  user.length ? res.send(user) : res.status(400).send(user);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database[0].email &&
    req.body.password === database[0].password
  ) {
    res.json({ status: "Signing In" });
  } else {
    res.status(400).json({ status: "Error Logging In" });
  }
});

app.post("/register", (req, res) => {
  req.body.user.joined = new Date();
  database.push(req.body.user);
  res.json(database[database.length - 1]);
});

app.put("/image", (req, res) => {
  const user = database.filter(user => user.id === req.body.id);
  if (user.length) {
    user[0].entries++;
    res.send(user);
  } else {
    res.status(400).send(user);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
