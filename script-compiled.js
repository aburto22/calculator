"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function math(num1, num2, sym) {
  var op = sym;

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
  var rgx = /[-+*/]/;
  return rgx.test(sym);
}

function isNumber(num) {
  return !Number.isNaN(Number(num));
}

function getCurrentNumber(string) {
  var rgx = /[\d.]*$/;
  var match = string.match(rgx);
  return match[0];
}

function App() {
  var _React$useState = React.useState("0"),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      disp = _React$useState2[0],
      setDisp = _React$useState2[1];

  var showingResult = React.useRef(false);
  var allowPoint = React.useRef(true);

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
        e.preventDefault();
        addDigit(e.key);
        break;

      case "Enter":
        e.preventDefault();
        getResult();
        break;

      case "Backspace":
        e.preventDefault();
        clearDisp();
        break;
    }
  }

  React.useEffect(function () {
    document.addEventListener("keydown", keySupport);
    return function () {
      document.removeEventListener("keydown", keySupport);
    };
  });
  React.useEffect(function () {
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
    var rgxNum = /[\d.]+/g;
    var nums = disp.match(rgxNum).map(function (num) {
      return Number(num);
    });
    var rgxSym = /[-+/*]+/g;
    var syms = disp.match(rgxSym);
    var total = nums[0];

    for (var i = 1; i < nums.length; i++) {
      total = math(total, nums[i], syms[i - 1]);
    }

    total = Math.round(total * 10000000) / 10000000;
    showingResult.current = true;
    allowPoint.current = true;
    setDisp(total);
  }

  function canGetResult(str) {
    var rgx = /\d+.?\d*[-+*/]+\d+.?\d*/;
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
        setDisp(function (disp) {
          return disp + num;
        });
      }
    } else {
      if (num === ".") {
        if (allowPoint.current) {
          allowPoint.current = false;
          setDisp(function (disp) {
            return disp + num;
          });
        }
      } else if (isSym(num)) {
        allowPoint.current = true;

        if (canGetResult(disp)) {
          getResult();
        }

        if (isSym(disp[disp.length - 1])) {
          if (disp[disp.length - 1] !== "-") {
            if (num === "-") {
              setDisp(function (disp) {
                return disp + num;
              });
            } else {
              setDisp(function (disp) {
                return disp.slice(0, disp.length - 1) + num;
              });
            }
          } else {
            if (isSym(disp[disp.length - 2])) {
              setDisp(function (disp) {
                return disp.slice(0, disp.length - 2) + num;
              });
            } else {
              setDisp(function (disp) {
                return disp.slice(0, disp.length - 1) + num;
              });
            }
          }
        } else {
          setDisp(function (disp) {
            return disp + num;
          });
        }
      } else {
        if (getCurrentNumber(disp) !== "0" && getCurrentNumber(disp).length < 9) {
          setDisp(function (disp) {
            return disp + num;
          });
        } else {
          if (num !== "0") {
            setDisp(function (disp) {
              return disp.slice(0, disp.length - 1) + num;
            });
          }
        }
      }
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    id: "container"
  }, /*#__PURE__*/React.createElement("h1", null, "Calculator"), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("input", {
    id: "display",
    value: disp,
    disabled: true
  }), /*#__PURE__*/React.createElement("div", {
    id: "equals",
    "class": "btn",
    onClick: getResult
  }, "="), /*#__PURE__*/React.createElement("div", {
    id: "zero",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("0");
    }
  }, "0"), /*#__PURE__*/React.createElement("div", {
    id: "one",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("1");
    }
  }, "1"), /*#__PURE__*/React.createElement("div", {
    id: "two",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("2");
    }
  }, "2"), /*#__PURE__*/React.createElement("div", {
    id: "three",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("3");
    }
  }, "3"), /*#__PURE__*/React.createElement("div", {
    id: "four",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("4");
    }
  }, "4"), /*#__PURE__*/React.createElement("div", {
    id: "five",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("5");
    }
  }, "5"), /*#__PURE__*/React.createElement("div", {
    id: "six",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("6");
    }
  }, "6"), /*#__PURE__*/React.createElement("div", {
    id: "seven",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("7");
    }
  }, "7"), /*#__PURE__*/React.createElement("div", {
    id: "eight",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("8");
    }
  }, "8"), /*#__PURE__*/React.createElement("div", {
    id: "nine",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("9");
    }
  }, "9"), /*#__PURE__*/React.createElement("div", {
    id: "multiply",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("*");
    }
  }, "x"), /*#__PURE__*/React.createElement("div", {
    id: "add",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("+");
    }
  }, "+"), /*#__PURE__*/React.createElement("div", {
    id: "subtract",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("-");
    }
  }, "-"), /*#__PURE__*/React.createElement("div", {
    id: "divide",
    "class": "btn",
    onClick: function onClick() {
      return addDigit("/");
    }
  }, "/"), /*#__PURE__*/React.createElement("div", {
    id: "decimal",
    "class": "btn",
    onClick: function onClick() {
      return addDigit(".");
    }
  }, "."), /*#__PURE__*/React.createElement("div", {
    id: "clear",
    "class": "btn",
    onClick: clearDisp
  }, "Clear")), /*#__PURE__*/React.createElement("footer", null, "Created by Alejandro Aburto for a freeCodeCamp challenge."));
}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#root"));
