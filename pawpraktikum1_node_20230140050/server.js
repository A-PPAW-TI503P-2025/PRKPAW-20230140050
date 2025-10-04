const express = require("express");
const cors = require("cors"); // Tambahkan baris ini
const app = express();
const port = 5000;

// Gunakan middleware cors
app.use(cors()); // Tambahkan baris ini

// Endpoint ini akan diakses oleh React
app.get("/", (req, res) => {
  res.json({ message: "Hello from Node.js Server!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
