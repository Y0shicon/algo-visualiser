import "./Sorting/styles.scss";
import MazeSolverVisualizer from "./maze/MazeSolverVisualizer.tsx";
import SortingVisualizer from "./Sorting/SortingVisualizer.tsx";
import React, { useState } from "react";

const App: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState("sorting");

  return (
    <div className="App">
      <nav>
        <button onClick={() => setSelectedComponent("sorting")}>
          Sorting Algorithms
        </button>
        <button onClick={() => setSelectedComponent("maze")}>
          Maze Solver
        </button>
      </nav>
      <h1>Algorithm Visualizer</h1>
      {selectedComponent === "sorting" ? (
        <SortingVisualizer />
      ) : (
        <MazeSolverVisualizer />
      )}
    </div>
  );
};

export default App;
