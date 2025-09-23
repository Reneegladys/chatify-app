const API_URL = "https://chatify-api.up.railway.app"; 


export async function fetchMessages(token) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await res.text();
  console.log("FetchMessages status:", res.status);
  console.log("FetchMessages raw response:", raw);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = { error: "Kunde inte parsa JSON", raw };
  }

  if (!res.ok) {
    console.error("Error fetching messages:", data);
    throw new Error(data.error || "Failed to fetch messages");
  }

  return data;
}


export async function postMessage(token, { text, userId }) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, userId }),
  });

  const raw = await res.text();
  console.log("PostMessage status:", res.status);
  console.log("PostMessage raw response:", raw);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = { error: "Kunde inte parsa JSON", raw };
  }

  if (!res.ok) {
    console.error("Error posting message:", data);
    throw new Error(data.error || "Failed to post message");
  }

  return data;
}


export const deleteMessage = async (messageId, token) => {
  try {
    const res = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw data;

    console.log('DeleteMessage status:', res.status);
    console.log('DeleteMessage raw response:', data);

    return data;
  } catch (err) {
    console.error('Error deleting message:', err);
    throw err;
  }
};
