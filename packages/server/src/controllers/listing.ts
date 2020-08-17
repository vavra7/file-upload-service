import Listing, { IListing, IListingInput } from '../model/Listing';

export default {
  getListing: async function (id: IListing['_id']): Promise<IListing | null> {
    return await Listing.findById(id);
  },
  createListing: async function (listingInput: IListingInput): Promise<IListing> {
    return new Listing(listingInput).save();
  }
};
