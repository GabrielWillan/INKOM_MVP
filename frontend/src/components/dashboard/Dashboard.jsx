export function Dashboard(){
    return(
      <section>
        <div className="dashboard-header">
            <h1>Welcome Gabriel</h1>
            <button>edit</button>
            <button>add</button>
        </div>
        <div className="dashboard-shell">
            <div className="budget-container">
             <div className="budget-overall-shell">

             </div>
             <div className="budget-chart-shell">
                
             </div>
            </div>

            <div className="budget-log-shell">
                <div className="log-header">
                    <form>
                        <input type="text"/>
                    </form>
                    <button>export</button>
                    <button>filter</button>
                </div>
                <div className="log-overview-shell">

                </div>
            </div>

            


        </div>
    

      </section>
    )
}