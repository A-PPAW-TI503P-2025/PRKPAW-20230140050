const express = require("express");
const router = express.Router();

// Data sementara menggunakan array
let books = [
  { id: 1, title: "Book 1", author: "Author 1" },
  { id: 2, title: "Book 2", author: "Author 2" },
  { id: 3, title: "Book 3", author: "Author 3" },
  { id: 4, title: "Book 4", author: "Author 4" },
  { id: 5, title: "Book 5", author: "Author 5" },
];

// Variabel untuk melacak ID terakhir agar tidak duplikat
let currentId = 5;

// ## 🟢 READ: Mendapatkan semua buku
router.get("/", (req, res) => {
  res.json(books);
});

// ## 🟢 READ: Mendapatkan buku berdasarkan ID
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" }); // Pesan error JSON
  res.json(book);
});

// ## 🟢 CREATE: Menambahkan buku baru
router.post("/", (req, res) => {
  const { title, author } = req.body;
  // Validasi input [cite: 143]
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  currentId += 1; // Increment ID terakhir
  const book = {
    id: currentId,
    title,
    author,
  };
  books.push(book);
  res.status(201).json(book);
});

// ## 🟡 UPDATE: Memperbarui buku berdasarkan ID (BARU)
router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { title, author } = req.body;
  // Validasi input [cite: 143]
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  book.title = title;
  book.author = author;
  res.json(book);
});

// ## 🔴 DELETE: Menghapus buku berdasarkan ID (BARU)
router.delete("/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1)
    return res.status(404).json({ message: "Book not found" });

  books.splice(bookIndex, 1);
  res.status(204).send(); // 204 No Content, menandakan berhasil tanpa mengirim body
});

module.exports = router;
