import './App.css'
import { Routes, Route } from "react-router";
import { Dashboard } from "./components/dashboard/Dashboard";
import { BudgetEdit } from "./components/dashboard/BudgetEdit";
import { BudgetCreate } from './components/dashboard/BudgetCreate';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/edit" element={<BudgetEdit />} />
      <Route path='/createbudget' element={<BudgetCreate />} />
    </Routes>
  );
}