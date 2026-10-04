import sqlite3


class BudgetSummary():
    def __init__(self,budget_id: int):
        self.budget_id = budget_id
        self._database = sqlite3.connect("inkom.db")
    
    def fetch_values(self):
        try:
            income_cursor = self._database.execute(
                """
                SELECT amount FROM income WHERE budget_id=?
                """,
                (self.budget_id)
                ).fetchall()
            
            expense_cursor = self._database.execute(
                """
                SELECT amount FROM expenses WHERE budget_id=?
                """,
                (self.budget_id)
                ).fetchall
            
            return income_cursor, expense_cursor
        finally:
            self._database.close()

        
        