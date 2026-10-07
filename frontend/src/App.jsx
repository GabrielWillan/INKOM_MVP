import './App.css'
import { Routes, Route } from "react-router";
import { Dashboard } from "./components/dashboard/Dashboard";
import { BudgetAdd } from "./components/dashboard/BudgetAdd";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<BudgetAdd />} />
    </Routes>
  );
}