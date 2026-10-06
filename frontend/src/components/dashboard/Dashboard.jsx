import { Download, Plus, Search, SlidersHorizontal, WalletCards } from "lucide-react";

import { useState, useEffect } from "react";
//Sample data 
const spending = [
  { label: "Home", amount: "1,200 kr", height: "82%" },
  { label: "Food", amount: "760 kr", height: "58%" },
  { label: "Travel", amount: "480 kr", height: "39%" },
  { label: "Bills", amount: "320 kr", height: "28%" },
  { label: "Other", amount: "190 kr", height: "18%" },
];
export function Dashboard() {
  const loadingSign = "Loading..."
  const loadingCurrency = "Loading currency....."
  const[budgetSummary, setBudgetSummary]=useState(null)
  const[budget, setBudget]=useState(null)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [transaction, settransaction]=useState({
    income:[],
    expenses:[]
  })
  useEffect(()=>{
    const month = "2026-05"
    async function loadDashboard() {
      const budgetResponse = await fetch(`http://localhost:8000/budget/by-month?month=${month}`);
      if(!budgetResponse.ok){
        throw new Error("Something went wrong with the response")
      };
      const budgetData = await budgetResponse.json();
      setBudget(budgetData);

      const[summaryResponse, transactionResponse] = await Promise.all([
        fetch(`http://localhost:8000/budget?budget_id=${budgetData.id}`),
        fetch(`http://localhost:8000/transactions?budget_id=${budgetData.id}`),
      ]);

      const[summaryData, transactionData] = await Promise.all([
        summaryResponse.json(),
        transactionResponse.json(),
      ]);
      setBudgetSummary(summaryData);
      settransaction(transactionData);
      setIsLoadingTransactions(false)
    }
    loadDashboard().catch((error) => {
      console.error(error)
      setIsLoadingTransactions(false)
    })
  },[]);

  const transactionRows = [
    ...transaction.income.map((row) => ({
      id: `income-${row[0]}`,
      name: row[1],
      amount: Number(row[2]),
      note: row[3],
      type: "Income",
    })),
    ...transaction.expenses.map((row) => ({
      id: `expense-${row[0]}`,
      name: row[1],
      amount: Number(row[2]),
      note: row[3],
      type: row[4]?.toLowerCase() === "fixed" ? "Fixed" : "Flexible",
    })),
  ];

  const totalIncome = transactionRows
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + item.amount, 0);
  const totalFixedExpenses = transactionRows
    .filter((item) => item.type === "Fixed")
    .reduce((total, item) => total + item.amount, 0);
  const totalFlexibleExpenses = transactionRows
    .filter((item) => item.type === "Flexible")
    .reduce((total, item) => total + item.amount, 0);
  const formatMoney = (amount) =>
    `${amount.toLocaleString("sv-SE")} ${budget?.currency || ""}`.trim();

  
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Your money, in one place</p>
          <h1>Welcome Gabriel</h1>
        </div>
        <div className="button_shell">
          <button className="button button-secondary" type="button">Edit</button>
          <button className="button button-primary" type="button"><Plus size={17} /> Add</button>
        </div>
      </header>

      <section className="dashboard-shell" aria-label="Monthly budget dashboard">
        <div className="budget-container">
          <article className="budget-overall-shell">
            <div className="summary-topline">
              <div>
                <p className="card-eyebrow">MONTHLY OVERVIEW</p>
                <h2>Remaining this month</h2>
              </div>
              <span className="summary-icon" aria-hidden="true"><WalletCards size={19} /></span>
            </div>
            <p className="remaining-amount">{budgetSummary ? `${budgetSummary.remaining}`: `${loadingSign}`} <span>{budget ? `${budget.currency}`:`${loadingCurrency}`}</span></p>
            <p className="summary-caption">You have this amount left after your recorded expenses.</p>

            <div className="summary-stat-grid">
              <div className="summary-stat">
                <span className="stat-dot income-dot" />
                <p>Income</p>
                <strong>{isLoadingTransactions ? "Loading..." : formatMoney(totalIncome)}</strong>
              </div>
              <div className="summary-stat">
                <span className="stat-dot fixed-dot" />
                <p>Fixed expenses</p>
                <strong>{isLoadingTransactions ? "Loading..." : formatMoney(totalFixedExpenses)}</strong>
              </div>
              <div className="summary-stat">
                <span className="stat-dot flexible-dot" />
                <p>Flexible expenses</p>
                <strong>{isLoadingTransactions ? "Loading..." : formatMoney(totalFlexibleExpenses)}</strong>
              </div>
            </div>
          </article>

          <article className="budget-chart-shell">
            <div className="chart-heading">
              <div>
                <p className="card-eyebrow">WHERE IT GOES</p>
                <h2>Spending by category</h2>
              </div>
              <span className="chart-period">This month</span>
            </div>
            <div className="bar-chart" role="img" aria-label="Sample spending by category: Home 1,200 kr, Food 760 kr, Travel 480 kr, Bills 320 kr, Other 190 kr">
              {spending.map((item, index) => (
                <div className="bar-chart-column" key={item.label}>
                  <span className="bar-amount">{item.amount}</span>
                  <div className="bar-track">
                    <div className={`bar-fill bar-fill-${index + 1}`} style={{ height: item.height }} />
                  </div>
                  <span className="bar-label">{item.label}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <section className="budget-log-shell" aria-labelledby="budget-log-title">
          <div className="log-header">
            <div className="log-title-wrap">
              <p className="card-eyebrow">YOUR ACTIVITY</p>
              <h2 id="budget-log-title">Budget log</h2>
            </div>
            <div className="log-actions">
              <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()}>
                <Search size={18} aria-hidden="true" />
                <input type="search" aria-label="Search budget log" placeholder="Search transactions..." />
              </form>
              <div className="header-button-container">
                <button className="button button-secondary export-button" type="button"><Download size={16} /> Export</button>
                <button className="button button-secondary filter-button" type="button" aria-label="Filter transactions"><SlidersHorizontal size={17} /><span>Filter</span></button>
              </div>
            </div>
          </div>

          <div className="log-table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Month</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Note</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactionRows.map((item) => (
                  <tr key={item.id}>
                    <td className="transaction-name">{item.name}</td>
                    <td>{budget?.month || "—"}</td>
                    <td><span className={`type-pill type-${item.type.toLowerCase()}`}>{item.type}</span></td>
                    <td className={item.type === "Income" ? "amount-positive" : "amount-negative"}>
                      {item.type === "Income" ? "+" : "−"}{item.amount.toLocaleString("sv-SE")} {budget?.currency || ""}
                    </td>
                    <td className="transaction-note">{item.note || "—"}</td>
                    <td><button className="row-action" type="button" aria-label={`More actions for ${item.name}`}>···</button></td>
                  </tr>
                ))}
                {!isLoadingTransactions && transactionRows.length === 0 && (
                  <tr><td colSpan="6">No transactions for this budget yet.</td></tr>
                )}
                {isLoadingTransactions && (
                  <tr><td colSpan="6">Loading transactions...</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="log-footer"><span>Showing {transactionRows.length} entries</span><button className="view-all-button" type="button">View all <span aria-hidden="true">→</span></button></div>
        </section>
      </section>
    </main>
  );
}
