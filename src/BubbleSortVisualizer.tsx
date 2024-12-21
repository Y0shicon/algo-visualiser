import React, { useState, useEffect } from "react";

const BubbleSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [comparison, setComparison] = useState<[number, number] | null>(null); // Indices being compared
  const [sorted, setSorted] = useState<number[]>([]); // Indices of sorted elements

  // Generate a random array
  const generateArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setComparison(null);
    setSorted([]);
  };

  // Bubble sort with animations
  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    const finished: number[] = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparison([j, j + 1]); // Highlight bars being compared
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]); // Update the array to trigger re-render
        }
        await new Promise((resolve) => setTimeout(resolve, 100)); // Delay for visualization
      }
      finished.push(arr.length - 1 - i); // Mark bar as sorted
      setSorted([...finished]);
    }
    setSorted([...finished, 0]); // Mark the final bar as sorted
    setSorting(false);
    setComparison(null);
  };

  useEffect(() => {
    generateArray();
  }, []);

  return (
    <div className="visualizer-container">
      <div className="bars-container">
        {array.map((value, index) => {
          let barClass = "bar";
          if (sorted.includes(index)) barClass += " sorted";
          else if (
            comparison &&
            (index === comparison[0] || index === comparison[1])
          )
            barClass += " comparing";

          return (
            <div
              key={index}
              className={barClass}
              style={{ height: `${value}%` }}
            />
          );
        })}
      </div>
      <div className="controls">
        <button onClick={generateArray} disabled={sorting}>
          Generate New Array
        </button>
        <button onClick={bubbleSort} disabled={sorting}>
          Start Sorting
        </button>
      </div>
    </div>
  );
};

export default BubbleSortVisualizer;
