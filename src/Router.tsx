import { Navigate, Route, Routes, useLocation } from 'react-router';
import { sessionVar } from './cache';
import ProtectedRoute, { ProtectedRouteProps } from './components/ProtectedRoute';
import CONFIGURATION from './configuration';
import Dashboard from './views/Dashboard';
import SignIn from './views/SignIn';
import SignOut from './views/SignOut';

const defaultProtectedRouteProps: ProtectedRouteProps = {
  isAuthenticated: false,
  authenticationPath: CONFIGURATION.paths.signIn
};

export default function Router() {
  const location = useLocation();

  if (location.pathname === CONFIGURATION.paths.signIn && !!sessionVar()) {
    return <Navigate to={CONFIGURATION.paths.dashboard} />;
  }

  return (
    <Routes>
      <Route path={CONFIGURATION.paths.signIn} element={<SignIn />} />
      <Route path={CONFIGURATION.paths.signOut} element={<SignOut />} />
      <ProtectedRoute {...defaultProtectedRouteProps} isAuthenticated={!!sessionVar()}>
        <Route path={CONFIGURATION.paths.dashboard} element={<Dashboard />} />
      </ProtectedRoute>
    </Routes>
  );
}
