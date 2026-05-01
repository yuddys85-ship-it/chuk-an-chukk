import axios from "axios";

const PI_API_KEY = "YOUR_PI_API_KEY";

export default async function handler(req, res) {

  const { url, method } = req;

  // 🔥 APPROVE
  if (url.endsWith("/approve") && method === "POST") {
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

      return res.status(200).json(result.data);

    } catch (err) {
      return res.status(500).json({ error: "Approve gagal" });
    }
  }

  // 🔥 COMPLETE
  if (url.endsWith("/complete") && method === "POST") {
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

      return res.status(200).json(result.data);

    } catch (err) {
      return res.status(500).json({ error: "Complete gagal" });
    }
  }

  return res.status(404).json({ error: "Not found" });
}
