import { colors } from "../helpers/colors";
import { Graph, GraphData, GraphLink, GraphNode } from "react-d3-graph";
import React, { useCallback } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { LinkDetails } from "../App";

const BaseGraph: React.FC<{
  data: GraphData<GraphNode, GraphLink>;
  onLinkDetailsChange: (details: LinkDetails | null) => void;
}> = ({ data, onLinkDetailsChange }) => {
  const { width, height } = useWindowSize();
  const getDetails = useCallback(
    (nodeId: string) => {
      const from: string[] = [];
      const to: string[] = [];
      data.links.forEach(link => {
        if (link.source === nodeId) {
          to.push(link.target);
        } else if (link.target === nodeId) {
          from.push(link.source);
        }
      });
      return { from, to, nodeId };
    },
    [data]
  );
  return (
    <Graph
      id="base-graph-id"
      data={data}
      onMouseOverNode={nodeId => void onLinkDetailsChange(getDetails(nodeId))}
      config={{
        width,
        height,
        directed: true,
        linkHighlightBehavior: true,
        nodeHighlightBehavior: true,

        node: {
          fontColor: colors.textLight,
          color: colors.node,
          highlightColor: colors.highlight,
          highlightStrokeColor: colors.highlight
        },
        link: {
          fontColor: colors.textLight,
          color: colors.link,
          highlightColor: colors.highlight
        }
      }}
    />
  );
};

export default React.memo(BaseGraph);
