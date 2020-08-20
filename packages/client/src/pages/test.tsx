// TODO: remove this file

import { NextPage } from 'next';

const test: NextPage = () => {
  return (
    <button
      onClick={() =>
        window.open(
          'http://localhost:4000/file/download/74ece8bc-fdc8-4c8b-af6c-78f7f97373ef',
          '_blank'
        )
      }
    >
      download
    </button>
  );
};

export default test;
