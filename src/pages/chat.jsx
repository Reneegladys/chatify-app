import { useEffect, useState } from "react";

export default function Chat() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://chatify-api.up.railway.app/secret", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Du är inte auktoriserad att se detta.");
        }

        const data = await response.json();
        setSecret(data.secret);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSecret();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🗨️ Chat</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {secret ? <p><strong>Hemlig data:</strong> {secret}</p> : <p>Laddar...</p>}
    </div>
  );
}
