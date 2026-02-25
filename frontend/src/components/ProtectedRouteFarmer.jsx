import { Navigate, Outlet } from 'react-router-dom';
import { useFarmerAuth } from '../context/FarmerAuthContext';

const ProtectedRouteFarmer = () => {
  const { farmer, loading } = useFarmerAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!farmer) {
    return <Navigate to="/farmer/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteFarmer;
