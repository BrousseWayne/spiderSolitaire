import { useEffect, useState } from "react";

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/profile", {
          credentials: "include",
        });

        const profile = await res.json();
        console.log(profile);
        setData(profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data ? (
        <div>{JSON.stringify(data, null, 2)}</div>
      ) : (
        <div>Failed to load profile</div>
      )}
    </div>
  );
}
