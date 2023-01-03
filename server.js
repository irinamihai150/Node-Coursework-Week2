const moment = require("moment");
moment("12-25-1995", "MM-DD-YYYY");

const { v4: uuidv4 } = require("uuid");
const express = require("express");
const cors = require("cors");
const { request } = require("express");

const app = express();
app.use(express.json());
app.use(cors());

const welcomeMessage = {
  id: "0",
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.post("/messages", (req, res) => {
  //validate our input
  if (!req.body.from || !req.body.text) {
    res.status(400).send("from must be valid");
    return;
  }

  // build our new resourse
  const newMessage = {
    // id: 3,
    from: req.body.from,
    text: req.body.text,
    timestamp: moment(),
  };
  // const newMessage = req.body;
  newMessage.id = uuidv4();
  messages.push(newMessage);
  res.status(201).json(newMessage);
});
app.get("/messages", (req, res) => {
  res.json(messages);
});

app.get("/messages/:id", (req, res) => {
  const id = req.params.id;
  const msg = messages.find((message) => message.id === id);
  if (msg === undefined) {
    res.send("message not found");
  }

  res.send(msg);
});

app.delete("/messages/:id", (req, res) => {
  const msg = messages.find((message) => message.id === id);
  if (msg === undefined) {
    res.status(404).send("message not found");
  }
  const messageIndex = messages.findIndex((m) => m.id === id);
  messages.splice(messageIndex, 1);

  res.send("message deleted");
});

app.get("/search", (req, res) => {
  if (req.query.text) {
    let search = req.query.text;
    let matched = messages.filter((message) => message.text.includes(search));
    res.send(matched);
  } else {
    res.send("Not found");
  }
}),
  app.get("/latest", (req, res) => {
    let latestMessage = messages.filter((message) => {
      return parseInt(message.id) > messages.length - 11;
    });
    res.status(201).json(latestMessage);
  });
app.put("/messages:id", (req, res) => {
  if (!req.query.text || !req.query.from) {
    res.status(400).send("from and text are required");
  }
  //check message exist
  let messageId = parseInt(req.params.id);
  let messageIndex = messages.find((m) => m.id === messageId);
  if (messageIndex < 0) {
    res.sendStatus(404);
  }
  let updatedMessage = {
    id: messageId,
    from: req.body.from,
    text: req.body.text,
  };
});

const port = 3131;

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
// app.listen(process.env.PORT);
