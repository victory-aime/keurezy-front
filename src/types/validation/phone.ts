import * as Yup from "yup";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const phoneSchema = (msg?: string) =>
  Yup.string()
    .required(msg ?? "Numero de téléphone obligatoire")
    .test("is-valid-phone", msg ?? "Numero de telephone invalide", (value) => {
      if (!value) return false;
      try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(value));
      } catch {
        return false;
      }
    });
