let income = parseFloat(localStorage.getItem("income")) || 0;
let expense = 0;
let balance = income;

const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
const balanceAmount = document.getElementById("balance-amount");
const expenseForm = document.getElementById("expense-form");
const historyList = document.getElementById("history-list");

const incomeInput = document.getElementById("income-input");
const setIncomeBtn = document.getElementById("set-income-btn");

let categoryData = JSON.parse(localStorage.getItem("categoryData")) || {};
let expenseHistory = JSON.parse(localStorage.getItem("expenseHistory")) || [];

expense = Object.values(categoryData).reduce((sum, val) => sum + val, 0);
balance = income - expense;

const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: [],
    datasets: [{
      label: "Expenses",
      data: [],
      backgroundColor: [],
      borderColor: "#fff",
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  }
});

updateUI();
updateChart();
loadHistory();

setIncomeBtn.addEventListener("click", function () {
  const newIncome = parseFloat(incomeInput.value);
  if (isNaN(newIncome) || newIncome <= 0) {
    alert("Please enter a valid income amount.");
    return;
  }

  income = newIncome;
  localStorage.setItem("income", income);
  balance = income - expense;
  updateUI();
  incomeInput.value = "";

  const rect = incomeInput.getBoundingClientRect();
  flyMoneyAnimation(rect.left + rect.width / 2, rect.top);
});

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();

  if (isNaN(amount) || amount <= 0 || category === "") {
    alert("Enter valid amount and category.");
    return;
  }

  expense += amount;
  balance = income - expense;

  const expenseEntry = { category, amount };
  expenseHistory.push(expenseEntry);
  localStorage.setItem("expenseHistory", JSON.stringify(expenseHistory));

  if (categoryData[category]) {
    categoryData[category] += amount;
  } else {
    categoryData[category] = amount;
  }
  localStorage.setItem("categoryData", JSON.stringify(categoryData));

  addExpenseToList(expenseEntry);

  updateUI();
  updateChart();

  amountInput.value = "";
  categoryInput.value = "";

  const rect = amountInput.getBoundingClientRect();
  flyMoneyAnimation(rect.left + rect.width / 2, rect.top);
});

function addExpenseToList(entry) {
  const li = document.createElement("li");
  li.textContent = `${entry.category} - ₹${entry.amount}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.background = "transparent";
  deleteBtn.style.border = "none";
  deleteBtn.style.color = "#f44336";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontWeight = "bold";
  deleteBtn.style.fontSize = "18px";
  deleteBtn.setAttribute("aria-label", "Delete expense");

  deleteBtn.addEventListener("click", () => {
    expense -= entry.amount;
    balance = income - expense;

    if (categoryData[entry.category]) {
      categoryData[entry.category] -= entry.amount;
      if (categoryData[entry.category] <= 0) {
        delete categoryData[entry.category];
      }
    }

    const index = expenseHistory.indexOf(entry);
    if (index > -1) {
      expenseHistory.splice(index, 1);
    }

    localStorage.setItem("categoryData", JSON.stringify(categoryData));
    localStorage.setItem("expenseHistory", JSON.stringify(expenseHistory));

    li.remove();
    updateUI();
    updateChart();
  });

  li.appendChild(deleteBtn);
  historyList.appendChild(li);
}

function loadHistory() {
  historyList.innerHTML = "";
  expenseHistory.forEach(entry => {
    addExpenseToList(entry);
  });
}

function updateUI() {
  incomeAmount.textContent = `₹${income}`;
  expenseAmount.textContent = `₹${expense}`;
  balanceAmount.textContent = `₹${balance}`;
}

function updateChart() {
  expenseChart.data.labels = Object.keys(categoryData);
  expenseChart.data.datasets[0].data = Object.values(categoryData);
  expenseChart.data.datasets[0].backgroundColor = generateColors(Object.keys(categoryData).length);
  expenseChart.update();
}

function generateColors(count) {
  const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all transactions?")) {
    localStorage.clear();
    income = 0;
    expense = 0;
    balance = 0;
    categoryData = {};
    expenseHistory = [];
    historyList.innerHTML = "";
    updateUI();
    updateChart();
  }
});

const darkModeToggle = document.getElementById("dark-mode-toggle");
const modeIcon = document.getElementById("mode-icon");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  modeIcon.classList.replace("fa-moon", "fa-sun");
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);

  if (isDark) {
    modeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    modeIcon.classList.replace("fa-sun", "fa-moon");
  }
});

setTimeout(() => {
  document.getElementById('splash').style.display = 'none';
  document.querySelector('.main-content').style.display = 'block';
}, 3000);

function flyMoneyAnimation(startX, startY) {
  const money = document.createElement("div");
  money.classList.add("flying-money");
  money.textContent = "💸";

  money.style.left = `${startX}px`;
  money.style.top = `${startY}px`;

  document.body.appendChild(money);

  money.addEventListener("animationend", () => {
    money.remove();
  });
}
