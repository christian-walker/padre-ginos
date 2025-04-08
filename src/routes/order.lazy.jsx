import { useEffect, useState, useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Pizza from "../Pizza";
import Cart from "../Cart";
import { CartContext } from "../contexts";

export const Route = createLazyFileRoute("/order")({
    component: Order
});

const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function Order() {

    const [pizzaTypes, setPizzaTypes] = useState([]); // useState is a hook that returns a stateful value and a function to update it
    const [pizzaType, setPizzaType] = useState("pepperoni");
    const [pizzaSize, setPizzaSize] = useState("M");
    //const [cart, setCart] = useState([]);
    const [cart, setCart] = useContext(CartContext);
    const [loading, setLoading] = useState(true);

    async function checkout() {
        setLoading(true);
        await fetch("/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({cart}),
        });
        setCart([]);
        setLoading(false);
    }

    let price, selectedPizza;

    if(!loading) {
        selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
        price = intl.format(
            selectedPizza.sizes ? selectedPizza.sizes[pizzaSize] : "",
          );
    }

    useEffect(() => { // useEffect is a hook that runs after the first render of the component
        fetchPizzaTypes();
    }, []);


    async function fetchPizzaTypes() {
        // await new Promise((resolve) => setTimeout(resolve, 10000));
        const pizzasRes = await fetch("/api/pizzas"); // fetch is a browser API that is used to make requests to a server
        const pizzasJson = await pizzasRes.json(); // .json() is a method that returns a promise that resolves with the result of parsing the body text as JSON
        setPizzaTypes(pizzasJson);
        setLoading(false);
  }

    return (

        loading ? (
            <h3>Loading...</h3>
          ) : (
            <div className="order-page">
                <div className="order">
                    <h2>Create Order</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
                        // ... is the spread operator which is used to create a new array with the elements of the old array
                    } }>
                        <div>
                            <div>
                                <label htmlFor="pizza-type"> Pizza Type </label>
                                <select 
                                    onChange={(e) => setPizzaType(e.target.value)}
                                    name="pizza-type" 
                                    value={pizzaType}
                                >
                                    {pizzaTypes.map((pizza) => (
                                    <option key={pizza.id} value={pizza.id}>{pizza.name}</option>
                                    ))}
                                    
                                </select>
                            </div>
                            <div>
                                <label htmlFor="pizza-size">Pizza Size</label>
                                <div>
                                    <span>
                                    <input 
                                        onClick={(e) => setPizzaSize(e.target.value)} 
                                        checked={pizzaSize === 'S'} 
                                        type="radio" 
                                        name="pizza-size" 
                                        value="S" 
                                        id="pizza-s"
                                    />
                                    <label htmlFor="pizza-s">Small</label>
                                    <input 
                                        onClick={(e) => setPizzaSize(e.target.value)} 
                                        checked={pizzaSize === 'M'} 
                                        type="radio" 
                                        name="pizza-size" 
                                        value="M" 
                                        id="pizza-m"
                                    />
                                    <label htmlFor="pizza-m">Medium</label>
                                    <input 
                                        onClick={(e) => setPizzaSize(e.target.value)} 
                                        checked={pizzaSize === 'L'} 
                                        type="radio" 
                                        name="pizza-size" 
                                        value="L" 
                                        id="pizza-l"
                                    />
                                    <label htmlFor="pizza-l">Large</label>
                                    </span>
                                </div>
                            </div>
                            <button type="submit">Add to Cart</button>
                        </div>
                        <div className="order-pizza">
                            <Pizza
                                name={selectedPizza.name}
                                description={selectedPizza.description}
                                image={selectedPizza.image}
                            />
                            <p>{price}</p>
                        </div>
                    </form>
                    
                </div>
                {
                        loading ? <h2>Loading ...</h2> : <Cart checkout={checkout} cart={cart} /> // if loading is true, display "Loading ...", otherwise display the Cart component
                    }
            </div>
          )
    )
}