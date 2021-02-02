import React from "react";

import { AppProps } from "next/app";

import "../styles/main.css";

// eslint-disable-next-line react/jsx-props-no-spreading
const WebembedsApp = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />;

export default WebembedsApp;