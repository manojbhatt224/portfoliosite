import { Schema, model, models, Document } from "mongoose";

export interface ITitle extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TitleSchema = new Schema<ITitle>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default models.Title || model<ITitle>("Title", TitleSchema);