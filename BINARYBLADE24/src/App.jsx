import { useState } from 'react'
import Routers from "./components/Routers"
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
// 

function App() {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');

  const componentMap = {
    dashboard: <Dashboard />,
    profile: <ProfilePage />,
    settings: <Settings />
  };

  return (
    <>
      {/* <Navbar /> */}
      <h1>Hello</h1>
      <div>
        {componentMap[selectedComponent]}
      </div>
    </>
  )
}

export default App
