
import ProtectedRoute from '@/components/ProtectedRoute';
import NewDashboardOverview from '@/components/dashboard/NewDashboardOverview';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <NewDashboardOverview />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
