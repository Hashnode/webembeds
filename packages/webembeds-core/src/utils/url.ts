exports.parseURL = (rawURL: string) => {
  const url = new URL(rawURL);
  const mainURL = `${url.protocol}/${url.hostname}/${url.pathname}`;

  const urlSearchParams = url.search ? new URLSearchParams(url.search) : [];

  return {
    embedURL: mainURL,
    queryParams: urlSearchParams,
  };
};
