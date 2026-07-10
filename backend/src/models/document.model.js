import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  recipients: [
    {
      email: String,
      recipientName: String,
      status: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const DocumentModel = mongoose.model("Document", documentSchema);

export default DocumentModel;
