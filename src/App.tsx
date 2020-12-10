import React, { useState } from "react";
import BaseGraph from "./components/BaseGraph";
import { paste, copy } from "./helpers/clipboardHelpers";
import GraphErrorBoundary from "./components/GraphErrorBoundary";
import useGraphData from "./hooks/useGraphData";

export type LinkDetails = { nodeId: string; from: string[]; to: string[] };

const App = () => {
  const [graphData, setGraphData] = useGraphData();
  const [
    hoveredNodeDetails,
    setHoveredNodeDetails
  ] = useState<LinkDetails | null>(null);
  const copyLink = async () => {
    await copy(window.location.href);
  };
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
        <BaseGraph
          data={graphData}
          onLinkDetailsChange={setHoveredNodeDetails}
        />
      </GraphErrorBoundary>
      <aside className="corner-form">
        {hoveredNodeDetails && (
          <section className="hover-details">
            <strong>{hoveredNodeDetails.nodeId}</strong>
            <dl>
              <dt>From:</dt>
              <dd>
                <ul>
                  {hoveredNodeDetails.from.map(nodeId => (
                    <li key={nodeId}>{nodeId}</li>
                  ))}
                </ul>
              </dd>
              <dt>To:</dt>
              <dd>
                <ul>
                  {hoveredNodeDetails.to.map(nodeId => (
                    <li key={nodeId}>{nodeId}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          </section>
        )}
        <div className="vertical-buttons">
          <button type="button" onClick={copyLink}>
            Copy Link
          </button>
          <button type="button" onClick={pasteGraph}>
            Paste Data
          </button>
        </div>
      </aside>
    </div>
  );
};

export default App;
