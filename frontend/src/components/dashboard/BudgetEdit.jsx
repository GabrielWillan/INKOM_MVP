import { ArrowLeft, Plus, WalletCards } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { postTransaction } from "../api/budgetAPI";


export function BudgetEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const budgetMonth = location.state?.month;
    const [entryKind, setEntryKind] = useState("expense");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event) {
      event.preventDefault();
      setErrorMessage("");

      const formData = new FormData(event.currentTarget);
      const month = formData.get("month");
      const entryKind = formData.get("entry_kind");

      try {
        await postTransaction({
          month,
          amount: Number(formData.get("amount")),
          name: formData.get("name"),
          note: formData.get("note"),
          entryKind,
          expenseType: formData.get("expense_type"),
        });
        navigate("/", { state: { month } });
      } catch (error) {
        setErrorMessage(error.message);
      }
    }

  return (
    <main className="dashboard-page budget-add-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR MONEY, IN ONE PLACE</p>
          <h1>Add to your budget</h1>
          <p className="budget-add-subtitle">Add an income or expense to your monthly plan.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={() => navigate("/", { state: { month: budgetMonth } })}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>
      </header>

      <section className="dashboard-shell budget-add-shell" aria-label="Add budget entry">
        <div className="budget-add-heading">
          <span className="summary-icon" aria-hidden="true"><WalletCards size={19} /></span>
          <div>
            <p className="card-eyebrow">NEW ENTRY</p>
            <h2>Entry details</h2>
          </div>
        </div>

        <form className="budget-add-form" onSubmit={handleSubmit}>
          <label className="budget-add-field">
            <span>Name</span>
            <input type="text" name="name" placeholder="e.g. Groceries" required />
          </label>

          <label className="budget-add-field">
            <span>Amount</span>
            <input type="number" name="amount" min="0" step="1" placeholder="0" required />
          </label>

          <label className="budget-add-field">
            <span>Month</span>
            <input type="month" name="month" defaultValue={budgetMonth ?? ""} required />
          </label>

          <label className="budget-add-field">
            <span>Entry type</span>
            <select
              name="entry_kind"
              value={entryKind}
              onChange={(event) => setEntryKind(event.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          {entryKind === "expense" && (
            <label className="budget-add-field">
              <span>Expense type</span>
              <select name="expense_type" defaultValue="Fixed">
                <option value="Fixed">Fixed</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>
          )}

          <label className="budget-add-field budget-add-note">
            <span>Note <small>Optional</small></span>
            <textarea name="note" rows="4" placeholder="Add a note about this entry..." />
          </label>

          <div className="budget-add-actions">
            <button className="button button-secondary" type="reset">Clear</button>
            <button className="button button-primary" type="submit"><Plus size={16} /> Save entry</button>
          </div>
          {errorMessage && <p role="alert">{errorMessage}</p>}
        </form>
      </section>
    </main>
  );
}
