import { useFormikContext } from "formik";
import { useEffect } from "react";

export const AgencyNameWatcher = ({
  verifiedAgencyName,
  setIsCheckingName,
  setNameAlreadyExists,
}: any) => {
  const { values } = useFormikContext<any>();
  const name = values.name;

  useEffect(() => {
    if (!name) return;
    setIsCheckingName(true);
    setNameAlreadyExists(false);
    const timeout = setTimeout(async () => {
      try {
        const data = await verifiedAgencyName({
          payload: { name },
        });
        if (!data) {
          setNameAlreadyExists(!data);
        } else {
          setNameAlreadyExists(false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsCheckingName(false);
      }
    }, 700);
    return () => clearTimeout(timeout);
  }, [name]);

  return null;
};
