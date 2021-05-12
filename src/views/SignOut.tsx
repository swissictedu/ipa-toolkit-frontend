import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { setSessionVar } from '../cache';
import CONFIGURATION from '../configuration';

export default function SignOut() {
  useEffect(() => {
    setSessionVar(undefined);
  });
  return <Navigate to={CONFIGURATION.paths.signIn} />;
}
