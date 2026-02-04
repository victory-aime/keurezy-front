export const passwordValidations = (password = "") => [
  {
    label: "Au moins 12 caractères",
    test: password?.length >= 12,
  },
  {
    label: "Une lettre majuscule (A-Z)",
    test: /[A-Z]/.test(password),
  },
  {
    label: "Une lettre minuscule (a-z)",
    test: /[a-z]/.test(password),
  },
  {
    label: "Un chiffre (0-9)",
    test: /\d/.test(password),
  },
  {
    label: "Un caractère spécial (!@#$%^&*)",
    test: /[!@#$%^&*]/.test(password),
  },
];
