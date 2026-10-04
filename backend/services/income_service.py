import sqlite3


def add_income(amount:int, budget_id:int, name:str, note: str | None = None):
    database = sqlite3.connect("database/inkom.db")

    try:
        cursor = database.execute(
        """
        INSERT INTO income(amount, budget_id, name, note)
        VALUES(?,?,?,?)
        """,
        (amount, budget_id, name, note),
        )
        database.commit()
        return cursor.lastrowid
    finally:
        database.close()


    