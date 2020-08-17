import { Document, model, Schema } from 'mongoose';
import * as yup from 'yup';

export interface IListing extends Document {
  title: string;
  description?: string;
  createdAt: Date;
}

export interface IListingInput {
  title: IListing['title'];
  description: IListing['description'];
}

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
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'listing' }
);

export default model<IListing>('Listing', listingSchema);
