import { ArrowLeft, Plus, WalletCards } from "lucide-react";
import { useNavigate } from "react-router";
import { postData } from "../api/budgetAPI";

export function BudgetCreate() {
  const navigate = useNavigate();


  async function handleEvent(event){
      event.preventDefault();
      const formData = new FormData(event.currentTarget)
      const month = formData.get("month")
      const currency = formData.get("currency")
      try {
        const result = await postData(month, currency);
        navigate("/", { state: { month: result.createBudgetData.month } });
      } catch (error) {
        console.error("Could not create budget:", error);
      }
  }




  return (
    <main className="dashboard-page budget-add-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR MONEY, IN ONE PLACE</p>
          <h1>Create a budget</h1>
          <p className="budget-add-subtitle">Set up a monthly plan to track your income and expenses.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>
      </header>

      <section className="dashboard-shell budget-add-shell" aria-label="Create a monthly budget">
        <div className="budget-add-heading">
          <span className="summary-icon" aria-hidden="true"><WalletCards size={19} /></span>
          <div>
            <p className="card-eyebrow">GET STARTED</p>
            <h2>Budget details</h2>
          </div>
        </div>

        <form className="budget-add-form" onSubmit={handleEvent}>
          <label className="budget-add-field">
            <span>Month</span>
            <input type="month" name="month" required />
          </label>

          <label className="budget-add-field">
            <span>Currency</span>
            <select name="currency" defaultValue="KR">
              <option value="KR">KR</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <div className="budget-add-actions">
            <button className="button button-secondary" type="reset">Clear</button>
            <button className="button button-primary" type="submit"><Plus size={16} /> Create budget</button>
          </div>
        </form>
      </section>
    </main>
  );
}
