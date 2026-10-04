from fastapi import FastAPI,HTTPException,status
from services.income_service import add_income

app = FastAPI()



