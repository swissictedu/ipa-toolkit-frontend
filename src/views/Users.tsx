import { useOutlet } from 'react-router';
import ListUsers from './users/ListUsers';

export default function Users() {
  const outlet = useOutlet();

  return outlet ?? <ListUsers />;
}
