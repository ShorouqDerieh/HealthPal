
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


class OpenAiTranslationProvider {
  /** 
   * @param {object} params
   * @param {string} params.text
   * @param {'ar'|'en'} params.sourceLang
   * @param {'ar'|'en'} params.targetLang
   * @param {string} [params.domain]
   */
  async translateText({ text, sourceLang, targetLang, domain }) {
    const langName = (code) => (code === "ar" ? "Arabic" : "English");

    const sourceName = langName(sourceLang);
    const targetName = langName(targetLang);

    const instructions =
      "You are a professional medical translator. " +
      "Translate between Arabic and English for medical use. " +
      "Keep the meaning accurate and culturally appropriate. " +
      "Use clear, simple language that patients and doctors can understand. " +
      "Do NOT add explanations or comments. " +
      "Return ONLY the translated text.";

    const inputPrompt =
      `Source language: ${sourceName}\n` +
      `Target language: ${targetName}\n` +
      `Domain: ${domain || "medical"}\n\n` +
      `Text:\n${text}`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini", 
      instructions,
      input: inputPrompt,
    });

 
    const translatedText =
      response.output_text ||
      (response.output &&
        response.output[0] &&
        response.output[0].content &&
        response.output[0].content[0] &&
        response.output[0].content[0].text) ||
      "";

    return {
      translatedText,
      sourceLang,
      targetLang,
      domain,
      provider: "openai",
    };
  }
}

module.exports = { OpenAiTranslationProvider };
