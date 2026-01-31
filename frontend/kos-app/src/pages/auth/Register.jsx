import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import RegisterForm from "../../components/auth/register_form/RegisterForm";
import styles from "./Register.module.css";
import logoKos from "../../assets/kos-logo.png";

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(form) {
    setError(null);

    // Validação básica
    const requiredUserFields = ["username", "password", "confirmPassword", "email", "cpf", "fullName", "phoneNumber"];
    for (const key of requiredUserFields) {
      if (!form[key]) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
    }

    const requiredAddressFields = ["street", "number", "neighborhood", "city", "state", "zipCode"];
    for (const key of requiredAddressFields) {
      if (!form.address[key]) {
        setError("Por favor, preencha todos os campos de endereço obrigatórios.");
        return;
      }
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // Chamada da API será feita aqui
      // await register(form);
      // navigate("/dashboard");
      console.log("Dados do formulário:", form);
    } catch (err) {
      setError(err.message || "Erro ao registrar usuário");
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
        <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
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