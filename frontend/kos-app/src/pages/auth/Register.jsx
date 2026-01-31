import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import RegisterForm from "../../components/auth/register_form/RegisterForm";
import patientService from "../../services/patientService";
import styles from "./Register.module.css";
import logoKos from "../../assets/kos-logo.png";

function Register() {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(form) {

    // // Validação se os campos obrigatórios foram preenchidos
    // const requiredUserFields = ["username", "password", "confirmPassword", "email", "cpf", "fullName", "phoneNumber"];
    // for (const key of requiredUserFields) {
    //   if (!form[key]) {
    //     toast.error("Por favor, preencha todos os campos obrigatórios.");
    //     return;
    //   }
    // }

    // const requiredAddressFields = ["street", "district", "city", "state", "cep"];
    // for (const key of requiredAddressFields) {
    //   if (!form.address[key] || String(form.address[key]).trim() === "") {
    //     toast.error("Por favor, preencha todos os campos de endereço obrigatórios.");
    //     return;
    //   }
    // }

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // Remove confirmPassword antes de enviar (não faz parte do DTO)
      const { confirmPassword, ...dataToSend } = form;

      // Chamada da API para registrar paciente com usuário
      await patientService.registerWithUser(dataToSend);

      toast.success("Conta criada com sucesso!");

      // Após sucesso, faz login automático
      await login(form.username, form.password);

      // Redireciona para dashboard
      navigate("/dashboard");
    } catch (err) {
      // Trata diferentes tipos de erro
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