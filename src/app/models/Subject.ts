import { Schema, model, models, Document, Types } from "mongoose";

export interface ISubject extends Document {
  classId: Types.ObjectId; // reference Class
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>({
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
}, { timestamps: true });

// Ensure subject names are unique within a class
SubjectSchema.index({ classId: 1, name: 1 }, { unique: true });

export default models.Subject || model<ISubject>("Subject", SubjectSchema);