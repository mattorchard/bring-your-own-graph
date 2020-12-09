import React from "react";
import BaseGraph from "./components/BaseGraph";
import { paste } from "./helpers/clipboardHelpers";
import GraphErrorBoundary from "./components/GraphErrorBoundary";
import useLocalStorageBackedState from "./hooks/useLocalStorageBackedState";

const sampleGraph = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  links: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" }
  ]
};

const App = () => {
  const [graphData, setGraphData] = useLocalStorageBackedState(
    sampleGraph,
    "graph-storage-v0"
  );
  const pasteGraph = async () => {
    try {
      const rawData = await paste();
      const graphData = JSON.parse(rawData);
      if (typeof graphData !== "object") {
        throw new Error(
          `Graph data must be an object, with properties "nodes" and "links"`
        );
      }
      if (!Array.isArray(graphData.nodes)) {
        throw new Error(`"data.nodes" must be an array`);
      }
      if (!Array.isArray(graphData.links)) {
        throw new Error(`"data.links" must be an array`);
      }
      setGraphData(graphData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <GraphErrorBoundary>
        <BaseGraph data={graphData} />
      </GraphErrorBoundary>
      <aside className="corner-form">
        <button type="button" onClick={pasteGraph}>
          Paste Data
        </button>
      </aside>
    </div>
  );
};

export default App;
