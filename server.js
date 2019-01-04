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
  user.length
    ? res.json(user)
    : res.status(400).json({ status: "User not found" });
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
