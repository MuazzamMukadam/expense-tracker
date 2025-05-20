let income = 10000;
let expense = 0;
let balance = income;

const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
const balanceAmount = document.getElementById("balance-amount");
const expenseForm = document.getElementById("expense-form");
const historyList = document.getElementById("history-list");

const categoryData = {};

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

  const li = document.createElement("li");
  li.textContent = `${category} - ₹${amount}`;
  historyList.appendChild(li);

  if (categoryData[category]) {
    categoryData[category] += amount;
  } else {
    categoryData[category] = amount;
  }

  updateUI();
  updateChart();

  amountInput.value = "";
  categoryInput.value = "";
});

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
