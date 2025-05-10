import RegisterInterest from "./sections/RegisterInterest";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main id="main-content" className="pt-20">
        <RegisterInterest />
      </main>
    </>
  )
}

export default App
