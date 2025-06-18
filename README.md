# PromptParto

PromptParto is a lightweight web tool for breaking long prompts into manageable parts. The app provides several split strategies, drag and drop support for text files, the ability to save prompts locally, and options to export or import your data.

Open `index.html` in a browser or host the project on GitHub Pages to use it.

## Gemini API key

PromptParto includes optional AI utilities powered by Google's Gemini model.
To use them, you need a Gemini API key which can be created in
**Google AI Studio**. Visit <https://aistudio.google.com/app/apikey>, generate a
new key and copy it.

Open `script.js` and find the `const apiKey` declaration inside the
`sendToAI` function. Replace the empty string with your newly created key:

```javascript
const apiKey = "YOUR_GEMINI_KEY";
```

Until you set this value, all AI related buttons remain inactive and no
requests are sent to the Gemini API.
