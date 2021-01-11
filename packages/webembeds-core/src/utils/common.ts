const nodeToObject = (allNodes: [any]) => {
  const allTags = [];

  let i = 0;
  do {
    let currentNode = allNodes[i];
    const temp = {} as any;
    Object.keys(currentNode.attribs).forEach((key) => {
      temp[key] = currentNode.attribs[key];
    });
    temp.type = currentNode.type;
    temp.name = currentNode.name;
    temp.namespace = currentNode.namespace;
    allTags.push(temp);

    i += 1;
    if (allNodes[i]) {
      currentNode = allNodes[i];
    } else {
      i = -1;
    }
  } while (i >= 0);

  return allTags;
};

exports.nodeToObject = nodeToObject;

// eslint-disable-next-line no-unused-vars
exports.extractMetaTags = ($: any) => {
  const metaTags = $($.html($("meta"))).toArray();
  return nodeToObject(metaTags);
};

// eslint-disable-next-line no-unused-vars
exports.extractLinkTags = ($: any) => {
  const linkTags = $($.html($("link"))).toArray();
  return nodeToObject(linkTags);
};