// server/src/index.ts
import express from "express";
import cors from "cors";
import { router as palabras } from "./routes/palabras";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = parseInt(process.env.PORT!);

app.use(cors());
app.use(express.json());
app.use("/palabras", palabras);

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
