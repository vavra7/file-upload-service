import App, { AppInitialProps } from 'next/app';
import Head from 'next/head';
import { ReactElement } from 'react';
import '../styles/styles.scss';

class FileUploadServiceApp extends App<AppInitialProps> {
  static async getInitialProps(context): Promise<AppInitialProps> {
    const appProps = await App.getInitialProps(context);

    return {
      ...appProps
    };
  }

  constructor(props) {
    super(props);
  }

  render(): ReactElement {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        </Head>

        <Component {...pageProps} />
      </>
    );
  }
}

export default FileUploadServiceApp;
