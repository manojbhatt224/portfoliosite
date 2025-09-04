import { Schema, model, models, Document, Types } from "mongoose";

export interface IClass extends Document {
  title: Types.ObjectId; // reference Title
  name: string; // e.g., Semester 1, Grade 8
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>({
  title: { type: Schema.Types.ObjectId, ref: "Title", required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
}, { timestamps: true });

// Ensure class names are unique within a title
ClassSchema.index({ title: 1, name: 1 }, { unique: true });

export default models.Class || model<IClass>("Class", ClassSchema);