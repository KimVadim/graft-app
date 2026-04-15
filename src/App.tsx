import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import { IncomeReportcn } from '../src/pages/Reportcn';
import { Expenses } from './pages/Expenses/Expenses';
import Login from '../src/pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/order" element={<HomePage view='Opportunity'/>} />
          <Route path="/incomereportcn" element={<IncomeReportcn/>} />
          <Route path='/expenses' element={<Expenses/>} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;