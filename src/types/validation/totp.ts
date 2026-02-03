import * as Yup from "yup";

export const totpValidationSchema = Yup.object({
  totpCode: Yup.array()
    .test(
      "totp-complete",
      "Le code doit contenir 6 chiffres",
      (value) =>
        Array.isArray(value) &&
        value.length === 6 &&
        value.every((v) => /^\d$/.test(v)),
    )
    .required("Code requis"),
});
