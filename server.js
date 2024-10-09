const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });

// Route to handle image upload and prediction
app.post("/predict", upload.single("image"), (req, res) => {
  const imgPath = req.file.path;

  // Call Python script for prediction
  const python = spawn("python", ["predict.py", imgPath]);

  let predictionResult = "";

  // Capture data from Python's stdout
  python.stdout.on("data", (data) => {
    predictionResult += data.toString(); // Accumulate the result
  });

  // Capture errors from Python's stderr
  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send("Error during prediction"); // Send error response
  });

  // When Python script finishes execution
  python.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    if (!res.headersSent) {
      res.send(`Predicted digit: ${predictionResult}`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
