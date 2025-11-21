export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASCUAL_BRAVO_EMAIL_REGEX = /@pascualbravo\.edu\.co$/;

export const validatePassword = (password: string) => {
    return {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
};

export const isPasswordValid = (password: string) => {
    const checks = validatePassword(password);
    return Object.values(checks).every(Boolean);
};
