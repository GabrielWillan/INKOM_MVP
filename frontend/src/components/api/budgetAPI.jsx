export async function fetchData(month) {
    const dashboardResponse = await fetch(
        `http://localhost:8000/budget/by-month?month=${encodeURIComponent(month)}`
    );
    if(!dashboardResponse.ok){
        throw new Error("Could not find the budget")
    };
    const budgetData = await dashboardResponse.json();
    const budget_id = budgetData.id;

    const[transactionResponse, summaryResponse]= await Promise.all([
        fetch(`http://localhost:8000/transactions/?budget_id=${budget_id}`),
        fetch(`http://localhost:8000/budget/?budget_id=${budget_id}`),
    ]) 
    if(!transactionResponse.ok || !summaryResponse.ok){
        throw new Error("Could not load the budget Data")
    };
    const[transactionData, summaryData] = await Promise.all([
        transactionResponse.json(),
        summaryResponse.json()
    ])

    return( 
        {budgetData, transactionData, summaryData}
    )
}


export async function postData(month, currency) {
    const createBudgetResponse = await fetch('http://localhost:8000/createbudget', {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify({month, currency})
    })

    const createBudgetData = await createBudgetResponse.json();
    if (!createBudgetResponse.ok) {
        throw new Error(createBudgetData.detail ?? "Could not create budget");
    }

    return { createBudgetData };
    
}

export async function postTransaction({ month, amount, name, note, entryKind, expenseType }) {
    const budgetResponse = await fetch(
        `http://localhost:8000/budget/by-month?month=${encodeURIComponent(month)}`
    );
    const budgetData = await budgetResponse.json();
    if (!budgetResponse.ok) {
        throw new Error(budgetData.detail ?? "Could not find a budget for this month");
    }

    const endpoint = entryKind === "income" ? "income" : "expense";
    const transactionPayload = {
        month,
        amount,
        budget_id: budgetData.id,
        name,
        note: note || null,
    };

    if (entryKind === "expense") {
        transactionPayload.expense_type = expenseType;
    }

    const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionPayload),
    });
    const transactionData = await response.json();
    if (!response.ok) {
        throw new Error(transactionData.detail ?? "Could not save the entry");
    }

    return { budgetData, transactionData };
}
