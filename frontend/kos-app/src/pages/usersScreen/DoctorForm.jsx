import React, { useState, useEffect } from "react";
import styles from "./DoctorManager.module.css";
import { toast } from "react-toastify";
import doctorService from "../../services/doctorService";

const DoctorForm = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    crm: "",
    phoneNumber: "",
    speciality: "",
    address: {
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      cep: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validação CRM (Regex do Controller)
    const crmRegex = /^(\d{6}-\d{2}\/[A-Z]{2}|\d{8}[A-Z]{2})$/;
    if (!crmRegex.test(formData.crm)) {
        toast.error("CRM inválido. Formato: 123456-78/UF ou 12345678UF");
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        // Envia para o endpoint PATCH /update
        await doctorService.update(formData);
        toast.success("Dados do médico atualizados!");
      } else {
        // Envia para o endpoint POST /register
        // O backend deve lidar com a lógica de atualizar o Paciente se os dados mudaram
        await doctorService.register(formData);
        toast.success("Médico cadastrado com sucesso!");
      }
      onSuccess(); // Fecha modal e recarrega lista
    } catch (err) {
      toast.error("Erro ao salvar médico. Verifique os dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditing ? "Editar Médico" : "Novo Médico"}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              name="username"
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
              disabled={isEditing} // Geralmente username não muda na edição
              placeholder="Ex: joaosilva"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nome Completo</label>
            <input
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Telefone (Ex: (11) 99999-9999)</label>
            <input
              name="phoneNumber"
              className={styles.input}
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
              required
            />
          </div>

          {/* Dados Médicos */}
          <div className={styles.formGroup}>
            <label className={styles.label}>CRM (Ex: 123456-78/BA)</label>
            <input
              name="crm"
              className={styles.input}
              value={formData.crm}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Especialidade</label>
            <select
              name="speciality"
              className={styles.input}
              value={formData.speciality}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma especialidade</option>
              <option value="ORTOPEDIA">Ortopedia</option>
              <option value="CARDIOLOGIA">Cardiologia</option>
              <option value="GINECOLOGIA">Ginecologia</option>
              <option value="DERMATOLOGIA">Dermatologia</option>
            </select>
          </div>

          {/* Endereço */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Rua</label>
            <input 
              name="address.street" 
              placeholder="Rua"
              className={styles.input} 
              value={formData.address?.street || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))} 
              required
            />
          </div>

          <div className={styles.formGroup}>
             <label className={styles.label}>Número / Complemento</label>
             <div style={{display: 'flex', gap: '10px'}}>
                <input 
                    name="address.number" 
                    placeholder="Número"
                    className={styles.input} 
                    value={formData.address?.number || ""} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, number: e.target.value } }))} 
                />
                <input 
                    name="address.complement" 
                    placeholder="Complemento"
                    className={styles.input} 
                    value={formData.address?.complement || ""} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, complement: e.target.value } }))} 
                />
             </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bairro</label>
            <input 
              name="address.district" 
              placeholder="Bairro"
              className={styles.input} 
              value={formData.address?.district || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, district: e.target.value } }))} 
              required
            />
          </div>

          <div className={styles.formGroup}>
             <label className={styles.label}>Cidade / UF</label>
             <div style={{display: 'flex', gap: '10px'}}>
                <input 
                    name="address.city" 
                    placeholder="Cidade"
                    className={styles.input} 
                    value={formData.address?.city || ""} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} 
                    required
                />
                <input 
                    name="address.state" 
                    placeholder="UF"
                    className={styles.input} 
                    value={formData.address?.state || ""} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))} 
                    style={{width: '80px'}}
                    required
                />
             </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>CEP (Ex: 12345-678)</label>
            <input 
              name="address.cep" 
              placeholder="XXXXX-XXX"
              className={styles.input} 
              value={formData.address?.cep || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, cep: e.target.value } }))} 
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;