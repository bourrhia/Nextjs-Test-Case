/*const countHandler: NextApiHandler = async (request, response) => {
    const { amount = 1 } = request.body
  
    // simulate IO latency
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    response.json({ data: amount })
  }
  
  export default countHandler*/

const cartspinner = async (req, res) => {
  const { initialPost } = req.body;
  // simulate IO latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  res.json({ data: initialPost });
};

export default cartspinner;
