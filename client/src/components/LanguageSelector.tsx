import './LanguageSelector.css';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ languages, currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="language-selector">
      <label>🌐 Language: </label>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-dropdown"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;

