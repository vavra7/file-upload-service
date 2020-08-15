import { model, Schema } from 'mongoose';

const imageSchema = new Schema(
  {
    _id: {
      type: String
    },
    smth: {
      type: String
    }
  },
  { collection: 'image' }
);

export default model('Image', imageSchema);
