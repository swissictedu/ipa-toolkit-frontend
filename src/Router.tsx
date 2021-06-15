import { Navigate, Route, Routes, useLocation } from 'react-router';
import { sessionVar } from './cache';
import ProtectedRoute, { ProtectedRouteProps } from './components/ProtectedRoute';
import CONFIGURATION from './configuration';
import ConferenceAssignment from './views/verification/ConferenceAssignment';
import ConferenceExport from './views/verification/ConferenceExport';
import ConferenceImport from './views/verification/ConferenceImport';
import ConferenceMeeting from './views/verification/ConferenceMeeting';
import Dashboard from './views/Dashboard';
import SignIn from './views/SignIn';
import SignOut from './views/SignOut';
import Users from './views/Users';
import EditUser from './views/users/EditUser';
import NewUser from './views/users/NewUser';
import VerificationResult from './views/VerificationResult';

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
      <Route path={CONFIGURATION.paths.verification.result} element={<VerificationResult />} />
      <ProtectedRoute {...defaultProtectedRouteProps} isAuthenticated={!!sessionVar()}>
        <Route path={CONFIGURATION.paths.dashboard} element={<Dashboard />} />
        <Route path={CONFIGURATION.paths.users} element={<Users />}>
          <Route path={`/${CONFIGURATION.paths.actions.new}`} element={<NewUser />} />
          <Route path={`/${CONFIGURATION.paths.actions.edit}/:id`} element={<EditUser />} />
        </Route>
        <Route path={CONFIGURATION.paths.verification.meeting} element={<ConferenceMeeting />} />
        <Route path={CONFIGURATION.paths.verification.import} element={<ConferenceImport />} />
        <Route path={CONFIGURATION.paths.verification.assignment} element={<ConferenceAssignment />} />
        <Route path={CONFIGURATION.paths.verification.export} element={<ConferenceExport />} />
      </ProtectedRoute>
    </Routes>
  );
}
