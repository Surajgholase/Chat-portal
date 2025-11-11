// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/conversations";

/**
 * 🆕 Start a new conversation
 * @param {Object} data - optional { title }
 */
export async function startConversation(data = {}) {
  try {
    const res = await fetch(`${BASE_URL}/start/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to start conversation");
    return await res.json();
  } catch (error) {
    console.error("Error starting conversation:", error);
    throw error;
  }
}

/**
 * 💬 Send a message within an active conversation
 * @param {Object} params
 * @param {number} params.conversation_id - ID of the conversation
 * @param {string} params.content - message text
 * @param {string} params.sender - "user" | "ai"
 */
export async function sendMessage({ conversation_id, content, sender }) {
  try {
    const res = await fetch(`${BASE_URL}/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id, content, sender }),
    });

    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * 📴 End a conversation (optional)
 * @param {number} conversation_id
 */
export async function endConversation(conversation_id) {
  try {
    const res = await fetch(`${BASE_URL}/end/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id }),
    });

    if (!res.ok) throw new Error("Failed to end conversation");
    return await res.json();
  } catch (error) {
    console.error("Error ending conversation:", error);
    throw error;
  }
}

/**
 * 🔍 Get an existing conversation and its messages
 * @param {number} id
 */
export async function getConversation(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch conversation");
    return await res.json();
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
}
