import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express, { json } from "express";
import cors from "cors";

import { db } from "./config/firebase-config.js";
const PORT = 3000;

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://google-ai-hackathon.onrender.com",
    ],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/api/user/map/:id", async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection("roadMapList");

  const query = await docRef.get();
  let userMaps = [];
  query.docs.map((doc) => {
    const data = doc.data();
    if (data.uid === id) {
      userMaps.push(data);
    }
  });
  return res.json({ data: userMaps });
});

app.get("/api/user/getMap/:id", async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection("roadMaps");

  const query = await docRef.get();
  let userMaps = [];
  query.docs.map((doc) => {
    const data = doc.data();
    if (data.uid === id) {
      userMaps.push({
        ...data,
        nodesMap: JSON.parse(data.nodesMap),
      });
    }
  });
  return res.json({ data: userMaps });
});

app.post("/api/user/createMap", async (req, res) => {
  const { copiedObj } = req.body;

  const docRef = db.collection("roadMaps");

  const query = await docRef.where("_id", "==", copiedObj._id).get();

  if (query.empty) {
    await docRef.add({ ...copiedObj });
    return res.json({ success: true, message: "Created", data: copiedObj });
  }

  const docToUpdate = query.docs.find(
    (doc) => doc.data()._id === copiedObj._id
  );

  if (docToUpdate) {
    await docRef.doc(docToUpdate.id).update({ ...copiedObj });
    return res.json({ success: true, message: "Updated", data: copiedObj });
  }

  return res
    .status(404)
    .json({ success: false, message: "Document not found" });
});

app.post("/api/user/roadmaps", async (req, res) => {
  const { copiedObj } = req.body;
  const allMaps = [];

  const item = copiedObj[0];
  const docRef = db.collection("roadMapList");
  const query = await docRef.where("uid", "==", item.uid).get();

  if (query.empty) {
    copiedObj.forEach(async (card) => {
      await docRef.add(card);
    });

    return res.status(200).json({ maps: [...copiedObj] });
  }

  return res
    .status(404)
    .json({ success: false, message: "Document not found" });
});

app.post("/api/user/roadmaps/:id", async (req, res) => {
  const { copiedObj } = req.body;
  const { id } = req.params;
  const cardItem = copiedObj.find((card) => card._id === id);

  const docRef = db.collection("roadMapList");
  const query = await docRef.where("uid", "==", cardItem.uid).get();
  const foundCard = copiedObj.find((card) => card._id === id);

  const docToUpdate = await query.docs.find(
    (doc) => doc.data()._id === foundCard._id
  );

  if (docToUpdate) {
    await docRef.doc(docToUpdate.id).update(foundCard);

    return res.json({ success: true, message: "Updated", data: foundCard });
  }
  return res.json({ name: "hello" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
