import axios from "axios";

const PI_API_KEY = process.env.PI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  if (!PI_API_KEY) {
    return res.status(500).json({
      error: "PI_API_KEY belum dikonfigurasi"
    });
  }

  const { paymentId, txid } = req.body || {};

  if (!paymentId || !txid) {
    return res.status(400).json({
      error: "paymentId dan txid wajib diisi"
    });
  }

  try {
    const result = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        txid
      },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json(result.data);

  } catch (err) {
    console.error(
      "Pi Complete Error:",
      err.response?.data || err.message
    );

    return res.status(
      err.response?.status || 500
    ).json({
      error: "Complete pembayaran gagal"
    });
  }
}
