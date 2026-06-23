import { useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showNotification = (text, type = "info", duration = 3000) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [
      { id, text, type, persistent: false },
      ...prev,
    ]);
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
    return id;
  };

  const showPersistentNotification = (text, type = "info") => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [{ id, text, type, persistent: true }, ...prev]);
    return id;
  };

  const updateNotification = (id, newText, newType, duration = 3000) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, text: newText, type: newType, persistent: duration === 0 }
          : n,
      ),
    );
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  };

  return {
    notifications,
    showNotification,
    showPersistentNotification,
    updateNotification,
    dismissNotification,
  };
}
