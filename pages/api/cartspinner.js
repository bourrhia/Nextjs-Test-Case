const cartspinner = async (req, res) => {
  const { initialPost } = req.body;
  // simulate IO latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  res.json({ data: initialPost });
};

export default cartspinner;
