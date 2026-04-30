export default async function handler(req, res) {
  const { method } = req;

  // TEST GET
  if (method === "GET") {
    return res.status(200).json({
      message: "Backend siap untuk Pi Payment 🚀"
    });
  }

  // APPROVE
  if (req.url.includes("approve")) {
    const { paymentId } = req.body;

    console.log("APPROVE:", paymentId);

    return res.status(200).json({
      success: true,
      action: "approved",
      paymentId
    });
  }

  // COMPLETE
  if (req.url.includes("complete")) {
    const { paymentId } = req.body;

    console.log("COMPLETE:", paymentId);

    return res.status(200).json({
      success: true,
      action: "completed",
      paymentId
    });
  }

  return res.status(404).json({ error: "Not found" });
}
