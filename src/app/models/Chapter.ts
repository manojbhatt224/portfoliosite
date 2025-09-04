import { Schema, model, models, Document, Types } from "mongoose";

export interface IChapter extends Document {
  subjectId: Types.ObjectId; // reference Subject
  name: string;
  driveLink: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>({
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  name: { type: String, required: true, trim: true },
  driveLink: {
    type: String,
    required: true,
    match: /^https?:\/\/(drive\.google\.com|docs\.google\.com)\/.+/i,
  },
  description: { type: String },
}, { timestamps: true });

// Ensure chapter names are unique within a subject
ChapterSchema.index({ subjectId: 1, name: 1 }, { unique: true });

export default models.Chapter || model<IChapter>("Chapter", ChapterSchema);