import { ArrowLeft, Plus, WalletCards } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";


export function BudgetEdit() {
    const navigate = useNavigate();
    const [entryKind, setEntryKind] = useState("expense");
  return (
    <main className="dashboard-page budget-add-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR MONEY, IN ONE PLACE</p>
          <h1>Add to your budget</h1>
          <p className="budget-add-subtitle">Add an income or expense to your monthly plan.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={()=> navigate("/")}>
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

        <form className="budget-add-form" onSubmit={(event) => event.preventDefault()}>
          <label className="budget-add-field">
            <span>Name</span>
            <input type="text" name="name" placeholder="e.g. Groceries" />
          </label>

          <label className="budget-add-field">
            <span>Amount</span>
            <input type="number" name="amount" min="0" step="1" placeholder="0" />
          </label>

          <label className="budget-add-field">
            <span>Month</span>
            <input type="month" name="month" />
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
              <select name="expense_type" defaultValue="fixed">
                <option value="fixed">Fixed</option>
                <option value="flexible">Flexible</option>
              </select>
            </label>
          )}

          <label className="budget-add-field">
            <span>Currency</span>
            <select name="currency" defaultValue="KR">
              <option value="KR">KR</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <label className="budget-add-field budget-add-note">
            <span>Note <small>Optional</small></span>
            <textarea name="note" rows="4" placeholder="Add a note about this entry..." />
          </label>

          <div className="budget-add-actions">
            <button className="button button-secondary" type="reset">Clear</button>
            <button className="button button-primary" type="submit"><Plus size={16} /> Save entry</button>
          </div>
        </form>
      </section>
    </main>
  );
}
