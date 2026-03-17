import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy-initialise so the API key is read AFTER dotenv.config() runs
let _genAI;
let _model;

function getModel() {
  if (!_model) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    _model = _genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return _model;
}

/**
 * Send a prompt to Gemini and return the text response.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function askGemini(prompt) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}
