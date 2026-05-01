import axios from "axios";

const PI_API_KEY = "YOUR_PI_API_KEY";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    res.status(200).json(result.data);

  } catch (err) {
    res.status(500).json({ error: "Approve gagal" });
  }
}
