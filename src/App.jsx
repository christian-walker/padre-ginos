import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PizzaOfTheDay  from "./PizzaOfTheDay";
import Order from "./Order";

const App = () => {
  return (
    <StrictMode>
      <div>
        <h1 className="logo"> Padre Gino's - Order Now</h1>
        <Order />
        <PizzaOfTheDay />
      </div>
    </StrictMode>
    
  )
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
