import React from "react";

export default class GraphErrorBoundary extends React.Component<
  {},
  { error: Error | null }
> {
  constructor(props: {}) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h1>Graph Error</h1>
          <p>The following error occurred while trying render your graph</p>
          <p>{this.state.error.message}</p>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Re-render
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
