import React from "react";

import { AppProps } from "next/app";
import Head from "next/head";

import "../styles/main.css";

// eslint-disable-next-line react/jsx-props-no-spreading
const WebembedsApp = ({
  Component,
  pageProps,
}: AppProps) => {
  return (
    <>
      <Head>
        <title>Webembeds</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default WebembedsApp;
