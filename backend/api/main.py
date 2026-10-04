import sqlite3

from fastapi import FastAPI, HTTPException, status  # noqa: F401
from pydantic import BaseModel
from services.budget_summary import BudgetSummary
from services.expense_service import add_expenses
from services.income_service import add_income

app = FastAPI()

#income validator
class CreateIncome(BaseModel):
    amount: int
    budget_id: int
    name:str
    note: str | None = None

@app.post("/income", status_code= status.HTTP_201_CREATED)
def post_income(income:CreateIncome):
    new_id = add_income(
        amount= income.amount, 
        budget_id=income.budget_id, 
        name=income.name, 
        note=income.note)
    
    return{"id": new_id}
    
#expense validator
class CreateExpense(BaseModel):
    amount:int
    budget_id:int
    name:str
    expense_type:str
    note:str | None = None

@app.post("/expense", status_code=status.HTTP_201_CREATED)
def post_expense(exepense:CreateExpense):
    new_id = add_expenses(amount=exepense.amount,
                          budget_id=exepense.budget_id,
                          name=exepense.name, 
                          exepense_type=exepense.expense_type, 
                          note=exepense.note
                        )
    
    return{"id":new_id}




@app.get("/budget",status_code=status.HTTP_200_OK)
def get_budget(budget_id: int):
    database = sqlite3.connect("inkom.db")

    try:
        budget = database.execute("SELECT budget FROM budget WHERE id=?", (budget_id,)).fetchone()    
    finally:
        budget.close()
    
    if budget == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    
    summary = BudgetSummary(budget_id)
    return {"remaining": summary.calculate_budget()}
