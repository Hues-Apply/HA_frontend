import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-center items-center gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={reactLogo} className="h-16 w-16 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Vite + React</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-700 mb-4">
          Edit <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-500 mt-8 text-center text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
