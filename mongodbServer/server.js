require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

console.log(process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

db.once("open", () => console.log("Connected to database"));

// Use all routes
const NoteRouter = require("./routes/notes");
app.use("/notes", NoteRouter);

const DiagnosticImageRouter = require("./routes/diagnosticImage");
app.use("/diagnosticImage", DiagnosticImageRouter);

const UserRouter = require("./routes/users");
app.use("/users", UserRouter);

const LabResultsRouter = require("./routes/labResults");
app.use("/labResults", LabResultsRouter);

const StaffCertificateRouter = require("./routes/staffCertificate");
app.use("/staffCertificates", StaffCertificateRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
