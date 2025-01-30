const express = require("express");
const mongoose = require("mongoose");
const URL = require("./models/url");
const path = require("path");
const urlRoute = require("./routes/url"); // router
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly,checkAuth } = require("./middleware/auth");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("error :" + err));

const app = express();
const PORT = 8001;

// seting up ejs - embeded javascript tempelating
app.set("view engine", "ejs");
//giving path to express for ejs
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// url is the base route ,and all the other routes will work after it
app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth,staticRoute);

// redirection logic and updating anlytics
app.get("/url/:shortid", async (req, res) => {
  const shortID = req.params.shortid;

  const entry = await URL.findOneAndUpdate(
    {
      shortId: shortID,
    },
    {
      $push: { visitHistory: { timestamp: Date.now() } },
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at port :${PORT}`));
