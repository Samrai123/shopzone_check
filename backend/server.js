import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import logger from "./logger.js";
import expressWinston from "express-winston";
import session from "express-session";
dotenv.config();

mongoose
  .connect('mongodb://127.0.0.1:27017/shopzone')
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(session({
   // It holds the secret key for session
   secret: "I am girl",
 
   // Forces the session to be saved
   // back to the session store
   resave: true,

   // Forces a session that is "uninitialized"
   // to be saved to the store
   saveUninitialized: false,
   cookie: {

       // Session expires after 1 min of inactivity.
       expires: 60000
   }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressWinston.logger({
  winstonInstance: logger,
  
}))
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

app.use("/api/upload", uploadRouter,);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter,()=>{
  logger.log('info','this is user');
});
app.use("/api/orders", orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  logger.log('info',`serve at http://localhost:${port}`);
});
