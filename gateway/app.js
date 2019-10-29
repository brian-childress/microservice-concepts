const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

// Routes
app.get("/my-shipment", async (req, res) => {
  try {

    const response = await fetch(`http://${process.env.SHIPPING_SERVICE}/shipment`);
    const json = await response.json();
    res.send(json);

  } catch (error) {

    res.send(error);

  }

});

const server = app.listen(port, () => {
  console.log(`Gateway server is listening on ${server.address().port}`);
});
