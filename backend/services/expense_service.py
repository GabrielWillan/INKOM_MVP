import sqlite3


def add_expenses(month:int, amount:int, budget_id:int, name:str, exepense_type:str, note:str | None = None):
    database = sqlite3.connect("database/inkom.db")

    try:
        cursor = database.execute(
            """
            INSERT INTO expenses(month, amount, budget_id, name, expense_type, note)
            VALUES(?,?,?,?,?,?)
            """,
            (month, amount, budget_id, name, exepense_type, note),
            )
        database.commit()
        return cursor.lastrowid
    finally:
        database.close()