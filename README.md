# Bring Your Own Graph

Simple wrapper around [react-d3-graph](https://www.npmjs.com/package/react-d3-graph) to create shareable URLs with the data encoded within.

## Example Data

```json
{
  "nodes": [
    { "id": "A" },
    { "id": "B", "symbolType": "diamond" },
    { "id": "C" },
    { "id": "D" }
  ],
  "links": [
    {
      "source": "A",
      "target": "B"
    },
    {
      "source": "A",
      "target": "C"
    },
    {
      "source": "B",
      "target": "C"
    },
    {
      "source": "B",
      "target": "D"
    }
  ]
}
```

## Format

```ts
type InputData = {
  nodes: Array<{
    id: string;
    symbolType?:
      | "circle"
      | "cross"
      | "diamond"
      | "square"
      | "star"
      | "triangle"
      | "wye";
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
};
```

## Limits

Since the data is all placed into the URL extremely large graphs will eventually break.
Additionally some messaging apps truncate long messages or links, so be sure to test your graph appears as expected.
