import { useState } from 'react'
import Approutes from './routes/Approutes'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Approutes/>
    </>
  )
}

export default App
