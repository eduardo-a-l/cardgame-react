class ApiService {
  constructor() {
    this.serverIp =
      localStorage.getItem("cardgame_server_ip") ||
      "cardgame-api-9rj8.onrender.com";
  }

  setServerIp(ip) {
    this.serverIp = ip;
    localStorage.setItem("cardgame_server_ip", ip);
  }

  getBaseUrl() {
    if (this.serverIp.startsWith("http")) {
      return this.serverIp;
    }

    return this.serverIp.includes("localhost") ||
      this.serverIp.includes("127.0.0.1")
      ? `http://${this.serverIp}`
      : `https://${this.serverIp}`;
  }

  async testConnection() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/cartas`);
      return res.ok;
    } catch {
      return false;
    }
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

  async listarBaralhos(userId) {
    const res = await fetch(`${this.getBaseUrl()}/baralhos/usuario/${userId}`);
    if (!res.ok) throw new Error();
    return res.json();
  }

  async criarBaralho(userId) {
    const res = await fetch(`${this.getBaseUrl()}/baralhos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idBaralho: 0,
        nome: "Novo Baralho",
        idUsuario: userId,
        inventarios: [],
      }),
    });
    if (!res.ok) throw new Error();
    return res.json();
  }

  async excluirBaralho(id) {
    const res = await fetch(`${this.getBaseUrl()}/baralhos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();
    return res.ok;
  }

  async atualizarBaralho(id, baralho) {
    const res = await fetch(`${this.getBaseUrl()}/baralhos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(baralho),
    });
    if (!res.ok) throw new Error();
    return res.ok;
  }

  async listarInventario() {
    const res = await fetch(`${this.getBaseUrl()}/inventario`);
    if (!res.ok) throw new Error();
    return res.json();
  }
}

export const apiService = new ApiService();
