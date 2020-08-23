import { IListing, ListingInput } from '../entities/Listing';
import ListingManager from '../model/ListingManager';

class ListingHandler {
  static create(listingInput: ListingInput): Promise<IListing> {
    return ListingManager.create(listingInput);
  }

  static get(id: string): Promise<IListing | null> {
    return ListingManager.get(id);
  }
}

export default ListingHandler;
