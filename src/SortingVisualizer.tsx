import React, { useState, useEffect, useCallback } from "react";

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(20);
  const [speed, setSpeed] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<string>("Bubble Sort");
  const [sorting, setSorting] = useState<boolean>(false);
  const [comparison, setComparison] = useState<[number, number] | null>(null);
  const [sorted, setSorted] = useState<number[]>([]);

  // Generate a random array
  const generateArray = useCallback(() => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setComparison(null);
    setSorted([]);
  }, [arraySize]);

  useEffect(() => {
    console.log("Array generated" + array);
  }, [array]);

  // Delay function for animation
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Sorting algorithms
  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    const finished: number[] = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparison([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        await delay(speed);
      }
      finished.push(arr.length - 1 - i);
      setSorted([...finished]);
    }
    setSorted([...finished, 0]);
    setSorting(false);
    setComparison(null);
  };

  const selectionSort = async () => {
    setSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        setComparison([minIdx, j]);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        await delay(speed);
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      setSorted((prev) => [...prev, i]);
    }
    setSorting(false);
    setComparison(null);
  };

  const insertionSort = async () => {
    setSorting(true);
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        setComparison([j, j + 1]);
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        await delay(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSorted((prev) => [...prev, i]);
    }
    setSorting(false);
    setComparison(null);
  };

  const mergeSort = async (arr = [...array], start = 0, end = array.length) => {
    if (end - start <= 1) return arr;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid, end);

    const merged = [];
    let i = start,
      j = mid;
    while (i < mid && j < end) {
      setComparison([i, j]);
      if (arr[i] <= arr[j]) merged.push(arr[i++]);
      else merged.push(arr[j++]);
      await delay(speed);
    }
    while (i < mid) merged.push(arr[i++]);
    while (j < end) merged.push(arr[j++]);

    for (let k = 0; k < merged.length; k++) {
      arr[start + k] = merged[k];
      setArray([...arr]);
      await delay(speed);
    }
    setSorted((prev) => [
      ...prev,
      ...Array.from({ length: end - start }, (_, idx) => start + idx),
    ]);
    return arr;
  };

  const quickSort = async (arr = [...array], start = 0, end = array.length) => {
    if (start >= end - 1) return;

    const pivotIdx = end - 1;
    let partitionIdx = start;
    for (let i = start; i < end - 1; i++) {
      setComparison([i, pivotIdx]);
      if (arr[i] < arr[pivotIdx]) {
        [arr[i], arr[partitionIdx]] = [arr[partitionIdx], arr[i]];
        partitionIdx++;
        setArray([...arr]);
        await delay(speed);
      }
    }
    [arr[pivotIdx], arr[partitionIdx]] = [arr[partitionIdx], arr[pivotIdx]];
    setArray([...arr]);
    await delay(speed);

    setSorted((prev) => [...prev, partitionIdx]);
    await quickSort(arr, start, partitionIdx);
    await quickSort(arr, partitionIdx + 1, end);
  };

  // Handle sort based on selected algorithm
  const handleSort = async () => {
    if (algorithm === "Bubble Sort") await bubbleSort();
    else if (algorithm === "Selection Sort") await selectionSort();
    else if (algorithm === "Insertion Sort") await insertionSort();
    else if (algorithm === "Merge Sort") await mergeSort();
    else if (algorithm === "Quick Sort") await quickSort();
  };

  // Regenerate array when array size changes or algorithm changes
  useEffect(() => {
    generateArray();
  }, [arraySize, algorithm, generateArray]);

  return (
    <div className="visualizer-container">
      <div className="controls">
        <button onClick={generateArray} disabled={sorting}>
          Generate Array
        </button>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={sorting}
        >
          <option>Bubble Sort</option>
          <option>Selection Sort</option>
          <option>Insertion Sort</option>
          <option>Merge Sort</option>
          <option>Quick Sort</option>
        </select>
        <button onClick={handleSort} disabled={sorting}>
          Start {algorithm}
        </button>
      </div>
      <div className="sliders">
        <label>
          Array Size: {arraySize}
          <input
            type="range"
            min="5"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={sorting}
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
            disabled={sorting}
          />
        </label>
      </div>
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
    </div>
  );
};

export default SortingVisualizer;
