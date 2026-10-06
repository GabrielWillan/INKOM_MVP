export async function fetchData() {
    const[dashboardResponse]= await fetch(`http://localhost:8000/budget/by-month?month=${month}`);
    if(!dashboardResponse.ok){
        throw new Error("Could not find budget")
    };
    const[budgetData] = await dashboardResponse.json()

    return(
        {budgetData}
    )

    
}