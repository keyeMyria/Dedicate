export default class AppLang {
    selectedLang = 0; //english (en)
    dateFormat = 'DD/MM/YYYY';
    timeFormat = "h:mm a";
    timeSecondsFormat = "h:mm:ss a";

    setLanguage = lang => {
        selectedLang = lang;
    }

    getLanguagePhrases(){

    }
}