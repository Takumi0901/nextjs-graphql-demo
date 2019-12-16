import { useUsersQuery } from "../gen/actions";

function Home() {
  const { data, loading } = useUsersQuery();
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
