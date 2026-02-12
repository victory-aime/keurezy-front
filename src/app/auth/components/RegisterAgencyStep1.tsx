import { VStack, HStack } from "@chakra-ui/react";
import {
  FormTextInput,
  FormTextArea,
  FormPhonePicker,
  BaseButton,
} from "_components/custom";
import { MODELS, VALIDATION } from "_types/*";
import { Formik } from "formik";
import { IoIosArrowRoundForward } from "react-icons/io";
import { AgencyModule } from "_store/state-management";
import { useRef, useState } from "react";
import { AgencyNameWatcher } from "./AgencyNameWatcher";

export const RegisterAgencyStep1 = ({
  onSubmit = () => {},
  isLoading,
  Next,
}: {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  Next?: any;
}) => {
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const { mutateAsync: verifiedAgencyName } = AgencyModule.checkNameMutation(
    {},
  );

  return (
    <Formik
      enableReinitialize
      initialValues={
        {
          address: "",
          description: "",
          name: "",
          phone: "",
        } as MODELS.ICreateAgency
      }
      onSubmit={onSubmit}
      validationSchema={
        VALIDATION.AGENCY_VALIDATION.createAgencyValidationSchema
      }
      validate={() => {
        const errors: { name?: string } = {};
        if (nameAlreadyExists) {
          errors.name = "Une agence avec ce nom existe déjà";
        }
        return errors;
      }}
    >
      {({ handleSubmit, isValid, dirty }) => (
        <VStack gap={4} mt={3} alignItems={"flex-end"}>
          <FormTextInput
            required
            name={"name"}
            label={"Nom de l'agence"}
            placeholder={"Mon Agence"}
            isVerified={isCheckingName}
          />

          <FormTextArea
            required
            name="description"
            label="Description"
            placeholder="----"
            maxCharacters={500}
          />
          <HStack
            width={"full"}
            flexDirection={{ base: "column-reverse", md: "row-reverse" }}
          >
            <FormPhonePicker
              required
              name="phone"
              label="Telephone"
              listAvailableCountries={["tn"]}
            />
            <FormTextInput
              required
              name="address"
              placeholder="Sousse,Tunis, Monastir"
              label="Addresse"
            />
          </HStack>
          <Next>
            <BaseButton
              mt={4}
              rightIcon={<IoIosArrowRoundForward />}
              isLoading={isLoading}
              disabled={!isValid || !dirty}
              onClick={() => handleSubmit()}
            >
              Continuer
            </BaseButton>
          </Next>
          <AgencyNameWatcher
            verifiedAgencyName={verifiedAgencyName}
            setIsCheckingName={setIsCheckingName}
            setNameAlreadyExists={setNameAlreadyExists}
          />
        </VStack>
      )}
    </Formik>
  );
};
