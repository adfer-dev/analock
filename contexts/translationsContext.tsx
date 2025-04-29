import { createContext, useState, type ReactNode } from "react";
import { getSetLanguageTranslations } from "../services/translation.services";

export const TranslationsContext = createContext<TranslationsContext | null>(
  null,
);

interface TranslationsContext {
  translations: Translation;
  setTranslations: React.Dispatch<React.SetStateAction<Translation>>;
}

interface TranslationsProviderProps {
  children: ReactNode;
}

export const TranslationsProvider: React.FC<TranslationsProviderProps> = ({
  children,
}) => {
  const [translations, setTranslations] = useState<Translation>(
    getSetLanguageTranslations(),
  );

  return (
    <TranslationsContext.Provider
      value={{
        translations,
        setTranslations,
      }}
    >
      {children}
    </TranslationsContext.Provider>
  );
};
