import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import logoKos from "../../assets/kos-logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);

    if (username.length === 0 || password.length === 0) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setErro("Usuário ou senha incorretos.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <img src={logoKos} alt="Logo Kos" className={styles.logo} />

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
              disabled={carregando}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              className={styles.textBox}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={carregando}
              placeholder="Digite sua senha"
            />
            <div className={styles.forgotPassword}>
              <Link to="/forgot-password" className={styles.linkText}>
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          {erro && <p style={{ color: "red", fontSize: "0.9rem" }}>{erro}</p>}

          <button
            type="submit"
            className={styles.send_button}
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.registerLink}>
            Não tem uma conta?{" "}
            <Link to="/register" className={styles.linkBold}>
              Registre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
