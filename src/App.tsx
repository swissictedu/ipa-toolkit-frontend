import { gql, useQuery } from '@apollo/client';

const TEST_FIELD_QUERY = gql`
  query TestField {
    testField
  }
`;

function App() {
  const testField = useQuery(TEST_FIELD_QUERY);

  return <div className="App">{testField.data}</div>;
}

export default App;
