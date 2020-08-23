import Listing, { IListing, ListingInput } from '../entities/Listing';

class ListingManager {
  static create(listingInput: ListingInput): Promise<IListing> {
    return new Listing(listingInput).save();
  }

  static get(id: IListing['_id']): Promise<IListing | null> {
    return new Promise<IListing | null>((resolve, rejects) => {
      Listing.findById(id, (err, res) => {
        if (err) rejects(err);
        else resolve(res);
      });
    });
  }
}

export default ListingManager;
