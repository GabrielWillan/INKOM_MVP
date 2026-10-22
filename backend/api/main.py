import sqlite3

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from services.budget_summary import BudgetSummary, create_budget
from services.expense_service import add_expenses, delete_expense
from services.income_service import add_income, delete_income
from services.transactions_service import fetch_transactions

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


#CustomErrors 
class IdNotFoundError(KeyError):
    "Raises error when id dosent exist"



#income validator
class CreateIncome(BaseModel):
    month:str = Field(pattern=r"^\d{4}-\d{2}$")
    amount: int
    budget_id: int
    name:str
    note: str | None = None

class CreateExpense(BaseModel):
    month:str = Field(pattern=r"^\d{4}-\d{2}$")
    amount:int
    budget_id:int
    name:str
    expense_type:str
    note:str | None = None


class BudgetCreate(BaseModel):
    month:str = Field(pattern=r"^\d{4}-\d{2}$")
    currency:str


class DeleteIncome(BaseModel):
    income_id:int

class DeleteExpenses(BaseModel):
    expense_id:int






@app.post("/income", status_code= status.HTTP_201_CREATED)
def post_income(income:CreateIncome):
    new_id = add_income(
        month= income.month,
        amount= income.amount, 
        budget_id=income.budget_id, 
        name=income.name, 
        note=income.note)
    
    return{"id": new_id}

@app.delete("/deleteincome", status_code=status.HTTP_200_OK)
def deleted_income(income:DeleteIncome):
   delete_income(income.income_id)

   return f"Income {income.income_id} has been deleted"


@app.post("/expense", status_code=status.HTTP_201_CREATED)
def post_expense(exepense:CreateExpense):
    new_id = add_expenses(month=exepense.month,
                          amount=exepense.amount,
                          budget_id=exepense.budget_id,
                          name=exepense.name, 
                          exepense_type=exepense.expense_type, 
                          note=exepense.note
                        )
    
    return{"id":new_id}


@app.delete("/deleteexpense", status_code=status.HTTP_200_OK)
def deleted_expense(exepense:DeleteExpenses):
   try:
    delete_expense(exepense.expense_id)
   except IdNotFoundError:
       raise IdNotFoundError(f"id:{exepense.expense_id} dose not exist in the database")
   
   return f"Expense {exepense.expense_id} has been deleted"



@app.post("/createbudget", status_code=status.HTTP_201_CREATED)
def post_budget(budget:BudgetCreate):
    new_id = create_budget(
        month=budget.month, 
        currency=budget.currency
        )
    return {"id":new_id, "month":budget.month, "currency":budget.currency}


    
@app.get("/budget/by-month", status_code=status.HTTP_200_OK)
def get_budget_by_month(month: str):
    database = sqlite3.connect("database/inkom.db")

    try:
        budget = database.execute(
            "SELECT id, month, currency FROM budget WHERE month = ?",
            (month,),
        ).fetchone()
    finally:
        database.close()

    if budget is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found for this month",
        )

    return {"id": budget[0], "month": budget[1], "currency": budget[2]}


@app.get("/budget",status_code=status.HTTP_200_OK)
def get_budget(budget_id: int):
    database = sqlite3.connect("database/inkom.db")

    try:
        budget = database.execute("SELECT id FROM budget WHERE id=?", (budget_id,)).fetchone()    
    finally:
        database.close()
    
    
    if budget == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    
    summary = BudgetSummary(budget_id)
    return {"remaining": summary.calculate_budget()}



# Get transaction
@app.get("/transactions",status_code=status.HTTP_200_OK)
def get_transactions(budget_id:int):
    income_data, expense_data = fetch_transactions(budget_id= budget_id)

    return {"income": income_data, "expenses":expense_data}
