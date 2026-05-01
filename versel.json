const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PI_API_KEY = "YOUR_PI_API_KEY";

app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        }
      }
    );

    res.json(result.data);

  } catch (err) {
    res.status(500).json({ error: "Approve gagal" });
  }
});

app.post("/complete", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        }
      }
    );

    res.json(result.data);

  } catch (err) {
    res.status(500).json({ error: "Complete gagal" });
  }
});

app.listen(3001, () => {
  console.log("Backend running");
});
