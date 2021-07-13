const { json } = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/dist/quiz-trivia"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/quiz-trivia/index.html"));
});

app.listen(PORT);
