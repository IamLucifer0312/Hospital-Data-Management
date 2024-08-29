require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

console.log(process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

db.once("open", () => console.log("Connected to database"));

const NoteRouter = require("./routes/notes");
app.use("/notes", NoteRouter);

const DiagnosticImageRouter = require("./routes/diagnosticImage");
app.use("/diagnosticImage", DiagnosticImageRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
