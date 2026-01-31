import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isValidEmail } from "../../utils/formatters";
import userService from "../../services/userService";
import TextField from "../../components/ui/text_field/TextField";
import Button from "../../components/ui/button/Button";
import styles from "./ForgotPassword.module.css";
import logoKos from "../../assets/kos-logo.png";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Por favor, informe seu nome de usuário.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Por favor, informe um email válido.");
      return;
    }

    setLoading(true);
    try {
      await userService.forgotPassword(username, email);
      toast.success("Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage = err.response?.data || "Erro ao enviar email. Tente novamente.";
      toast.error(errorMessage);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <button
          onClick={() => navigate("/login")}
          className={styles.backButton}
          type="button"
        >
          &larr; Voltar
        </button>
        <img src={logoKos} alt="Logo Kos" className={styles.logo} />
        <h2 className={styles.title}>Esqueci a Senha</h2>
        <p className={styles.description}>
          Digite seu nome de usuário e email para receber um link de recuperação de senha.
        </p>
        <form onSubmit={handleSubmit}>
          <TextField
            id="username"
            name="username"
            label="Nome de Usuário:"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="Digite seu nome de usuário"
            required={true}
            autoComplete="username"
          />
          <TextField
            id="email"
            name="email"
            label="Email:"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Digite seu email"
            required={true}
            autoComplete="email"
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Email"}
          </Button>
        </form>
        <div className={styles.loginLink}>
          Lembrou sua senha?{" "}
          <Link to="/login" className={styles.linkBold}>
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;