const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // Step 1: Personal Info
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  country: { type: String, required: true },

  // Step 2: Incident Overview
  incidentDate: { type: Date, required: true },
  platform: { type: String, required: true },
  cryptoType: { type: String, required: true },
  lossSummary: { type: String, required: true },

  // Step 3: Transaction Details
  yourWallet: { type: String, required: true },
  network: { type: String, required: true },
  txids: { type: String }, // optional

  // Step 4: Scam Mechanism
  scamDescription: { type: String, required: true },
  fakeSite: { type: Boolean, default: false },
  socialEng: { type: Boolean, default: false },

  // Step 5: Evidence Uploads
  evidenceFiles: { type: String }, // file path, optional
  blockchainStmt: { type: String }, // file path, optional
  sharedLink: { type: String },

  // Step 6: Attempts & Reporting
  reportedLaw: { type: Boolean, default: false },
  contactedExchange: { type: Boolean, default: false },
  fileComplaint: { type: Boolean, default: false },
  caseNumber: { type: String },

  // Step 7: Additional Info & Consent
  additionalInfo: { type: String },
  consent: { type: Boolean, required: true },

  // Step 8: Payment
  paymentReceipt: { type: String, required: true }, // file path
  paymentTxid: { type: String, required: true },

  // Individuals Involved
  individuals: [
    {
      name: { type: String, required: true },
      wallet: { type: String, required: true },
      network: { type: String, required: true },
      amount: { type: Number, required: true },
      txid: { type: String, required: true }, // <-- add this line
    },
  ],

  // Timestamp
  date: { type: Date, default: Date.now },

  // Optional Fields
  totalUsdt: { type: Number }, // optional, but recommended
  evidenceAgreement: { type: Boolean, required: true },
});

module.exports = mongoose.model("Message", messageSchema);
