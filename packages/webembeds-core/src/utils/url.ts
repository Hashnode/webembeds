exports.extractQueryParams = (rawURL: string) => {
  const url = new URL(rawURL);
  // const mainURL = `${url.protocol}/${url.hostname}/${url.pathname}`;

  const urlSearchParams = new URLSearchParams(url.search);

  const queryParams = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const pair of urlSearchParams.entries()) {
    const temp = {} as any;
    const [key, value] = pair;
    temp[key] = value;
    queryParams.push(temp);
  }

  return queryParams;
};
