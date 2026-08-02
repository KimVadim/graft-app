import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import { IncomeReportcn } from './pages/Report/Reportcn';
import { Expenses } from './pages/Expenses/Expenses';
import Login from '../src/pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { Menu } from './pages/Menu/Menu';
import { IncomeReportpa } from './pages/Report/Reportpa';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/order" element={<HomePage view='Order'/>} />
          <Route path='/expenses' element={<Expenses/>} />
          <Route path='/menu' element={<Menu/>} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['vkim', 'anurmuhametov']} />}>
          <Route path="/reportcn" element={<IncomeReportcn/>} />
          <Route path="/reportpa" element={<IncomeReportpa/>} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;