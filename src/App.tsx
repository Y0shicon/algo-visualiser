import React from "react";
import SortingVisualizer from "./SortingVisualizer.tsx";
import "./styles.scss";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Sorting Algorithm Visualizer</h1>
      <SortingVisualizer />
    </div>
  );
};

export default App;
