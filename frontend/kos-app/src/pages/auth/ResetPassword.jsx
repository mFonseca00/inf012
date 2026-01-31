import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isValidPassword } from "../../utils/formatters";
import userService from "../../services/userService";
import TextField from "../../components/ui/text_field/TextField";
import Button from "../../components/ui/button/Button";
import styles from "./ResetPassword.module.css";
import logoKos from "../../assets/kos-logo.png";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast.error("Token inválido ou ausente.");
      navigate("/login");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value) {
      const validation = isValidPassword(value);
      setPasswordError(validation.valid ? "" : validation.message);
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmError("As senhas não coincidem.");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value && newPassword) {
      setConfirmError(value !== newPassword ? "As senhas não coincidem." : "");
    } else {
      setConfirmError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await userService.resetPassword(token, newPassword, confirmPassword);
      toast.success("Senha redefinida com sucesso! Faça login com sua nova senha.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data || "Erro ao redefinir senha. Tente novamente.";
      toast.error(errorMessage);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <img src={logoKos} alt="Logo Kos" className={styles.logo} />
        <h2 className={styles.title}>Redefinir Senha</h2>
        <p className={styles.description}>
          Digite sua nova senha abaixo.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              id="newPassword"
              name="newPassword"
              label="Nova Senha:"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              disabled={loading}
              placeholder="Digite sua nova senha"
              required={true}
              autoComplete="new-password"
            />
            {passwordError && <span className={styles.errorText}>{passwordError}</span>}
          </div>
          <div>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Senha:"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={loading}
              placeholder="Confirme sua nova senha"
              required={true}
              autoComplete="new-password"
            />
            {confirmError && <span className={styles.errorText}>{confirmError}</span>}
          </div>
          <Button type="submit" variant="primary" disabled={loading || !!passwordError || !!confirmError}>
            {loading ? "Redefinindo..." : "Redefinir Senha"}
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

export default ResetPassword;