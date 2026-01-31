import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { isValidEmail, isValidPassword } from "../../utils/formatters";
import RegisterForm from "../../components/auth/register_form/RegisterForm";
import patientService from "../../services/patientService";
import styles from "./Register.module.css";
import logoKos from "../../assets/kos-logo.png";

function Register() {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(form) {
    // Validações finais antes de enviar (segurança extra)
    if (!isValidEmail(form.email)) {
      toast.error("Por favor, informe um e-mail válido.");
      return;
    }

    const passwordValidation = isValidPassword(form.password);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = form;
      await patientService.registerWithUser(dataToSend);
      toast.success("Conta criada com sucesso!");
      await login(form.username, form.password);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Erro ao registrar usuário. Tente novamente.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.formWrapper}>
        <button
          onClick={() => navigate("/login")}
          className={styles.backButton}
          type="button"
        >
          &larr; Voltar
        </button>
        <img src={logoKos} alt="Logo Kos" className={styles.logo} />
        <h2 className={styles.pageTitle}>Crie sua conta</h2>
        <RegisterForm onSubmit={handleSubmit} loading={loading} />
        <div className={styles.loginLink}>
          Já tem uma conta?{" "}
          <Link to="/login" className={styles.linkBold}>
            Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;