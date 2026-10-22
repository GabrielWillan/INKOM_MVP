import sqlite3


def add_income(month:str, amount:int, budget_id:int, name:str, note: str | None = None):
    database = sqlite3.connect("database/inkom.db")

    try:
        cursor = database.execute(
        """
        INSERT INTO income(month, amount, budget_id, name, note)
        VALUES(?,?,?,?,?)
        """,
        (month, amount, budget_id, name, note),
        )
        database.commit()
        return cursor.lastrowid
    finally:
        database.close()


def delete_income(income_id:int):
    try:
        with sqlite3.connect("database/inkom.db") as database:
            cursor = database.execute(
                """
                DELETE FROM income WHERE id = ?
                """,
                (income_id,)
            )
            database.commit()
            return cursor
    finally:
        database.close()
        


    