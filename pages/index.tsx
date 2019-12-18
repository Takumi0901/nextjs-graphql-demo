import { useUsersQuery } from "../gen/actions";
import { useApolloNetworkStatus } from "react-apollo-network-status";

function Home() {
  const status = useApolloNetworkStatus();
  const { data, loading } = useUsersQuery();
  if (status.queryError?.graphQLErrors.length > 0)
    return <p>{status.queryError.graphQLErrors[0].message}</p>;
  if (loading) return <div>Welcome to Next.js!</div>;

  return (
    <div>
      <div>Welcome to Next.js!</div>
      {data.users.map(e => {
        return (
          <div key={e.id}>
            <h2>{e.name}</h2>
            <p>{e.id}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
