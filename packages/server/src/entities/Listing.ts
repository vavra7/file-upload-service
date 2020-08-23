import { Document, model, Schema } from 'mongoose';
import * as yup from 'yup';

export interface IListing extends Document {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ListingInput = Pick<IListing, 'title' | 'description'>;

export const listingInputSchema = yup.object().shape({
  title: yup.string().required().max(50),
  description: yup.string().nullable().max(500)
});

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  {
    collection: 'listing',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

export default model<IListing>('Listing', listingSchema);
