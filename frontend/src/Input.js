export default function Input({
  inputValue,
  onSubscribe,
  onInput,
  selectedStocks,
}) {
  return (
    <div className="input">
      {/* <label>Enter your number:</label> */}
      <input
        className="textbox"
        type="text"
        placeholder="Enter your number"
        value={inputValue}
        onChange={(e) => onInput(Number(e.target.value))}
      />
      <div>
        <button className="btn" onClick={() => onSubscribe(inputValue)}>
          Subscribe
        </button>
      </div>
    </div>
  );
}
