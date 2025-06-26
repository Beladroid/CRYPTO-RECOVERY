const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Message = require("./models/Message");

dotenv.config();

const app = express();

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// ✅ File upload config
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Route handler with complete validation and parsing
app.post(
  "/api/recover",
  upload.fields([
    { name: "evidenceFiles", maxCount: 1 },
    { name: "blockchainStmt", maxCount: 1 },
    { name: "paymentReceipt", maxCount: 1 }, // Add this line
  ]),
  async (req, res) => {
    try {
      const parseBool = (val) => val === "true" || val === "on";

      const formData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || "",
        country: req.body.country,
        incidentDate: req.body.incidentDate,
        platform: req.body.platform,
        cryptoType: req.body.cryptoType,
        lossSummary: req.body.lossSummary,
        yourWallet: req.body.yourWallet,
        network: req.body.network,
        txids: req.body.txids || "",
        scamDescription: req.body.scamDescription,
        fakeSite: parseBool(req.body.fakeSite),
        socialEng: parseBool(req.body.socialEng),
        evidenceFiles: req.files["evidenceFiles"]?.[0]?.path || "",
        blockchainStmt: req.files["blockchainStmt"]?.[0]?.path || "",
        sharedLink: req.body.sharedLink || "",
        reportedLaw: parseBool(req.body.reportedLaw),
        contactedExchange: parseBool(req.body.contactedExchange),
        fileComplaint: parseBool(req.body.fileComplaint),
        caseNumber: req.body.caseNumber || "",
        additionalInfo: req.body.additionalInfo || "",
        consent: parseBool(req.body.consent),
        paymentReceipt: req.files["paymentReceipt"]?.[0]?.path || "",
        paymentTxid: req.body.paymentTxid || "",
        individuals: req.body.individuals || [],
        totalUsdt: req.body.totalUsdt,
        evidenceAgreement: parseBool(req.body.evidenceAgreement),
      };

      const message = new Message(formData);
      await message.save();

      res.status(200).json({ message: "✅ Incident report received." });
    } catch (err) {
      console.error("❌ Save error:", err.message);
      res
        .status(400)
        .json({ error: "Failed to save report.", details: err.message });
    }
  }
);

// Dev route to serve uploaded files (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
