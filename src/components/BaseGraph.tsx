import { colors } from "../helpers/colors";
import { Graph, GraphData, GraphLink, GraphNode } from "react-d3-graph";
import React from "react";
import { useWindowSize } from "../hooks/useWindowSize";

const BaseGraph: React.FC<{ data: GraphData<GraphNode, GraphLink> }> = ({
  data
}) => {
  const { width, height } = useWindowSize();
  return (
    <Graph
      id="base-graph-id"
      data={data}
      config={{
        width,
        height,
        directed: true,
        linkHighlightBehavior: true,
        nodeHighlightBehavior: true,

        node: {
          fontColor: colors.textLight,
          color: colors.node,
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

export default BaseGraph;
