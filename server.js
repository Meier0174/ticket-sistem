import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use("/", emailRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});