import { Controller } from '.';
import Listing, { IListingInput } from '../model/Listing';

export const getListing: Controller = async (req, res, next) => {
  let article;

  try {
    article = await Listing.findById(req.params.id);
  } catch (err) {
    next(err);

    return;
  }

  res.json(article);
};

export const createListing: Controller = async (req, res, next) => {
  const listing = new Listing({
    title: req.body.title,
    description: req.body.description
  } as IListingInput);

  try {
    await listing.save();
  } catch (err) {
    next(err);

    return;
  }

  res.json(listing);
};
