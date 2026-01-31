package com.ifba.clinic.util;

public class Formatters {

 
    public static String onlyDigits(String value) {
        if (value == null) return null;
        return value.replaceAll("\\D", "");
    }

    public static String formatCPF(String cpf) {
        String digits = onlyDigits(cpf);
        if (digits == null || digits.length() != 11) return cpf;
        return digits.replaceFirst("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
    }

    public static String formatPhone(String phone) {
        String digits = onlyDigits(phone);
        if (digits == null) return phone;
        if (digits.length() == 11) {
            return digits.replaceFirst("(\\d{2})(\\d{5})(\\d{4})", "($1) $2-$3");
        } else if (digits.length() == 10) {
            return digits.replaceFirst("(\\d{2})(\\d{4})(\\d{4})", "($1) $2-$3");
        }
        return phone;
    }

    public static String formatCEP(String cep) {
        String digits = onlyDigits(cep);
        if (digits == null || digits.length() != 8) return cep;
        return digits.replaceFirst("(\\d{5})(\\d{3})", "$1-$2");
    }

    public static String formatCRM(String crm) {
        if (crm == null) return null;
        // Remove espaços e converte para maiúsculo
        crm = crm.trim().toUpperCase();
        // Se já tiver barra, retorna como está
        if (crm.contains("/")) return crm;
        // Extrai números e letras do estado
        String digits = crm.replaceAll("[^0-9]", "");
        String state = crm.replaceAll("[^A-Z]", "");
        if (digits.isEmpty() || state.length() != 2) return crm;
        return digits + "/" + state;
    }
}