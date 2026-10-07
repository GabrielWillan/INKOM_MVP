import { Download, Plus, Search, SlidersHorizontal, WalletCards,Loader, Rows } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchData } from "../api/budgetAPI";


const spending = [
  { label: "NA", amount: "0", height: "0%" },
  { label: "NA", amount: "0", height: "0%" },
  { label: "NA", amount: "0", height: "0%" },
  { label: "NA", amount: "0", height: "0%" },
  { label: "NA", amount: "0", height: "0%" },
];

const transactions = [
  { name: "Monthly salary", date: "Oct 01, 2026", type: "Income", amount: "+5,000 kr", note: "Work" },
  { name: "Gym membership", date: "Oct 03, 2026", type: "Fixed", amount: "−200 kr", note: "Monthly" },
  { name: "Groceries", date: "Oct 04, 2026", type: "Flexible", amount: "−460 kr", note: "Food shop" },
  { name: "Bus pass", date: "Oct 05, 2026", type: "Fixed", amount: "−310 kr", note: "Monthly pass" },
  { name: "Coffee", date: "Oct 05, 2026", type: "Flexible", amount: "−45 kr", note: "" },
];

export function Dashboard() {
  const[budget, setBudget]=useState(null);
  const[transaction, settransaction]=useState({
    income:[],
    expenses:[]
  });
  const[summary, setSummary]=useState(null)

  useEffect(()=>{
    async function loadData() {
      const data = await fetchData("2026-01")
      setBudget(data.budgetData)
      settransaction(data.transactionData)
      setSummary(data.summaryData)
      setIsLoading(true)
    };
    loadData()
  },[]);


  const transactionRows = [
    ...transaction.income.map((row)=>({
      id:`income-${row[0]}`,
      name:row[1],
      amount:Number(row[2]),
      note: row[3],
      type:"income"


    }),

    ...transaction.expenses.map((row)=>({
      id: `expenses-${row[0]}`,
      name:row[1],
      amount:row[2],
      note:row[3],
      type: row[4]?.toLowerCase() == "fixed" ? "Flexible" : "Fixed",

    })

    )
)]

 const incomeData = transactionRows.filter(
  item => item.type == "income").reduce((total, item)=> total + item.amount, 0);
 const flexibleData = transactionRows.filter(
  item => item.type = "Flexible").reduce((total, item)=> total + item.amount, 0);
 const fixedData = transactionRows.filter(
  item => item.type = "Fixed").reduce((total, item)=> total + item.amount, 0);

  





  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Your money, in one place</p>
          <h1>Welcome!</h1>
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
            <p className="remaining-amount">{summary? `${summary.remaning}`:"Loading Amount"}<span>{budget ? `${budget.currency}`:"Loading currency...."}</span></p>
            <p className="summary-caption">You have this amount left after your recorded expenses.</p>
            
            <div className="summary-stat-grid">
              <div className="summary-stat">
                <span className="stat-dot income-dot" />
                <p>Income</p>
                <strong>{budget ? `${budget.amount}`: "0"}</strong>
              </div>
              <div className="summary-stat">
                <span className="stat-dot fixed-dot" />
                <p>Fixed expenses</p>
                <strong>{budget ? `${budget.amount}`: "0"}</strong>
              </div> 
              <div className="summary-stat">
                <span className="stat-dot flexible-dot" />
                <p>Flexible expenses</p>
                <strong>{budget ? `${budget.amount}`: "0"}</strong>
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
                  <th scope="col">Date</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Note</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={`${transaction.name}-${transaction.date}`}>
                    <td className="transaction-name">{}</td>
                    <td>{}</td>
                    <td><span className="transaction-type">{}</span></td>
                    <td className={transaction.type === "Income" ? "amount-positive" : "amount-negative"}>{}</td>
                    <td className="transaction-note">{}</td>
                    <td><button className="row-action" type="button" aria-label={`More actions for ${transaction.name}`}>···</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="log-footer"><span>Showing 5 sample entries</span><button className="view-all-button" type="button">View all <span aria-hidden="true">→</span></button></div>
        </section>
      </section>
    </main>
  );
}