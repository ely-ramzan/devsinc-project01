window.addEventListener("load", () => {
  // ********** DOM ************
  const inputElement = document.getElementById("expression-input");

  const resultDisplay = document.getElementById("result-display");

  const buttonsContainer = document.getElementById("calculator-buttons");

  const historyList = document.getElementById("history-list");

  const varNameInput = document.getElementById("var-name");

  const varValueInput = document.getElementById("var-value");

  const saveVarButton = document.getElementById("save-var-btn");

  // ********** Code Storage ************

  const variableScope = {
    pi: Math.PI,
    e: Math.E,
  };

  let history = [];

  // ********** Reserved Keywords ************

  const reservedNames = ["pi", "e", "sin", "cos", "tan", "sqrt", "i", "log"];

  // ********** History Initial Rendering ************

  loadHistoryFromStorage();
  renderHistory();

  // ********** Event Listener Delegations ************

  buttonsContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.matches("button")) return;
    const { action, value } = target.dataset;
    handleButtonPress(action, value);
  });

  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleButtonPress("equals");
    }
  });

  historyList.addEventListener("click", (event) => {
    const target = event.target;
    const item = target.closest(".history-item");
    if (!item) return;

    const index = item.dataset.index;
    if (target.classList.contains("delete-btn")) {
      history.splice(index, 1);
      saveHistoryToStorage();
      renderHistory();
    } else {
      inputElement.value = history[index].expression;
      inputElement.focus();
    }
  });

  saveVarButton.addEventListener("click", () => {
    const name = varNameInput.value.trim();
    const value = varValueInput.value.trim();

    if (!name || !value) {
      alert("Variable name and value cannot be empty.");
      return;
    }

    if (!isNaN(parseFloat(name.charAt(0)))) {
      alert("Variable name cannot start with a number.");
      return;
    }

    if (reservedNames.includes(name.toLowerCase())) {
      alert(`'${name}' is a reserved name. Please choose another.`);
      return;
    }

    if (isNaN(parseFloat(value))) {
      alert("Variable value must be a number.");
      return;
    }

    variableScope[name] = parseFloat(value);

    alert(`Variable '${name}' saved.`);
    varNameInput.value = "";
    varValueInput.value = "";
  });

  // ********** Handler Functions ************
  function handleButtonPress(action, value) {
    switch (action) {
      case "insert":
        insertText(value);
        break;

      case "clear":
        inputElement.value = "";
        resultDisplay.innerText = "0";
        break;

      case "delete":
        const start = inputElement.selectionStart;
        const currentVal = inputElement.value;
        if (start > 0) {
          inputElement.value =
            currentVal.slice(0, start - 1) + currentVal.slice(start);
          inputElement.focus();
          inputElement.selectionStart = inputElement.selectionEnd = start - 1;
        }
        break;
      case "equals":
        calculateResult();
        break;
    }
  }

  // ********** Buttons Insert ************
  function insertText(text) {
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    const currentText = inputElement.value;
    inputElement.value =
      currentText.substring(0, start) + text + currentText.substring(end);
    inputElement.focus();
    inputElement.selectionStart = inputElement.selectionEnd =
      start + text.length;
  }

  // ********** Core Calculation Logic ************
  function calculateResult() {
    const expression = inputElement.value.replaceAll("π", "pi");
    if (!expression) return;

    try {

      const result = math.evaluate(expression, variableScope);

      if (typeof result === "function") {
        resultDisplay.innerText = "Function definition";
        return;
      }

      const resultText = parseFloat(result.toFixed(4)).toString();
      resultDisplay.innerText = resultText;

      addToHistory(inputElement.value, resultText);
      saveHistoryToStorage();
      renderHistory();
    } catch (error) {
      resultDisplay.innerText = "Error";
      console.error("Calculation Error:", error);
    }
  }

  // ********** STATE MANAGEMENT ************  
  function addToHistory(expression, result) {
    history.unshift({ expression, result });
    if (history.length > 20) history.pop();
  }

  function renderHistory() {
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML =
        '<p style="text-align:center; color:#999;">History is empty.</p>';
      return;
    }

    history.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.dataset.index = index;
      div.innerHTML = `<span class="expression">${item.expression} = ${item.result}</span><button class="delete-btn">X</button>`;
      historyList.appendChild(div);
    });
  }

  function saveHistoryToStorage() {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  }

  function loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem("calculatorHistory");
    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }
  }
});
