import sqlite3


def fetch_transactions(budget_id:int):
    database = sqlite3.connect("database/inkom.db")
    cursor = database.cursor()


    try:
        income_data = cursor.execute("SELECT id, name, amount, note FROM income WHERE budget_id = ?",(budget_id,)).fetchall()
        expense_data = cursor.execute("SELECT id, name, amount, note, expense_type FROM expenses WHERE budget_id = ?",(budget_id,)).fetchall()

        return income_data, expense_data
    finally:
        database.close()

    

    