export function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

export function formatCPF(value) {
  const v = onlyDigits(value).slice(0, 11);
  return v
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .replace(/(-\d{2}).+$/, "$1");
}

export function formatPhone(value) {
  const v = onlyDigits(value).slice(0, 11);
  if (v.length <= 10) {
    return v
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return v
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/^(\(\d{2}\) )(\d{5})(\d)/, "$1$2-$3")
    .replace(/(-\d{4}).+$/, "$1");
}

export function formatCEP(value) {
  const v = onlyDigits(value).slice(0, 8);
  return v.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  if (!password || password.length < 8 || password.length > 20) {
    return { valid: false, message: "Senha deve ter entre 8 e 20 caracteres" };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos um número" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos uma letra minúscula" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos uma letra maiúscula" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos um caractere especial" };
  }
  if (/^\d+$/.test(password)) {
    return { valid: false, message: "Senha não pode ser apenas números ou uma sequência numérica" };
  }
  return { valid: true };
}