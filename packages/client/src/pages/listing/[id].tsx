import axios from 'axios';
import { NextPage } from 'next';

const Listing: NextPage = props => {
  const {
    listing: { title, description }
  } = props as any;

  return (
    <>
      <h1>{title}</h1>

      <p>{description}</p>

      <pre>{JSON.stringify(props, null, 4)}</pre>
    </>
  );
};

Listing.getInitialProps = async context => {
  const { data } = await axios({
    url: `http://localhost:4000/listing/${context.query.id}`
  });

  return {
    listing: data
  };
};

export default Listing;
