import { useOutlet } from 'react-router';
import ListConferences from './conferences/ListConferences';

export default function VerificationConference() {
  const outlet = useOutlet();

  return outlet ?? <ListConferences />;
}
