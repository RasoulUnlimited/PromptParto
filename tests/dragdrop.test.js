import { rebuildPromptFromReorderedParts } from '../js/utils/dragdrop.js';

test('rebuildPromptFromReorderedParts combines part contents', () => {
  document.body.innerHTML = `
    <div id="outputContainer">
      <div class="prompt-part-box" data-original-content="First"></div>
      <div class="prompt-part-box" data-original-content="Second"></div>
    </div>
    <textarea id="promptInput"></textarea>
  `;
  window.outputContainer = document.getElementById('outputContainer');
  window.promptInput = document.getElementById('promptInput');
  window.updateCharCount = jest.fn();
  window.updateWordCount = jest.fn();
  window.updateTokenCount = jest.fn();
  window.showMessage = jest.fn();
  window.triggerAutoSplit = jest.fn();
  window.saveCurrentStateToHistory = jest.fn();

  rebuildPromptFromReorderedParts();

  expect(window.promptInput.value).toBe('First\n\nSecond');
});