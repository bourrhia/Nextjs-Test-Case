import Cors from "cors";

const cors = Cors({
  origin: "https://your-vercel-app.vercel.app", // Replace with your Vercel app's domain
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
});

export default cors;
