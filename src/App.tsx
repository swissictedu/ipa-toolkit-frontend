import { gql, useQuery } from '@apollo/client';
import { TestFieldQuery } from '../graphql-types';

const TEST_FIELD_QUERY = gql`
  query TestField {
    testField
  }
`;

function App() {
  const testField = useQuery<TestFieldQuery>(TEST_FIELD_QUERY);

  return <div className="App">{testField.data?.testField}</div>;
}

export default App;
