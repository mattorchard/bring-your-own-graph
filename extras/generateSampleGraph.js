const generateSampleGraph = (nodeCount, linkCount) => {
  const getRandomNodeId = () =>
    Math.floor(Math.random() * nodeCount).toString();

  const nodes = new Array(nodeCount)
    .fill(null)
    .map((_, index) => ({ id: index.toString() }));

  const allLinks = new Array(linkCount).fill(null).map(() => ({
    source: getRandomNodeId(),
    target: getRandomNodeId(),
  }));

  const linkIdSet = new Set();
  const uniqueLinks = allLinks.filter((link) => {
    const linkId = `${link.source}::${link.target}`;
    const hadIt = linkIdSet.has(linkId);
    linkIdSet.add(linkId);
    return !hadIt;
  });

  return { nodes, links: uniqueLinks };
};

console.log(JSON.stringify(generateSampleGraph(1500, 1000)));
