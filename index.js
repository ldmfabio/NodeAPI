const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('./swagger/swagger_output.json');

const server = express();
const router = express.Router();

const fs = require("fs");

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
server.use(express.json({ extended: true }));
server.use(bodyParser.urlencoded({ extended: false }));

const readFile = () => {
  const content = fs.readFileSync("./data/items.json", "utf-8");
  return JSON.parse(content);
};

const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync("./data/items.json", updateFile, "utf-8");
};

router.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});
router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  const currentContent = readFile();
  const id = currentContent.length + 1;
  currentContent.push({ id, name, email, phone });
  writeFile(currentContent);
  res.send(currentContent);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const { name, email, phone } = req.body;

  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id == id);
  const {
    id: cId,
    name: cName,
    email: cEmail,
    phone: cPhone,
  } = currentContent[selectedItem];

  const newObject = {
    id: cId,
    name: name ? name : cName,
    email: email ? email : cEmail,
    phone: phone ? phone : cPhone,
  };

  currentContent[selectedItem] = newObject;
  writeFile(currentContent);
  res.send(newObject);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);
  currentContent.splice(selectedItem, 1);
  writeFile(currentContent);
  res.send(currentContent);
});

server.use(router);

server.listen(3000, () => console.log("Server is running on port 3000"));
