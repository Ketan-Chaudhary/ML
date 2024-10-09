const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// Route to handle image upload and prediction
app.post("/predict", upload.single("image"), (req, res) => {
  const imgPath = req.file.path;

  // Call Python script for prediction
  const python = spawn("python", ["predict.py", imgPath]);

  python.stdout.on("data", (data) => {
    res.send(`Predicted digit: ${data}`);
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send("Error during prediction");
  });

  python.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
