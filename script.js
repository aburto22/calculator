function math(num1, num2, sym) {
  let op = sym;

  if (sym.length > 1) {
    num2 *= -1;
    op = sym[0];
  }

  switch (op) {
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    default:
      return 0;
  }
}

function isSym(sym) {
  let rgx = /[-+*/]/;
  return rgx.test(sym);
}

function isNumber(num) {
  return !Number.isNaN(Number(num));
}

function getCurrentNumber(string) {
  let rgx = /[\d.]*$/;
  let match = string.match(rgx);
  return match[0];
}

function App() {
  const [disp, setDisp] = React.useState("0");
  const showingResult = React.useRef(false);
  const allowPoint = React.useRef(true);

  function keySupport(e) {
    switch (e.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
      case "+":
      case "-":
      case "*":
      case "/":
        addDigit(e.key);
        break;
      case "Enter":
        getResult();
        break;
      case "Backspace":
        clearDisp();
        break;
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", keySupport);
    return () => {
      document.removeEventListener("keydown", keySupport);
    };
  });

  React.useEffect(() => {
    if (showingResult.current && isSym(disp[disp.length - 1])) {
      showingResult.current = false;
    }
  });

  function clearDisp() {
    allowPoint.current = true;
    showingResult.current = false;
    setDisp("0");
  }

  function getResult() {
    let rgxNum = /[\d.]+/g;
    let nums = disp.match(rgxNum).map((num) => Number(num));

    let rgxSym = /[-+/*]+/g;
    let syms = disp.match(rgxSym);

    var total = nums[0];

    for (let i = 1; i < nums.length; i++) {
      total = math(total, nums[i], syms[i - 1]);
    }

    total = Math.round(total * 10000000) / 10000000;

    showingResult.current = true;
    allowPoint.current = true;
    setDisp(total);
  }

  function canGetResult(str) {
    const rgx = /\d+.?\d*[-+*/]+\d+.?\d*/;
    return rgx.test(str);
  }

  function addDigit(num) {
    if (showingResult.current) {
      showingResult.current = false;
      if (isNumber(num)) {
        setDisp(num);
      } else if (num === ".") {
        setDisp("0.");
        allowPoint.current = false;
      } else {
        setDisp((disp) => disp + num);
      }
    } else {
      if (num === ".") {
        if (allowPoint.current) {
          allowPoint.current = false;
          setDisp((disp) => disp + num);
        }
      } else if (isSym(num)) {
        allowPoint.current = true;
        if (canGetResult(disp)) {
          getResult();
        }
        if (isSym(disp[disp.length - 1])) {
          if (disp[disp.length - 1] !== "-") {
            if (num === "-") {
              setDisp((disp) => disp + num);
            } else {
              setDisp((disp) => disp.slice(0, disp.length - 1) + num);
            }
          } else {
            if (isSym(disp[disp.length - 2])) {
              setDisp((disp) => disp.slice(0, disp.length - 2) + num);
            } else {
              setDisp((disp) => disp.slice(0, disp.length - 1) + num);
            }
          }
        } else {
          setDisp((disp) => disp + num);
        }
      } else {
        if (
          (getCurrentNumber(disp) !== "0") &
          (getCurrentNumber(disp).length < 9)
        ) {
          setDisp((disp) => disp + num);
        } else {
          if (num !== "0") {
            setDisp((disp) => disp.slice(0, disp.length - 1) + num);
          }
        }
      }
    }
  }

  return (
    <>
      <div id="container">
        <input id="display" value={disp} disabled />
        <div id="equals" class="btn" onClick={getResult}>
          =
        </div>
        <div id="zero" class="btn" onClick={() => addDigit("0")}>
          0
        </div>
        <div id="one" class="btn" onClick={() => addDigit("1")}>
          1
        </div>
        <div id="two" class="btn" onClick={() => addDigit("2")}>
          2
        </div>
        <div id="three" class="btn" onClick={() => addDigit("3")}>
          3
        </div>
        <div id="four" class="btn" onClick={() => addDigit("4")}>
          4
        </div>
        <div id="five" class="btn" onClick={() => addDigit("5")}>
          5
        </div>
        <div id="six" class="btn" onClick={() => addDigit("6")}>
          6
        </div>
        <div id="seven" class="btn" onClick={() => addDigit("7")}>
          7
        </div>
        <div id="eight" class="btn" onClick={() => addDigit("8")}>
          8
        </div>
        <div id="nine" class="btn" onClick={() => addDigit("9")}>
          9
        </div>
        <div id="multiply" class="btn" onClick={() => addDigit("*")}>
          x
        </div>
        <div id="add" class="btn" onClick={() => addDigit("+")}>
          +
        </div>
        <div id="subtract" class="btn" onClick={() => addDigit("-")}>
          -
        </div>
        <div id="divide" class="btn" onClick={() => addDigit("/")}>
          /
        </div>
        <div id="decimal" class="btn" onClick={() => addDigit(".")}>
          .
        </div>
        <div id="clear" class="btn" onClick={clearDisp}>
          Clear
        </div>
      </div>
      <p id="footer">
        Created by Alejandro Aburto for a freeCodeCamp challenge.
      </p>
    </>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
