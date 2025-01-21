import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import routes from "./routes/users.js";
import mongoose from 'mongoose';

//const mongoose = require("mongoose");

const app = express();
const PORT=process.env.PORT;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your allowed origin
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((error) => console.error("Failed to connect to MongoDB: ", error));

app.use(bodyParser.json());

app.use("/users",routes)

app.listen(PORT, ()=>console.log("Server Running on", PORT));