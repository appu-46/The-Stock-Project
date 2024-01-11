export default function StockList({ selectedStocks }) {
  return (
    <div className="stocklist">
      <h3>Here are your subscribed Stocks: </h3>
      <ol className="stocklist">
        {selectedStocks.map((stock) => (
          <li key={stock.symbol}>
            {stock.symbol}: ${stock.currentPrice.toFixed(2)}
          </li>
        ))}
      </ol>
    </div>
  );
}
