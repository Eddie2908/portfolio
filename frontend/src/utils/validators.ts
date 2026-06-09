export const validators = {
  required: (value) => (value ? undefined : 'Ce champ est requis'),

  email: (value) => {
    if (!value) return undefined;
    return /^\S+@\S+\.\S+$/.test(value) ? undefined : 'Email invalide';
  },

  minLength: (min) => (value) => {
    if (!value) return undefined;
    return value.length >= min ? undefined : `Minimum ${min} caractères`;
  },

  maxLength: (max) => (value) => {
    if (!value) return undefined;
    return value.length <= max ? undefined : `Maximum ${max} caractères`;
  },

  url: (value) => {
    if (!value) return undefined;
    try {
      new URL(value);
      return undefined;
    } catch {
      return 'URL invalide';
    }
  },

  password: (value) => {
    if (!value) return 'Mot de passe requis';
    if (value.length < 8) return 'Minimum 8 caractères';
    if (!/[A-Z]/.test(value)) return 'Au moins une majuscule';
    if (!/[0-9]/.test(value)) return 'Au moins un chiffre';
    return undefined;
  },
};
