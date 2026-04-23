import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("GET /exercises");

  res.send("GET /exercises");
});

export default router;
