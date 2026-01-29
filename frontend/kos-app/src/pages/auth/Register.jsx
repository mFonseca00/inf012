import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Register.module.css";
import logoKos from "../../assets/kos-logo.png";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);

    if (!username || !password || !confirmPassword) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);
      await register({ username, password });
      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Erro ao criar conta.";
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.formWrapper}>
        <button
          onClick={() => navigate("/login")}
          className={styles.backButton}
          type="button" // Importante para não submeter o formulário
        >
          &larr; Voltar
        </button>

        <img src={logoKos} alt="Logo Kos" className={styles.logo} />

        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
        >
          Crie sua conta
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuário:</label>
            <input
              id="username"
              type="text"
              className={styles.textBox}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={carregando}
              placeholder="Escolha seu usuário"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              className={styles.textBox}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={carregando}
              placeholder="Senha forte"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha:</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.textBox}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={carregando}
              placeholder="Repita a senha"
            />
          </div>

          {erro && (
            <p
              style={{ color: "red", fontSize: "0.9rem", textAlign: "center" }}
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            className={styles.send_button}
            disabled={carregando}
          >
            {carregando ? "Criando conta..." : "Registrar"}
          </button>

          <div className={styles.loginLink}>
            Já tem uma conta?{" "}
            <Link to="/login" className={styles.linkBold}>
              Faça Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
