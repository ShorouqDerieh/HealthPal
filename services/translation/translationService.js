
class TranslationService {
  /**
   * @param {object} provider 
   * */
  constructor(provider) {
    this.provider = provider;
  }

  /**
   *
   *
   * @param {object} params
   * @param {string} params.text
   * @param {'ar'|'en'|'auto'} [params.sourceLang]
   * @param {'ar'|'en'} params.targetLang
   * @param {string} [params.domain]
   */
  async translateText({ text, sourceLang = "auto", targetLang, domain = "medical" }) {
    if (!text || !text.trim()) {
      throw new Error("Text is required");
    }
    if (!targetLang) {
      throw new Error("Target language is required");
    }

    
    let resolvedSource = sourceLang;
    if (sourceLang === "auto") {
      const hasArabic = /[\u0600-\u06FF]/.test(text);
      resolvedSource = hasArabic ? "ar" : "en";
    }

    
    if (resolvedSource === targetLang) {
      return {
        translatedText: text,
        sourceLang: resolvedSource,
        targetLang,
        domain,
        provider: "passthrough",
      };
    }


    return this.provider.translateText({
      text,
      sourceLang: resolvedSource,
      targetLang,
      domain,
    });
  }
}

module.exports = { TranslationService };
