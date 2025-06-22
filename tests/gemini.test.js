import { sendToAI } from '../js/utils/gemini.js';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        candidates: [
          {
            content: { parts: [{ text: 'AI answer' }] },
          },
        ],
      }),
  })
);

test('sendToAI populates response textarea', async () => {
  document.body.innerHTML = `
    <input id="apiKeyInput" value="key" />
    <textarea id="aiResponseTextarea"></textarea>
    <div id="aiLoadingSpinner" class="hidden"></div>
    <button id="copyAiResponseButton"></button>
    <button id="insertAiResponseButton"></button>
    <button id="aiSendToAIButton"></button>
    <input id="aiPromptInput" value="cmd" />
    <input id="aiTemperatureInput" value="0.5" />
    <input id="aiTopPInput" value="0.9" />
    <input id="aiResponseCharLimitInput" value="100" />
  `;

  window.apiKeyInput = document.getElementById('apiKeyInput');
  window.aiResponseTextarea = document.getElementById('aiResponseTextarea');
  window.aiLoadingSpinner = document.getElementById('aiLoadingSpinner');
  window.copyAiResponseButton = document.getElementById('copyAiResponseButton');
  window.insertAiResponseButton = document.getElementById('insertAiResponseButton');
  window.aiSendToAIButton = document.getElementById('aiSendToAIButton');
  window.aiPromptInput = document.getElementById('aiPromptInput');
  window.aiTemperatureInput = document.getElementById('aiTemperatureInput');
  window.aiTopPInput = document.getElementById('aiTopPInput');
  window.aiResponseCharLimitInput = document.getElementById('aiResponseCharLimitInput');
  window.updateAiResponseCounts = jest.fn();
  window.showMessage = jest.fn();

  await sendToAI('text', 'cmd');

  expect(global.fetch).toHaveBeenCalled();
  expect(window.aiResponseTextarea.value).toBe('AI answer');
});