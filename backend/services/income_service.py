import sqlite3


def add_income(id:int, amount:int, budget_id:int, name:str, note: str | None ):
    database = sqlite3.connect("inkom.db")

    try:
        cursor = database.execute(
        """
        INSERT INTO income(id, amount, budget_id, name, note)
        VALUES(?,?,?,?)
        """,
        (id, amount, budget_id, name, note),
        )
        database.commit()
        return cursor.lastrowid
    finally:
        database.close()


    