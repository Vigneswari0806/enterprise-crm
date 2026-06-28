import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Pipeline from "./pages/Pipeline";
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Emails from "./pages/Emails";
import Landing from "./pages/Landing";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.03, y: -15 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "3.5rem", height: "3.5rem", background: "linear-gradient(135deg,#f97316,#dc2626)",
          borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <i className="ti ti-chart-arrows" style={{ color: "white", fontSize: "1.5rem" }}></i>
        </div>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Loading SalesFlow...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/dashboard" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
        <Route path="/leads" element={<PrivateRoute><PageWrapper><Leads /></PageWrapper></PrivateRoute>} />
        <Route path="/pipeline" element={<PrivateRoute><PageWrapper><Pipeline /></PageWrapper></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><PageWrapper><Customers /></PageWrapper></PrivateRoute>} />
        <Route path="/activities" element={<PrivateRoute><PageWrapper><Activities /></PageWrapper></PrivateRoute>} />
        <Route path="/emails" element={<PrivateRoute><PageWrapper><Emails /></PageWrapper></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><PageWrapper><Reports /></PageWrapper></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><PageWrapper><Settings /></PageWrapper></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
