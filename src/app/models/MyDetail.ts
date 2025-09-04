import mongoose, { Schema, Document, models } from "mongoose";

export interface IMydetail extends Document {
  cvLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  email?: string;
  contactNumber?: string;
  facebookLink?: string;
  instagramLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MydetailSchema = new Schema<IMydetail>(
  {
    cvLink: { type: String, default: "" },
    youtubeLink: { type: String, default: "" },
    linkedinLink: { type: String, default: "" },
    facebookLink: { type: String, default: "" },
    githubLink: { type: String, default: "" },
    email: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    instagramLink: { type: String, default: "" }
  },
  { timestamps: true }
);

export default models.Mydetail || mongoose.model<IMydetail>("Mydetail", MydetailSchema);
