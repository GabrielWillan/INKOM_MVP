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


def delete_expense(expense_id:int):
    try:
        with sqlite3.connect("database/inkom.db") as database:
            cursor = database.execute(
                """
                DELETE FROM expenses WHERE id = ?
                """,
                (expense_id,)
            )
            database.commit()
            return cursor
    finally:
        database.close()