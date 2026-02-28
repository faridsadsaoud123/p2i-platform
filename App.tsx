
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RequestManagement from './components/RequestManagement';
import OperationManagement from './components/OperationManagement';
import FinancialIntegration from './components/FinancialIntegration';
import PlanningView from './components/PlanningView';
import UserManagement from './components/UserManagement';
import PrestataireManagement from './components/PrestataireManagement';
import CofinanceursList from './components/CofinanceursList';
import CofinanceurForm from './components/CofinanceurForm';
import CofinanceurDetail from './components/CofinanceurDetail';
import { NotificationProvider } from './components/NotificationSystem';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<RequestManagement />} />
            <Route path="/operations" element={<OperationManagement />} />
            <Route path="/finance" element={<FinancialIntegration />} />
            <Route path="/planning" element={<PlanningView />} />
            <Route path="/cofinanceurs" element={<CofinanceursList />} />
            <Route path="/cofinanceurs/new" element={<CofinanceurForm />} />
            <Route path="/cofinanceurs/:id" element={<CofinanceurDetail />} />
            <Route path="/cofinanceurs/:id/edit" element={<CofinanceurForm />} />
            <Route path="/marches" element={<div className="p-8">Marchés Publics (En cours de développement)</div>} />
            <Route path="/prestataires" element={<PrestataireManagement />} />
            <Route path="/users" element={<UserManagement />} />
            {/* Default fallback */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </NotificationProvider>
  );
};

export default App;
