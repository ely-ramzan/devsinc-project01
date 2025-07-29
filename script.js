const w = window.document;
function isNumeric(str) {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && isFinite(str);
}

const numsObj = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  zero: "0",
};

const expObj = {
  "btn-add": "+",
  "btn-sub": "-",
  "btn-mul": "*",
  "btn-div": "/",
  "btn-pow": "^",
  "btn-leftp": "(",
  "btn-rightp": ")",
  "btn-sqrt": "sqrt",
  "btn-sin": "sin",
  "btn-cos": "cos",
  "btn-tan": "tan",
};

const input = w.getElementById("input");
for (let key in numsObj) {
  const numButton = w.getElementById(key);
  numButton.addEventListener("click", () => {
    if (input.value === "0") {
      input.value = numsObj[key];
    } else {
      input.value += numsObj[key];
    }
  });
}
for (let key in expObj) {
  const expButton = w.getElementById(key);
  expButton.addEventListener("click", () => {
    if (key === "btn-leftp" || key === "btn-rightp") {
      input.value += expObj[key];
      return;
    }
    const val = input.value.slice(-1);
    if (isNumeric(val)) {
      input.value += expObj[key];
    }
  });
}

const C = w.getElementById("C");
C.addEventListener("click", () => {
  input.value = "0";
});
const D = w.getElementById("D");
D.addEventListener("click", () => {
  const val = input.value.slice(-1);
  if (val.toLowerCase().match(/[a-z]/i)) {
    if (val === "t") {
      // delete last 4
      input.value = input.value.slice(0, -4);
    } else {
      // delete last 3
      input.value = input.value.slice(0, -3);
    }
  } else {
    // delete last
    input.value = input.value.slice(0, -1);
  }
});
