import Listing, { IListing, IListingInput } from '../model/Listing';

export async function getListing(id: IListing['_id']): Promise<IListing | null> {
  return await Listing.findById(id);
}

export async function createListing(listingInput: IListingInput): Promise<IListing> {
  return new Listing(listingInput).save();
}
