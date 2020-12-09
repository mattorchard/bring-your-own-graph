import { useEffect, useState } from "react";
import { GraphData, GraphLink, GraphNode } from "react-d3-graph";

const sampleGraph = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  links: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" }
  ]
};

const getInitialGraphData = () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const rawData = searchParams.get("data");
    if (rawData) return JSON.parse(rawData);
  } catch {}
  return sampleGraph;
};

type GD = GraphData<GraphNode, GraphLink>;
const useGraphData = (): [GD, (graphData: GD) => void] => {
  const [graphData, setGraphData] = useState(getInitialGraphData);

  useEffect(() => {
    const url = new URL(
      `?data=${encodeURIComponent(JSON.stringify(graphData))}`,
      window.location.href
    );

    window.history.replaceState(null, "", url.toString());
  }, [graphData]);

  return [graphData, setGraphData];
};

export default useGraphData;
