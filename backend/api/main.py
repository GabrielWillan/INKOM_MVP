from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from services.income_service import add_income

app = FastAPI()

#validator
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
    






