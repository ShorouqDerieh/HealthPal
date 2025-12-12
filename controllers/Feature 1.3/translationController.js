
const translationService = require("../../services/Feature 1.3");


async function previewTranslation(req, res) {
  try {
    const { text, source_lang = "auto", target_lang, domain } = req.body;

    

    const result = await translationService.translateText({
      text,
      sourceLang: source_lang,
      targetLang: target_lang,
      domain: domain || "medical",
    });

    return res.status(200).json({
      message: "Translation successful",
      data: result,
    });
  } catch (err) {
    console.error("previewTranslation error:", err);
    return res.status(500).json({
      message: "Failed to translate text",
      error: err.message,
    });
  }
}

module.exports = {
  previewTranslation,
};
