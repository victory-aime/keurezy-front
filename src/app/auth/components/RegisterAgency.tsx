"use client";
import { BaseStepper, BaseText } from "_components/custom";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { IoDocumentAttach } from "react-icons/io5";
import { ReactNode, useState } from "react";
import { BsFillBuildingsFill } from "react-icons/bs";
import { MODELS } from "_types/*";
import { RegisterAgencyStep1 } from "./RegisterAgencyStep1";
import { RegisterAgencyStep2 } from "./RegisterAgencyStep2";

export const RegisterAgency = ({ token }: { token: string }) => {
  const [, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<MODELS.ICreateAgency>(
    {} as MODELS.ICreateAgency,
  );

  const onSubmitStep1 = (values: MODELS.ICreateAgency) => {
    setFormData({ ...values, userId: token });
  };

  const steps = [
    {
      stepNumber: 0,
      label: "Agence",
      icon: <BsFillBuildingsFill />,
      content: ({ NextTrigger }: { NextTrigger: any }) => (
        <RegisterAgencyStep1
          onSubmit={(values) => onSubmitStep1(values)}
          isLoading={false}
          Next={NextTrigger}
        />
      ),
    },
    {
      stepNumber: 1,
      label: "Documents",
      icon: <IoDocumentAttach />,
      content: ({ PrevTrigger }: { PrevTrigger: ReactNode | any }) => (
        <RegisterAgencyStep2 values={formData} Prev={PrevTrigger} />
      ),
    },
  ];

  const handleStepChange = (step: number) => {
    const index = steps.findIndex((item) => item.stepNumber === step);
    if (index !== -1) {
      setCurrentStep(index);
    }
  };
  return (
    <AuthBoxContainer
      title={"Creer mon agence"}
      description={
        <BaseText>
          Créez votre agence en ligne et commencez à louer vos appartements dès
          aujourd'hui
        </BaseText>
      }
    >
      <BaseStepper steps={steps} goNextSteps={handleStepChange} />
    </AuthBoxContainer>
  );
};
