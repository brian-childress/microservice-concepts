const express = require("express");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

// Routes
app.get("/shipment", (req, res) => {

  // res.send({ message: "sample shipping response" });
  res.send("sample shipping response");

});

const server = app.listen(port, () => {
  console.log(`Shipping server is listening on ${server.address().port}`);
});
