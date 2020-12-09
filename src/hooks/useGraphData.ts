import { useEffect, useState } from "react";
import { GraphData, GraphLink, GraphNode } from "react-d3-graph";
type GD = GraphData<GraphNode, GraphLink>;

const sampleGraph = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  links: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" }
  ]
};

const stringifyGraphLinks = (links: GraphLink[]) =>
  links.map(({ source, target }) => [source, target]).join(",");

const parseGraphLinks = (linksText: string) => {
  const links: GraphLink[] = [];
  linksText.split(",").forEach((linkText, index, textArray) => {
    if (index % 2 !== 0) {
      const prevLinkText = textArray[index - 1];
      links.push({
        source: prevLinkText,
        target: linkText
      });
    }
  });
  return links;
};

const stringifyGraphNodes = (nodes: GraphNode[]) =>
  nodes.map(node => node.id).join(",");

const parseGraphNodes = (nodesText: string) =>
  nodesText.split(",").map(id => ({ id }));

const graphDataToSearchParams = (graphData: GD) => {
  const params = new URLSearchParams();
  params.set("nodes", stringifyGraphNodes(graphData.nodes));
  params.set("links", stringifyGraphLinks(graphData.links));
  return params;
};

const getInitialGraphData = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodesRaw = searchParams.get("nodes");
  const linksRaw = searchParams.get("links");
  if (nodesRaw && linksRaw) {
    return {
      nodes: parseGraphNodes(nodesRaw),
      links: parseGraphLinks(linksRaw)
    };
  }

  return sampleGraph;
};

const useGraphData = (): [GD, (graphData: GD) => void] => {
  const [graphData, setGraphData] = useState(getInitialGraphData);

  useEffect(() => {
    const url = new URL(
      `?${graphDataToSearchParams(graphData)}`,
      window.location.href
    );

    window.history.replaceState(null, "", url.toString());
  }, [graphData]);

  return [graphData, setGraphData];
};

export default useGraphData;
