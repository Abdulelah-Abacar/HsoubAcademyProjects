require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const http = require("http");

const port = process.env.SERVER_PORT;
const dbUrl = process.env.DATABASE_URL;

http.createServer(app);
app.set("trust proxy", true);

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

mongoose.connect(dbUrl);
const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(err));
dbConnection.once("open", () => console.log("Database connected"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const DataSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  audio: Buffer,
  title: String,
  status: String,
});

const Data = mongoose.model("Data", DataSchema);

app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    const data = new Data(req.body);
    await data.save();
    res.status(201).json({
      message: "Data created successfully",
      data: data, // إرجاع الكائن الذي تم تخزينه
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Data deleted successfully",
      deletedData: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BFYDSuGcl1ClTpTEV-XpyfBD2p01pwbVPnmloHytsCq9w9yMRlMhfRgdR7Gcjwi-_uic46LXs5p6wNzVFH_9Nwk",
  privateKey: "jwIeKP63YIeC00RLqznFBRbqJLwPiCazy8kCNJkEL_A",
};

webPush.setVapidDetails(
  "mailto:your-email@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  console.log("Subscription received:", subscription);
});

app.post("/sendnotification", (req, res) => {
  const notificationPayload = JSON.stringify({
    title: req.body.title,
    body: req.body.message,
  });

  Promise.all(
    subscriptions.map((subscription) =>
      webPush.sendNotification(subscription, notificationPayload)
    )
  )
    .then(() => res.status(200).json({ message: "Notification sent!" }))
    .catch((err) => {
      console.error("Error sending notification:", err);
      res.sendStatus(500);
    });
});
