
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RequestManagement from './components/RequestManagement';
import OperationManagement from './components/OperationManagement';
import FinancialIntegration from './components/FinancialIntegration';
import PlanningView from './components/PlanningView';
import UserManagement from './components/UserManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<RequestManagement />} />
          <Route path="/operations" element={<OperationManagement />} />
          <Route path="/finance" element={<FinancialIntegration />} />
          <Route path="/planning" element={<PlanningView />} />
          <Route path="/users" element={<UserManagement />} />
          {/* Default fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
