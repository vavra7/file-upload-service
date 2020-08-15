import { Document, model, Schema } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  createdAt: Date;
}

export interface IListingInput {
  title: IListing['title'];
  description: IListing['description'];
}

const listingSchema = new Schema({
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
});

export default model<IListing>('Listing', listingSchema);
