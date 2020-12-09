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

const graphDataToSearchParams = (graphData: GD) => {
  const params = new URLSearchParams();
  const nodeLookupTable = Object.fromEntries(
    graphData.nodes.map((node, index) => [node.id, index])
  );
  params.set("nodes", graphData.nodes.map(node => node.id).join("~"));
  params.set(
    "links",
    graphData.links
      .flatMap(({ source, target }) => [
        nodeLookupTable[source],
        nodeLookupTable[target]
      ])
      .join("~")
  );
  return params;
};

const getInitialGraphData = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodesRaw = searchParams.get("nodes");
  const linksRaw = searchParams.get("links");

  if (nodesRaw && linksRaw) {
    try {
      const nodes = nodesRaw.split("~").map(id => ({ id }));
      const links: GraphLink[] = [];
      linksRaw.split("~").forEach((linkText, index, textArray) => {
        if (index % 2 !== 0) {
          const prevLinkText = textArray[index - 1];
          links.push({
            source: nodes[parseInt(prevLinkText)].id,
            target: nodes[parseInt(linkText)].id
          });
        }
      });

      return {
        nodes,
        links
      };
    } catch (error) {
      console.error("Failed to parse graph from url", error);
    }
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
