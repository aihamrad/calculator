import { useEffect, useState } from "react";
import Button from "./components/Button";
import axios from "axios";

const URL = "http://localhost:8080/history";

function App() {
  const [displayValue, setDisplayValue] = useState("");
  const [operation, setOperation] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = () => {
    axios.get(URL).then(({ data }) => {
      console.log(data.data);
      setHistory(data.data);
    });
  };

  const handleNumberClick = (number) => {
    setDisplayValue((prev) => prev.concat(number));
    setOperation((prev) => prev.concat(number));
  };

  const handleClearClick = () => {
    setDisplayValue("");
    setOperation("");
  };

  const handleEqualsClick = () => {
    const operationsArray = [];
    const numbers = operation.toString().split(/[+\-*/]/);

    for (let i = 0; i <= operation.length; i++) {
      if (["*", "/", "+", "-"].includes(operation[i])) {
        operationsArray.push(operation[i]);
      }
    }
    let results = parseFloat(numbers[0]) ? parseFloat(numbers[0]) : 0;
    if (!/[+\-*/]$/.test(operation.at(-1))) {
      for (let j = 0; j <= operationsArray.length - 1; j++) {
        if (operationsArray[j] === "*") {
          results *= parseFloat(numbers[j + 1]);
        } else if (operationsArray[j] === "/") {
          results /= parseFloat(numbers[j + 1]);
        } else if (operationsArray[j] === "-") {
          results -= parseFloat(numbers[j + 1]);
        } else if (operationsArray[j] === "+") {
          results += parseFloat(numbers[j + 1]);
        }
      }
    }

    axios
      .post(URL, {
        key: history.length + 1,
        data: `${operation}=${results}`,
      })
      .then(() => getHistory());

    // setHistory((prev) => [...prev, `${operation}=${results}`]);
    setOperation(results.toString());
    setDisplayValue(results.toString());
  };

  const handleOperatorClick = (selectedOperation) => {
    if (!/[+\-*/]$/.test(operation.at(-1))) {
      setOperation((prev) => prev.concat(selectedOperation));
    }
    setDisplayValue("");
  };

  const handleClearHistory = () => {
    setShowHistory(false);
    axios.delete(URL).then(({ data }) => setHistory(data.data));
  };

  return (
    <div className="container p-l">
      <div className="d-flex justify-content-center align-items-center">
        <div className="box b-full b-radius-5 p-s">
          <div className="d-flex justify-content-between ml-s mh-s">
            <div className="flex-basis-70 w-100">
              <div>
                <div className="background-grey b-radius-5 p-m mb-s displayBox d-flex justify-content-between align-items-center">
                  <div>
                    {history.length > 0 && (
                      <Button
                        onClick={() => setShowHistory((prev) => !prev)}
                        text={`${showHistory ? "Hide" : "Show"} History`}
                        className="background-grey button-small"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-s text-grey">{operation}</div>
                    <div>{displayValue}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-start algin-items-center w-100 mb-s">
                  {["Clear", "/", "*"].map((x, index) => (
                    <Button
                      text={x}
                      key={index}
                      onClick={
                        x === "Clear" ? handleClearClick : handleOperatorClick
                      }
                      className={`background-grey button-${
                        x === "Clear" ? "big" : "small"
                      }`}
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-start algin-items-center mb-s w-100">
                  {["7", "8", "9", "-"].map((x, index) => (
                    <Button
                      text={x}
                      key={index}
                      onClick={
                        x === "-" ? handleOperatorClick : handleNumberClick
                      }
                      className="background-grey button-small"
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-start algin-items-center mb-s w-100">
                  {["4", "5", "6", "+"].map((x, index) => (
                    <Button
                      text={x}
                      key={index}
                      onClick={
                        x === "+" ? handleOperatorClick : handleNumberClick
                      }
                      className="background-grey button-small"
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-start algin-items-start">
                  <div>
                    <div className="d-flex mb-s">
                      {["1", "2", "3"].map((x, index) => (
                        <Button
                          text={x}
                          key={index}
                          onClick={handleNumberClick}
                          className="background-grey button-small"
                        />
                      ))}
                    </div>
                    <div className="d-flex">
                      {["0", "."].map((x, index) => (
                        <Button
                          text={x}
                          key={index}
                          onClick={handleNumberClick}
                          className={`background-grey button-${
                            x === "0" ? "big" : "small"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    text={"="}
                    onClick={handleEqualsClick}
                    className="button-small background-orange"
                  />
                </div>
              </div>
            </div>
            {showHistory && history.length > 0 && (
              <div className="flex-basis-30 p-relative b-full b-radius-5 history-box">
                <div className="history-list pv-s pt-s">
                  <div>History of operations</div>
                  {history.map((x) => (
                    <div key={x.key}> {x.data}</div>
                  ))}
                </div>
                <button
                  className="p-s pointer background-dark-grey"
                  onClick={handleClearHistory}
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
