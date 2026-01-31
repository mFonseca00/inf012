import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "../../components/ui/text_field/TextField";
import Button from "../../components/ui/button/Button";
import styles from "./Login.module.css";
import logoKos from "../../assets/kos-logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Usuário ou senha incorretos.");
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
          <TextField
            id="username"
            name="username"
            label="Usuário:"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={carregando}
            placeholder="Digite seu usuário"
            required={true}
            autoComplete="username"
          />
          <TextField
            id="password"
            name="password"
            label="Senha:"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={carregando}
            placeholder="Digite sua senha"
            required={true}
            autoComplete="current-password"
          />
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password" className={styles.linkText}>
              Esqueceu a senha?
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
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