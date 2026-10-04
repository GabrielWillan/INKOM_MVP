import sqlite3


class BudgetSummary():
    def __init__(self,budget_id: int):
        self.budget_id = budget_id
        self._database = sqlite3.connect("inkom.db")
        self.fetch = self.fetch_values()
       
    
    def fetch_values(self):
        try:
            income_row = self._database.execute(
                """
                SELECT amount FROM income WHERE budget_id=?
                VALUE(?)
                """,
                (self.budget_id,)
                ).fetchall()
            
            expense_row = self._database.execute(
                """
                SELECT amount FROM expenses WHERE budget_id=?
                """,
                (self.budget_id,)
                ).fetchall()
            
            return income_row, expense_row
        finally:
            self._database.close()
    
    def calculate_budget(self):
        income_row, expense_row = self.fetch_values
        income_total = sum(row[0] for row in income_row)
        expense_total = sum(row[0] for row in expense_row)

        budget_result = income_total - expense_total

        if budget_result < 0:
            raise ValueError("Negative number is not possible")

        return budget_result
    
    def get_budget(self, month:int, currency: str, created_at:str, updated_at:str ):
        






        
        