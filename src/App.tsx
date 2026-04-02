import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { appPaths } from './app/paths';
import { GuestRoute } from './features/auth/guards/GuestRoute';
import { ProtectedRoute } from './features/auth/guards/ProtectedRoute';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <GuestRoute
              ownerRedirectTo={appPaths.owner.dashboard}
              residentRedirectTo={appPaths.resident.home}
            />
          }
        >
          <Route path={appPaths.auth.ownerLogin} element={<Login />} />
          <Route path={appPaths.auth.ownerRegister} element={<Register />} />
          <Route path={appPaths.auth.residentLogin} element={<ResidentLogin />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['OWNER']}
              redirectTo={appPaths.auth.ownerLogin}
            />
          }
        >
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to={appPaths.owner.dashboard} replace />} />
            <Route path={appPaths.owner.dashboard} element={<Overview />} />
            <Route path={appPaths.owner.properties} element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route
              path={appPaths.owner.rooms}
              element={<div className="p-lg">Halaman Kamar (Kelola via Detail Properti)</div>}
            />
            <Route path={appPaths.owner.residents} element={<Residents />} />
            <Route path={appPaths.owner.finance} element={<Finance />} />
            <Route path={appPaths.owner.invoices} element={<Tagihan />} />
            <Route path={appPaths.owner.payments} element={<Pembayaran />} />
            <Route path={appPaths.owner.expenses} element={<Pengeluaran />} />
            <Route path={appPaths.owner.inventory} element={<Inventaris />} />
            <Route path={appPaths.owner.reports} element={<Laporan />} />
            <Route path={appPaths.owner.settings} element={<Pengaturan />} />
            <Route path={appPaths.owner.billing} element={<Billing />} />
            <Route path={appPaths.owner.maintenance} element={<Maintenance />} />
            <Route path={appPaths.owner.whatsapp} element={<Whatsapp />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['RESIDENT']}
              redirectTo={appPaths.auth.residentLogin}
            />
          }
        >
          <Route element={<ResidentLayout />}>
            <Route path={appPaths.resident.home} element={<ResidentDashboard />} />
            <Route path={appPaths.resident.maintenance} element={<ResidentMaintenance />} />
            <Route path={appPaths.resident.invoices} element={<ResidentInvoices />} />
            <Route path={appPaths.resident.profile} element={<ResidentProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={appPaths.owner.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
