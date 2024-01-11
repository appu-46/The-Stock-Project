import { useState, useEffect } from "react";
import "./App.css";
import StockList from "./StockList";
import Logo from "./Logo";
import Input from "./Input";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:5000");
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const updatedStock = JSON.parse(event.data);
      // console.log(updatedStock);

      setStocks(updatedStock);
      setStocks((stocks) =>
        stocks.map((stock) =>
          stock.symbol === updatedStock.symbol
            ? { ...stock, currentPrice: updatedStock.currentPrice }
            : stock
        )
      );
    };

    return () => {
      newSocket.close();
    };
  }, []);

  function handleInputChange(input) {
    setInputValue(input);
  }

  function handleSubscribe(index) {
    if (index > 20 || index === "") {
      alert("Please enter a number from 1 to 20!");
      return;
    }
    setSelectedStocks(stocks.slice(0, index));
    setSubscribe(true);
  }

  return (
    <div className="main">
      <Logo />
      <Input
        inputValue={inputValue}
        onInput={handleInputChange}
        onSubscribe={handleSubscribe}
        stocks={stocks}
      />
      {subscribe && <StockList selectedStocks={selectedStocks} />}
    </div>
  );
}
