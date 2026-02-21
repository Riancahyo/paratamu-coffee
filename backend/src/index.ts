import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "*", methods: ["GET","POST","PUT","PATCH","DELETE"] }));
app.use(express.json());

app.use("/api", routes);

app.get("/", (_req, res) => res.json({ message: "Paratamu Coffee API" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));