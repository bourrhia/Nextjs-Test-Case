const cartdropdown = async (req, res) => {
  const { initialPost } = req.body;

  res.json({ data: initialPost });
};

export default cartdropdown;
