/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [, setAvailableHours] = useState([]);

  const fetchAvailableHours = useCallback(async (date: string) => {
    const response = await fetch(`/api/available-hours?date=${date}`);
    const data = await response.json();

    setAvailableHours(data);
  }, []);

  const schedule = async () => {
    const body: any = {
      date: "2024-07-07 10:00",
    };
    const response = await fetch("/api/schedule", {
      method: "POST",
      body,
    });

    const data = await response.json();
    console.log({ data });
  };

  useEffect(() => {
    fetchAvailableHours("2024-07-07");
    schedule();
  }, [fetchAvailableHours]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
