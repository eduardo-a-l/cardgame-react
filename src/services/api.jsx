class ApiService {
  constructor() {
    this.serverIp =
      localStorage.getItem("cardgame_server_ip") || "localhost:5000";
  }

  setServerIp(ip) {
    this.serverIp = ip;
    localStorage.setItem("cardgame_server_ip", ip);
  }

  getBaseUrl() {
    return this.serverIp.startsWith("http")
      ? this.serverIp
      : `http://${this.serverIp}`;
  }

  async testConnection() {
    const res = await fetch(`${this.getBaseUrl()}/cartas`);
    return res.ok;
  }

  async login(username, password) {
    const res = await fetch(`${this.getBaseUrl()}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeUsuario: username, senha: password }),
    });
    if (!res.ok) throw new Error();
    return res.json();
  }

  async registrar(username, password) {
    const res = await fetch(`${this.getBaseUrl()}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeUsuario: username, senha: password }),
    });
    if (!res.ok) throw new Error();
    return res.json();
  }

  async getUsuarioById(id) {
    const res = await fetch(`${this.getBaseUrl()}/usuarios/${id}`);
    if (!res.ok) throw new Error();
    return res.json();
  }

  async customizar(idUsuario, avatarUrl, bannerUrl) {
    const res = await fetch(`${this.getBaseUrl()}/usuarios/customizar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUsuario,
        fotoPerfil: avatarUrl || null,
        banner: bannerUrl || null,
      }),
    });
    if (!res.ok) throw new Error();
    return res.json();
  }

  async getRanking() {
    const res = await fetch(`${this.getBaseUrl()}/usuarios/ranking`);
    if (!res.ok) throw new Error();
    return res.json();
  }

  async deletarConta(id) {
    const res = await fetch(`${this.getBaseUrl()}/usuarios/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();
    return true;
  }
}

export const apiService = new ApiService();
