const express = require("express");
const circuitBreaker = require("./circuit-breaker");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

// Routes
app.get("/my-shipment", async (req, res) => {
  try {

    const circuit = await circuitBreaker.makeRequest({ url: `http://${process.env.SHIPPING_SERVICE}/shipment` });
    res.send(circuit);

  } catch (error) {
    console.log(error);
    res.status(400).send('invalid request');

  }

});

const server = app.listen(port, () => {
  console.log(`Gateway server is listening on ${server.address().port}`);
});
