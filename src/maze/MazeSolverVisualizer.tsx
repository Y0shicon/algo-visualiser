import React, { useState, useEffect } from "react";
import "./MazeSolverVisualizer.scss";

type Cell = {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
};

const MazeSolverVisualizer: React.FC = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [mazeSize, setMazeSize] = useState<number>(10);
  const [speed, setSpeed] = useState<number>(50);
  const [solving, setSolving] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<string>("DFS");

  useEffect(() => {
    generateMaze();
  }, [mazeSize]);

  const generateMaze = () => {
    const newMaze: Cell[][] = Array.from({ length: mazeSize }, (_, row) =>
      Array.from({ length: mazeSize }, (_, col) => ({
        row,
        col,
        isWall: Math.random() < 0.3, // 30% chance of being a wall
        isVisited: false,
        isPath: false,
      }))
    );

    // Ensure start and end points are not walls
    newMaze[0][0].isWall = false;
    newMaze[mazeSize - 1][mazeSize - 1].isWall = false;

    setMaze(newMaze);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const visualizeDFS = async () => {
    setSolving(true);
    const stack: Cell[] = [maze[0][0]];
    const visited: Set<string> = new Set();

    const dfs = async (): Promise<boolean> => {
      while (stack.length > 0) {
        const current = stack.pop()!;
        const { row, col } = current;

        if (visited.has(`${row}-${col}`)) continue;
        visited.add(`${row}-${col}`);

        if (row === mazeSize - 1 && col === mazeSize - 1) {
          current.isPath = true;
          setMaze([...maze]);
          return true; // Found the target
        }

        current.isVisited = true;
        setMaze([...maze]);
        await delay(speed);

        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
          stack.push(neighbor);
        }
      }
      return false; // No solution
    };

    await dfs();
    setSolving(false);
  };

  const visualizeBFS = async () => {
    setSolving(true);
    const queue: Cell[] = [maze[0][0]];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const { row, col } = current;

      if (visited.has(`${row}-${col}`)) continue;
      visited.add(`${row}-${col}`);

      if (row === mazeSize - 1 && col === mazeSize - 1) {
        current.isPath = true;
        setMaze([...maze]);
        break; // Found the target
      }

      current.isVisited = true;
      setMaze([...maze]);
      await delay(speed);

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }
    }

    setSolving(false);
  };

  const getNeighbors = (cell: Cell): Cell[] => {
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];
    const neighbors: Cell[] = [];

    for (const [dr, dc] of directions) {
      const newRow = cell.row + dr;
      const newCol = cell.col + dc;

      if (
        newRow >= 0 &&
        newRow < mazeSize &&
        newCol >= 0 &&
        newCol < mazeSize &&
        !maze[newRow][newCol].isWall &&
        !maze[newRow][newCol].isVisited
      ) {
        neighbors.push(maze[newRow][newCol]);
      }
    }

    return neighbors;
  };

  const handleSolve = async () => {
    if (algorithm === "DFS") await visualizeDFS();
    else if (algorithm === "BFS") await visualizeBFS();
  };

  return (
    <div className="maze-solver-container">
      <div className="controls">
        <button onClick={generateMaze} disabled={solving}>
          Generate Maze
        </button>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={solving}
        >
          <option>DFS</option>
          <option>BFS</option>
        </select>
        <button onClick={handleSolve} disabled={solving}>
          Start {algorithm}
        </button>
      </div>
      <div className="sliders">
        <label>
          Maze Size: {mazeSize}
          <input
            type="range"
            min="5"
            max="25"
            value={mazeSize}
            onChange={(e) => setMazeSize(Number(e.target.value))}
            disabled={solving}
          />
        </label>
        <label>
          Speed: {speed}ms
          <input
            type="range"
            min="10"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={solving}
          />
        </label>
      </div>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.isWall ? "wall" : ""}
                            ${cell.isVisited ? "visited" : ""}
                            ${cell.isPath ? "path" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MazeSolverVisualizer;
