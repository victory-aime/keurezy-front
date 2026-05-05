import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { useAgencyCheck } from '_context/agency-context';

const MIN_LENGTH = 3;
const DEBOUNCE_DELAY = 600;

export const AgencyNameWatcher = ({ verifiedAgencyName }: any) => {
  const { setIsCheckingName, setNameAlreadyExists } = useAgencyCheck(); // ← depuis le context

  const { values } = useFormikContext<any>();
  const name = values.business.name?.trim();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!name || name.length < MIN_LENGTH) {
      setIsCheckingName(false);
      setNameAlreadyExists(false);
      return;
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      // Sauvegarde l'élément actif avant la requête
      const activeElement = document.activeElement as HTMLElement;

      setIsCheckingName(true);
      setNameAlreadyExists(false);

      try {
        const data = await verifiedAgencyName({
          payload: { name },
          signal: abortRef.current.signal,
        });
        setNameAlreadyExists(!data);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.error(e);
        }
      } finally {
        setIsCheckingName(false);
        activeElement?.focus();
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [name]);

  return null;
};
