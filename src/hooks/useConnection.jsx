import { useState, useEffect } from "react";
import { apiService } from "../services/api.jsx";

export function useConnection(showNotification, showPersistentNotification, updateNotification) {
  const [serverIp, setServerIpState] = useState(apiService.serverIp);
  const [isServerConnected, setIsServerConnected] = useState(false);

  const testConnection = async (silent = false) => {
    let notifId = null;
    if (!silent) {
      notifId = showPersistentNotification(
        "Conectando com o Servidor...",
        "loading"
      );
    }
    try {
      const conectado = await apiService.testConnection();
      setIsServerConnected(conectado);
      if (!silent) {
        if (conectado) {
          updateNotification(
            notifId,
            "Conectado com o servidor com sucesso!",
            "success",
            3000
          );
        } else {
          updateNotification(
            notifId,
            "Não foi possível conectar a esse IP.",
            "error",
            4000
          );
        }
      }
      return conectado;
    } catch (err) {
      setIsServerConnected(false);
      if (!silent && notifId) {
        updateNotification(
          notifId,
          "Erro crítico na conexão com a API.",
          "error",
          4000
        );
      }
    }
    return false;
  };

  useEffect(() => {
    apiService.setServerIp(serverIp);
    testConnection(true);
  }, [serverIp]);

  return {
    serverIp,
    setServerIpState,
    isServerConnected,
    setIsServerConnected,
    testConnection,
  };
}
