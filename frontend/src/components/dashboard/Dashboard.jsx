import { Download, Plus, Search, SlidersHorizontal, WalletCards } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchData } from "../api/budgetAPI";
import { useLocation, useNavigate } from "react-router";


export function Dashboard() {
  const navigate= useNavigate();
  const location = useLocation();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthToLoad = location.state?.month ?? currentMonth;
  const[budget, setBudget]=useState(null);
  const[transaction, settransaction]=useState({
    income:[],
    expenses:[]
  });
  const[summary, setSummary]=useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchData(monthToLoad);
        setBudget(data.budgetData);
        settransaction(data.transactionData);
        setSummary(data.summaryData);
      } catch (error) {
        console.error("Could not load dashboard:", error);
      }
    }
    loadData();
  }, [monthToLoad]);


  const transactionRows = [
    ...transaction.income.map((row)=>({
      id:`income-${row[0]}`,
      name:row[1],
      month:row[2],
      amount:Number(row[3]),
      note: row[4],
      type:"income"


    })),

    ...transaction.expenses.map((row)=>({
      id: `expenses-${row[0]}`,
      name:row[1],
      month:row[2],
      amount:Number(row[3]),
      note:row[4],
      type: row[5]?.toLowerCase() == "fixed" ? "Fixed" : "Flexible",

    })),
  ];



  const expenseRows = transactionRows.filter(
    (item) => item.type === "Fixed" || item.type === "Flexible"
  );
  const chartRows = expenseRows.length > 0
    ? expenseRows
    : Array.from({ length: 5 }, (_, index) => ({
        id: `placeholder-${index}`,
        name: "",
        amount: 0,
        isPlaceholder: true,
      }));

  const largestExpense = Math.max(
    ...expenseRows.map((item) => item.amount),1
  )

 const TotalincomeData = transactionRows.filter(
  item => item.type == "income").reduce((total, item)=> total + item.amount, 0);
 const TotalflexibleData = transactionRows.filter(
  item => item.type == "Flexible").reduce((total, item)=> total + item.amount, 0);
 const TotalfixedData = transactionRows.filter(
  item => item.type == "Fixed").reduce((total, item)=> total + item.amount, 0);
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Your money, in one place</p>
          <h1>Welcome!</h1>
        </div>
        <div className="button_shell">
          <button className="button button-secondary" type="button" onClick={()=> navigate("/edit")}>Edit</button>
          <button className="button button-primary" type="button" onClick={() => navigate("/createbudget")} ><Plus size={17} /> Add</button>
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
            <p className="remaining-amount">{summary? `${summary.remaining}`:"NA"} <span>{budget ? `${budget.currency}`:"NA"}</span></p>
            <p className="summary-caption">You have this amount left after your recorded expenses.</p>
            
            <div className="summary-stat-grid">
              <div className="summary-stat">
                <span className="stat-dot income-dot" />
                <p>Income</p>
                <strong>{TotalincomeData} <span>{budget ? `${budget.currency}`:""}</span></strong>
              </div>
              <div className="summary-stat">
                <span className="stat-dot fixed-dot" />
                <p>Fixed expenses</p>
                <strong>{TotalfixedData} <span>{budget ? `${budget.currency}`:""}</span></strong>
              </div> 
              <div className="summary-stat">
                <span className="stat-dot flexible-dot" />
                <p>Flexible expenses</p>
                <strong>{TotalflexibleData} <span>{budget ? `${budget.currency}`:""}</span></strong>
              </div>
            </div>
          </article>

          <article className="budget-chart-shell">
            <div className="chart-heading">
              <div>
                <p className="card-eyebrow">WHERE IT GOES</p>
                <h2>Spending by category</h2>
              </div>
              <span className="chart-period">{budget ? `${budget.month}` :"Month"}</span>
            </div>
            <div className="bar-chart" role="img" aria-label="Spending by expense">
              {chartRows.map((item, index) => (
                <div className="bar-chart-column" key={item.id}>
                  <span className="bar-amount">{item.isPlaceholder ? "" : item.amount}</span>

                  <div className="bar-track">
                    <div
                      className={`bar-fill bar-fill-${(index % 5) + 1}`}
                      style={{
                        height: item.isPlaceholder
                          ? "1%"
                          : `${Math.max(1, (item.amount / largestExpense) * 100)}%`,
                      }}
                    />
                  </div>

                  <span className="bar-label">{item.name}</span>
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
                {transactionRows.map((item) =>(
                  <tr key={item.id}>
                    <td>{item.name || "" }</td>
                    <td>{item.month || ""}</td>
                    <td>{item.type || ""}</td>
                    <td>{item.amount ?? ""}</td>
                    <td>{item.note || ""}</td>
                    <td>...</td>
                  </tr>
                )
                )}
              </tbody>
            </table>
          </div>
          <div className="log-footer">
            <span>Showing {transactionRows.length} entries</span>
            <button className="view-all-button" type="button">View all 
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
