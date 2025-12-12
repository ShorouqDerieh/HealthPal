
const { TranslationService } = require("./translationService");
const { OpenAiTranslationProvider } = require("./openAiTranslationProvider");


const provider = new OpenAiTranslationProvider();
const translationService = new TranslationService(provider);

module.exports = translationService;
