import sqlite3

database = sqlite3.connect("inkom.db")


database.execute("""
CREATE TABLE IF NOT EXISTS budget(
                 id INTEGER PRIMARY KEY,
                 month TEXT NOT NULL UNIQUE,
                 currency TEXT NOT NULL, 
                 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP      
)
""")


database.execute("""
CREATE TABLE IF NOT EXISTS income  (
                 id INTEGER PRIMARY KEY,
                 amount INTEGER NOT NULL,
                 budget_id INTEGER NOT NULL,
                 name TEXT NOT NULL,
                 note TEXT,  
                 FOREIGN KEY(budget_id) REFERENCES budget(id)            
)
""")
    
database.execute("""
CREATE TABLE IF NOT EXISTS expenses (
                 id INTEGER PRIMARY KEY,
                 amount INTEGER NOT NULL,
                 budget_id INTEGER NOT NULL,
                 name TEXT NOT NULL,
                 expense_type TEXT NOT NULL CHECK(expense_type IN('fixed', 'flexible')),
                 note TEXT,
                 FOREIGN KEY(budget_id) REFERENCES budget(id)              
)
""")


database.commit()
database.close()