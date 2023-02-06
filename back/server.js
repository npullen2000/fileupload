import express from "express";
import cookieParser from "cookie-parser";
import { generateUploadURL } from "./s3.js";
import cors from "cors";
import path from "path";

const app = express();

const whitelist = ["http://127.0.0.1:8080", "https://upload.npullen.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.post("/s3Url", async (req, res) => {
  const url = await generateUploadURL(
    req.body.file_name,
    req.cookies.CF_Authorization
  );
  res.send({ url });
});

app.listen(8080, () => console.log("listening on port 8080"));
