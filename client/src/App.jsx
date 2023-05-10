import { useState } from 'react'
import './App.css'

function App() {
  // setCount will update constant count, and return it's value
  const [count, setCount] = useState(0)
  const handleIncrement = () => {
    return setCount(count + 1);
  }

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleIncrement}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
