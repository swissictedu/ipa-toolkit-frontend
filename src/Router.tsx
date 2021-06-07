import { Navigate, Route, Routes, useLocation } from 'react-router';
import { sessionVar } from './cache';
import ProtectedRoute, { ProtectedRouteProps } from './components/ProtectedRoute';
import CONFIGURATION from './configuration';
import ConferenceAssignment from './views/conference/ConferenceAssignment';
import ConferenceExport from './views/conference/ConferenceExport';
import ConferenceImport from './views/conference/ConferenceImport';
import ConferenceMeeting from './views/conference/ConferenceMeeting';
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
          <Route path={CONFIGURATION.paths.actions.new} element={<NewUser />} />
          <Route path={CONFIGURATION.paths.actions.edit} element={<EditUser />} />
        </Route>
        <Route path={CONFIGURATION.paths.conference.meeting} element={<ConferenceMeeting />} />
        <Route path={CONFIGURATION.paths.conference.import} element={<ConferenceImport />} />
        <Route path={CONFIGURATION.paths.conference.assignment} element={<ConferenceAssignment />} />
        <Route path={CONFIGURATION.paths.conference.export} element={<ConferenceExport />} />
      </ProtectedRoute>
    </Routes>
  );
}
