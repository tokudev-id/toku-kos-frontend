import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ResidentLayout } from './layouts/ResidentLayout';
import Overview from './pages/Overview';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Residents from './pages/Residents';
import Finance from './pages/Finance';
import Maintenance from './pages/Maintenance';
import Tagihan from './pages/Tagihan';
import Pembayaran from './pages/Pembayaran';
import Pengeluaran from './pages/Pengeluaran';
import Inventaris from './pages/Inventaris';
import Laporan from './pages/Laporan';
import Pengaturan from './pages/Pengaturan';
import Billing from './pages/Billing';
import Whatsapp from './pages/Whatsapp';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResidentLogin from './pages/ResidentPortal/Login';
import ResidentDashboard from './pages/ResidentPortal/Dashboard';
import ResidentMaintenance from './pages/ResidentPortal/Maintenance';
import ResidentInvoices from './pages/ResidentPortal/Invoices';
import ResidentProfile from './pages/ResidentPortal/Profile';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/resident/login" element={!isAuthenticated ? <ResidentLogin /> : <Navigate to="/resident" />} />

        {/* Protected Owner Dashboard Routes */}
        <Route element={(isAuthenticated && user?.role === 'OWNER') ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Overview />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/rooms" element={<div className="p-lg">Halaman Kamar (Kelola via Detail Properti)</div>} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/tagihan" element={<Tagihan />} />
          <Route path="/pembayaran" element={<Pembayaran />} />
          <Route path="/pengeluaran" element={<Pengeluaran />} />
          <Route path="/inventaris" element={<Inventaris />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/whatsapp" element={<Whatsapp />} />
        </Route>

        {/* Protected Resident Portal Routes */}
        <Route element={(isAuthenticated && user?.role === 'RESIDENT') ? <ResidentLayout /> : <Navigate to="/resident/login" />}>
          <Route path="/resident" element={<ResidentDashboard />} />
          <Route path="/resident/maintenance" element={<ResidentMaintenance />} />
          <Route path="/resident/invoices" element={<ResidentInvoices />} />
          <Route path="/resident/profile" element={<ResidentProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user?.role === 'RESIDENT' ? "/resident" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
