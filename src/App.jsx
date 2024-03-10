import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Home, Expenses, Header ,Incomes} from './components'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Header />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/Incomes" element={<Incomes/>} />
    </Routes>
    </>
  )
}

export default App
