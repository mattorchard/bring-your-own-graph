import { useEffect, useState } from "react";
import { GraphData, GraphLink, GraphNode } from "react-d3-graph";
type GD = GraphData<GraphNode, GraphLink>;

const DELIMITERS = {
  legacy: "~",
  preferred: "*",
};

const sampleGraph = {
  nodes: [
    { id: "A" },
    { id: "B", symbolType: "diamond" },
    { id: "C" },
    { id: "D" },
  ],
  links: [
    {
      source: "A",
      target: "B",
    },
    {
      source: "A",
      target: "C",
    },
    {
      source: "B",
      target: "C",
    },
    {
      source: "B",
      target: "D",
    },
  ],
};

const symbolTypesLookup = {
  circle: 0,
  cross: 1,
  diamond: 2,
  square: 3,
  star: 4,
  triangle: 5,
  wye: 6,
};

const symbolTypes = [
  "circle",
  "cross",
  "diamond",
  "square",
  "star",
  "triangle",
  "wye",
];

type SymbolType = keyof typeof symbolTypesLookup;

const graphDataToSearchParams = (
  graphData: GD,
  delimiter = DELIMITERS.preferred,
) => {
  const params = new URLSearchParams();
  const nodeLookupTable = Object.fromEntries(
    graphData.nodes.map((node, index) => [node.id, index]),
  );
  params.set("delimiter", delimiter);
  params.set("nodes", graphData.nodes.map((node) => node.id).join(delimiter));
  params.set(
    "links",
    graphData.links
      .flatMap(({ source, target }) => [
        nodeLookupTable[source],
        nodeLookupTable[target],
      ])
      .join("-"),
  );

  if (graphData.nodes.some((node) => node.symbolType))
    params.set(
      "symbol",
      graphData.nodes
        .map((node) =>
          node.symbolType
            ? symbolTypesLookup[node.symbolType as SymbolType]
            : 0,
        )
        .join(""),
    );

  return params;
};

const getInitialGraphData = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodesRaw = searchParams.get("nodes");
  const linksRaw = searchParams.get("links");
  const symbolRaw = searchParams.get("symbol");
  const delimiter = searchParams.get("delimiter") || DELIMITERS.legacy;

  if (nodesRaw && linksRaw) {
    try {
      const nodes: GraphNode[] = nodesRaw
        .split(delimiter)
        .map((id) => ({ id }));

      const links: GraphLink[] = [];
      linksRaw.split(/[~-]/).forEach((linkText, index, textArray) => {
        if (index % 2 !== 0) {
          const prevLinkText = textArray[index - 1];
          links.push({
            source: nodes[parseInt(prevLinkText)].id,
            target: nodes[parseInt(linkText)].id,
          });
        }
      });

      if (symbolRaw) {
        symbolRaw.split("").forEach((char, index) => {
          nodes[index].symbolType = symbolTypes[parseInt(char)];
        });
      }

      return {
        nodes,
        links,
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
    let paramText = graphDataToSearchParams(graphData).toString();

    if (paramText.length >= MAX_PARAM_LENGTH) {
      paramText = new URLSearchParams([
        ["error", "graph-url-too-large"],
      ]).toString();
    }

    window.history.replaceState(
      null,
      "",
      new URL(`?${paramText}`, window.location.origin).toString(),
    );
  }, [graphData]);

  return [graphData, setGraphData];
};

const MAX_PARAM_LENGTH = 2 ** 31;

export default useGraphData;
