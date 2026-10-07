export async function fetchData(month) {
    const dashboardResponse= await fetch(`http://localhost:8000/budget/by-month?month=${month}`);
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