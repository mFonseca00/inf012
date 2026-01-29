import React, { useState } from "react";
// Assumindo que você tem o react-router-dom para redirecionar após o login
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logoKos from "../../assets/kos-logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Novos estados para UX e Segurança
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate(); // Hook para redirecionar

  async function handleSubmit(event) {
    event.preventDefault(); // Impede que a página recarregue
    setErro(null);

    // 1. Validação básica no Front
    if (username.length === 0 || password.length === 0) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);

      // 2. Simulação de chamada para API (Substitua pela sua URL real)
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await response.json();

      // O ideal é usar Cookies HttpOnly definidos pelo back-end
      // Evitar localStorage
      window.localStorage.setItem("token", data.token);

      // Redirecionar usuário
      navigate("/dashboard/");
      alert("Login realizado com sucesso!");
    } catch (err) {
      setErro("Usuário ou password incorretos.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <img src={logoKos} alt="Logo Kos" className={styles.logo} />

        {/* O onSubmit vai no form, não no botão */}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuário:</label>
            <input
              id="username"
              type="text"
              className={styles.textBox}
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={carregando} // Desabilita enquanto carrega
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">password:</label>
            <input
              id="password"
              type="password"
              className={styles.textBox}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={carregando}
            />
          </div>

          {/* Exibe mensagem de erro se houver */}
          {erro && <p style={{ color: "red", fontSize: "0.9rem" }}>{erro}</p>}

          <button
            type="submit"
            className={styles.send_button}
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
