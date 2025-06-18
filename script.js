document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const promptInput = document.getElementById('promptInput');
    const splitButton = document.getElementById('splitButton');
    const copyAllButton = document.getElementById('copyAllButton');
    const undoButton = document.getElementById('undoButton'); // New
    const redoButton = document.getElementById('redoButton'); // New
    const loadExampleButton = document.getElementById('loadExampleButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const clearOutputOnlyButton = document.getElementById('clearOutputOnlyButton');
    const uploadFileButton = document.getElementById('uploadFileButton');
    const exportTextButton = document.getElementById('exportTextButton');
    const exportMarkdownButton = document.getElementById('exportMarkdownButton'); // New
    const exportJsonButton = document.getElementById('exportJsonButton');
    const outputContainer = document.getElementById('outputContainer');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const charCountDisplay = document.getElementById('charCount');
    const wordCountDisplay = document.getElementById('wordCount');
    const tokenCountDisplay = document.getElementById('tokenCount');
    const autoSaveStatus = document.getElementById('autoSaveStatus');
    const maxCharsPerPartInput = document.getElementById('maxCharsPerPart');
    const splitStrategySelect = document.getElementById('splitStrategy');
    const customDelimiterContainer = document.getElementById('customDelimiterContainer');
    const customDelimiterInput = document.getElementById('customDelimiter');
    const regexDelimiterContainer = document.getElementById('regexDelimiterContainer');
    const regexDelimiterInput = document.getElementById('regexDelimiter');
    const partPrefixInput = document.getElementById('partPrefix');
    const partSuffixInput = document.getElementById('partSuffix');
    const includeDelimitersInOutputCheckbox = document.getElementById('includeDelimitersInOutput');
    const savePromptButton = document.getElementById('savePromptButton');
    const loadPromptDropdownToggle = document.getElementById('loadPromptDropdownToggle');
    const loadPromptDropdownMenu = document.getElementById('loadPromptDropdownMenu');
    const savedPromptsList = document.getElementById('savedPromptsList');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeText = document.getElementById('darkModeText');

    // Prompt History elements
    const promptHistoryDropdownToggle = document.getElementById('promptHistoryDropdownToggle');
    const promptHistoryDropdownMenu = document.getElementById('promptHistoryDropdownMenu');
    const historyList = document.getElementById('historyList');
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    // Share and Data Management buttons
    const shareButton = document.getElementById('shareButton');
    const exportAllDataButton = document.getElementById('exportAllDataButton');
    const importAllDataButton = document.getElementById('importAllDataButton');
    const importFileInput = document.getElementById('importFileInput');

    // Prompt Templates elements
    const templateDropdownToggle = document.getElementById('templateDropdownToggle'); // New
    const templateDropdownMenu = document.getElementById('templateDropdownMenu'); // New
    const templateList = document.getElementById('templateList'); // New
    const addTemplateButton = document.getElementById('addTemplateButton');

    const aiConvertMarkdownButton = document.getElementById('aiConvertMarkdownButton');
    const aiConvertJsonButton = document.getElementById('aiConvertJsonButton');
    const cleanEmptyLinesButton = document.getElementById('cleanEmptyLinesButton');
    const trimWhitespaceButton = document.getElementById('trimWhitespaceButton');
    const lowercaseButton = document.getElementById('lowercaseButton');
    const uppercaseButton = document.getElementById('uppercaseButton');
    const toggleCompactViewButton = document.getElementById('toggleCompactViewButton');
    const compactViewText = document.getElementById('compactViewText');


    // AI Modal elements
    const aiResponseModal = document.getElementById('aiResponseModal');
    const closeAiModalButton = document.getElementById('closeAiModal');
    const aiLoadingSpinner = document.getElementById('aiLoadingSpinner');
    const aiPromptInput = document.getElementById('aiPromptInput');
    const aiResponseTextarea = document.getElementById('aiResponseTextarea');
    const aiSummarizeButton = document.getElementById('aiSummarizeButton');
    const aiRephraseButton = document.getElementById('aiRephraseButton');
    const aiElaborateButton = document.getElementById('aiElaborateButton');
    const aiConciseButton = document.getElementById('aiConciseButton');
    const aiExpandButton = document.getElementById('aiExpandButton');
    const aiToneFormalButton = document.getElementById('aiToneFormalButton');
    const aiToneInformalButton = document.getElementById('aiToneInformalButton');
    const aiTranslateEnButton = document.getElementById('aiTranslateEnButton');
    const aiTranslateFaButton = document.getElementById('aiTranslateFaButton');
    const aiSendToAIButton = document.getElementById('aiSendToAIButton');
    const copyAiResponseButton = document.getElementById('copyAiResponseButton');
    const insertAiResponseButton = document.getElementById('insertAiResponseButton');
    const aiRefiningPartInfo = document.getElementById('aiRefiningPartInfo');
    const clearAiResponseButton = document.getElementById('clearAiResponseButton');
    const aiTemperatureInput = document.getElementById('aiTemperature'); // New
    const aiTopPInput = document.getElementById('aiTopP'); // New
    const aiResponseCharLimitInput = document.getElementById('aiResponseCharLimit'); // New
    const apiKeyInput = document.getElementById('apiKeyInput'); // New
    
    // AI Response text area counts and bar
    const aiCharCountDisplay = document.getElementById('aiCharCount');
    const aiWordCountDisplay = document.getElementById('aiWordCount');
    const aiTokenCountDisplay = document.getElementById('aiTokenCount');
    const aiResponseCharLimitBarContainer = document.getElementById('aiResponseCharLimitBarContainer');
    const aiResponseCharLimitBar = document.getElementById('aiResponseCharLimitBar');

    // Drag and Drop elements
    const dragDropZone = promptInput; // The textarea is also the drag-drop zone
    const dragDropOverlay = document.getElementById('dragDropOverlay');
    const fileInput = document.getElementById('fileInput');

    // Custom Confirmation Modal elements
    const confirmModal = document.getElementById('confirmationModal');
    const confirmTitle = document.getElementById('confirmationTitle');
    const confirmMessage = document.getElementById('confirmationMessage');
    const closeConfirmModalButton = document.getElementById('closeConfirmationModal');
    const cancelConfirmButton = document.getElementById('cancelConfirmationButton');
    const confirmActionButton = document.getElementById('confirmActionButton');
    let confirmationCallback = null;

    // Generic Input Modal elements
    const inputModal = document.getElementById('inputModal');
    const inputModalTitle = document.getElementById('inputModalTitle');
    const inputModalMessage = document.getElementById('inputModalMessage');
    const inputModalTextInput = document.getElementById('inputModalTextInput');
    const inputModalCloseButton = document.getElementById('inputModalClose'); // New: Close button for input modal
    const inputModalCancelButton = document.getElementById('inputModalCancelButton');
    const inputModalConfirmButton = document.getElementById('inputModalConfirmButton');
    let inputModalCallback = null;

    // Default constants for splitting logic
    let MAX_CHARS_PER_PART = parseInt(maxCharsPerPartInput.value, 10) || 3800;
    const MIN_CHARS_FOR_NEW_SPLIT = 100;

    // Auto-save interval
    const AUTO_SAVE_INTERVAL = 5000; // Save every 5 seconds

    // --- Settings Management ---
    // Object to hold all configurable settings
    const settings = {
        maxCharsPerPart: MAX_CHARS_PER_PART,
        splitStrategy: 'auto',
        customDelimiter: '',
        regexDelimiter: '',
        partPrefix: '',
        partSuffix: '',
        includeDelimitersInOutput: false,
        theme: 'light',
        aiTemperature: parseFloat(aiTemperatureInput.value), // New
        aiTopP: parseFloat(aiTopPInput.value), // New
        aiResponseCharLimit: parseInt(aiResponseCharLimitInput.value, 10) // New
    };

    /**
     * Loads settings from local storage and applies them to the UI.
     * تنظیمات را از حافظه محلی بارگذاری کرده و به رابط کاربری اعمال می‌کند.
     */
    function loadSettings() {
        try {
            const storedSettings = JSON.parse(localStorage.getItem('promptPartoSettings'));
            if (storedSettings) {
                for (const key in settings) {
                    if (storedSettings.hasOwnProperty(key)) {
                        settings[key] = storedSettings[key];
                    }
                }

                maxCharsPerPartInput.value = settings.maxCharsPerPart;
                splitStrategySelect.value = settings.splitStrategy;
                customDelimiterInput.value = settings.customDelimiter;
                regexDelimiterInput.value = settings.regexDelimiter;
                partPrefixInput.value = settings.partPrefix;
                partSuffixInput.value = settings.partSuffix;
                includeDelimitersInOutputCheckbox.checked = settings.includeDelimitersInOutput;
                aiTemperatureInput.value = settings.aiTemperature; // New
                aiTopPInput.value = settings.aiTopP; // New
                aiResponseCharLimitInput.value = settings.aiResponseCharLimit; // New
                applyTheme(settings.theme);
            } else {
                const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDarkMode ? 'dark' : 'light');
            }
        } catch (e) {
            console.error('Error loading settings from localStorage:', e);
            applyTheme('light');
        }
        const storedApiKey = localStorage.getItem('promptPartoApiKey');
        if (storedApiKey && apiKeyInput) {
            apiKeyInput.value = storedApiKey;
        }
        updateMaxCharsPerPart();
        toggleDelimiterInputs();
    }

    /**
     * Saves current settings to local storage.
     * تنظیمات فعلی را در حافظه محلی ذخیره می‌کند.
     */
    function saveSettings() {
        settings.maxCharsPerPart = parseInt(maxCharsPerPartInput.value, 10);
        settings.splitStrategy = splitStrategySelect.value;
        settings.customDelimiter = customDelimiterInput.value;
        settings.regexDelimiter = regexDelimiterInput.value;
        settings.partPrefix = partPrefixInput.value;
        settings.partSuffix = partSuffixInput.value;
        settings.includeDelimitersInOutput = includeDelimitersInOutputCheckbox.checked;
        settings.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        settings.aiTemperature = parseFloat(aiTemperatureInput.value); // New
        settings.aiTopP = parseFloat(aiTopPInput.value); // New
        settings.aiResponseCharLimit = parseInt(aiResponseCharLimitInput.value, 10); // New
        try {
            localStorage.setItem('promptPartoSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings to localStorage:', e);
            showMessage('ذخیره تنظیمات با مشکل مواجه شد. حافظه مرورگر پر است؟', 'error');
        }
    }

    // --- Dark Mode Logic ---
    /**
     * Applies the selected theme (dark or light) to the body.
     * تم انتخاب شده (تاریک یا روشن) را به بدنه اعمال می‌کند.
     * @param {string} theme - 'dark' or 'light'.
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            darkModeText.textContent = 'حالت روشن';
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('dark');
            darkModeText.textContent = 'حالت تاریک';
            darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
    }

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        saveSettings();
    });

    // --- Undo/Redo Logic ---
    const PROMPT_HISTORY_STACK_LIMIT = 50; // Limit undo/redo history
    let promptHistoryStack = []; // Stores the state of promptInput.value
    let currentHistoryIndex = -1; // Index of the current state in the stack

    /**
     * Saves the current prompt input value to the undo/redo history stack.
     * مقدار فعلی ورودی پرامپت را در پشته تاریخچه Undo/Redo ذخیره می‌کند.
     */
    function saveCurrentStateToHistory() {
        const currentContent = promptInput.value;
        // If we are not at the end of the history, truncate it
        if (currentHistoryIndex < promptHistoryStack.length - 1) {
            promptHistoryStack = promptHistoryStack.slice(0, currentHistoryIndex + 1);
        }
        // Add new state
        promptHistoryStack.push(currentContent);
        // Limit history size
        if (promptHistoryStack.length > PROMPT_HISTORY_STACK_LIMIT) {
            promptHistoryStack.shift(); // Remove the oldest state
        }
        currentHistoryIndex = promptHistoryStack.length - 1;
        updateUndoRedoButtons();
    }

    /**
     * Updates the disabled state of Undo and Redo buttons.
     * وضعیت غیرفعال بودن دکمه‌های Undo و Redo را به‌روزرسانی می‌کند.
     */
    function updateUndoRedoButtons() {
        undoButton.disabled = currentHistoryIndex <= 0;
        redoButton.disabled = currentHistoryIndex >= promptHistoryStack.length - 1;

        if (undoButton.disabled) undoButton.classList.add('opacity-50', 'cursor-not-allowed');
        else undoButton.classList.remove('opacity-50', 'cursor-not-allowed');

        if (redoButton.disabled) redoButton.classList.add('opacity-50', 'cursor-not-allowed');
        else redoButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    /**
     * Performs an undo operation.
     * عملیات Undo را انجام می‌دهد.
     */
    function undo() {
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            promptInput.value = promptHistoryStack[currentHistoryIndex];
            updateCharCount();
            updateWordCount();
            updateTokenCount();
            triggerAutoSplit(); // Re-split based on undone content
            updateUndoRedoButtons();
            showMessage('عملیات واگرد انجام شد.', 'info', 1500);
        } else {
            showMessage('هیچ عملیات قابل واگردی وجود ندارد.', 'info', 1500);
        }
    }

    /**
     * Performs a redo operation.
     * عملیات Redo را انجام می‌دهد.
     */
    function redo() {
        if (currentHistoryIndex < promptHistoryStack.length - 1) {
            currentHistoryIndex++;
            promptInput.value = promptHistoryStack[currentHistoryIndex];
            updateCharCount();
            updateWordCount();
            updateTokenCount();
            triggerAutoSplit(); // Re-split based on redone content
            updateUndoRedoButtons();
            showMessage('عملیات بازگردانی انجام شد.', 'info', 1500);
        } else {
            showMessage('هیچ عملیات قابل بازگردانی وجود ندارد.', 'info', 1500);
        }
    }

    // Add event listeners for Undo/Redo buttons
    undoButton.addEventListener('click', undo);
    redoButton.addEventListener('click', redo);


    // --- Utility Functions ---

    /**
     * Shows a custom confirmation modal.
     * یک پنجره مودال تأیید سفارشی را نمایش می‌دهد.
     * @param {string} message - The message to display.
     * @param {function} onConfirmCallback - Callback function if 'Yes' is clicked.
     * @param {string} [title='تأیید'] - Optional title for the modal.
     */
    function showConfirmationModal(message, onConfirmCallback, title = 'تأیید') {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        confirmationCallback = onConfirmCallback;
        confirmModal.classList.remove('hidden');
        confirmModal.setAttribute('aria-modal', 'true'); // Add aria-modal
        confirmModal.setAttribute('role', 'dialog'); // Add role dialog
    }

    /**
     * Hides the custom confirmation modal.
     * پنجره مودال تأیید سفارشی را پنهان می‌کند.
     */
    function hideConfirmationModal() {
        confirmModal.classList.add('hidden');
        confirmationCallback = null;
        confirmModal.removeAttribute('aria-modal'); // Remove aria-modal
        confirmModal.removeAttribute('role'); // Remove role dialog
    }

    // Event listeners for custom confirmation modal buttons
    closeConfirmModalButton.addEventListener('click', hideConfirmationModal);
    cancelConfirmButton.addEventListener('click', hideConfirmationModal);
    confirmActionButton.addEventListener('click', () => {
        if (confirmationCallback) {
            confirmationCallback();
        }
        hideConfirmationModal();
    });

    /**
     * Shows a generic input modal.
     * یک پنجره مودال ورودی عمومی را نمایش می‌دهد.
     * @param {string} title - The title of the modal.
     * @param {string} message - The message/instruction for the user.
     * @param {string} placeholder - The placeholder text for the input field.
     * @param {string} initialValue - Initial value for the input field.
     * @param {function(string): void} onConfirmCallback - Callback function with the input value if 'Confirm' is clicked.
     * @param {string} confirmText - Text for the confirm button.
     * @param {string} cancelText - Text for the cancel button.
     */
    function showInputModal(title, message, placeholder, initialValue, onConfirmCallback, confirmText = 'تأیید', cancelText = 'لغو') {
        inputModalTitle.textContent = title;
        inputModalMessage.textContent = message;
        inputModalTextInput.placeholder = placeholder;
        inputModalTextInput.value = initialValue;
        inputModalConfirmButton.textContent = confirmText;
        inputModalCancelButton.textContent = cancelText;
        inputModalCallback = onConfirmCallback;
        inputModal.classList.remove('hidden');
        inputModalTextInput.focus(); // Focus the input field
        inputModalTextInput.select(); // Select existing text for easy editing
    }

    /**
     * Hides the generic input modal.
     * پنجره مودال ورودی عمومی را پنهان می‌کند.
     */
    function hideInputModal() {
        inputModal.classList.add('hidden');
        inputModalCallback = null;
        inputModalTextInput.value = ''; // Clear input on hide
    }

    // Event listeners for generic input modal buttons
    inputModalCloseButton.addEventListener('click', hideInputModal); // New: Close button for input modal
    inputModalCancelButton.addEventListener('click', hideInputModal);
    inputModalConfirmButton.addEventListener('click', () => {
        if (inputModalCallback) {
            inputModalCallback(inputModalTextInput.value.trim());
        }
        hideInputModal();
    });


    /**
     * Updates the MAX_CHARS_PER_PART based on user input and validates it.
     * MAX_CHARS_PER_PART را بر اساس ورودی کاربر به روز کرده و اعتبار سنجی می‌کند.
     */
    function updateMaxCharsPerPart() {
        let newValue = parseInt(maxCharsPerPartInput.value, 10);
        if (isNaN(newValue) || newValue < MIN_CHARS_FOR_NEW_SPLIT) {
            newValue = 3800;
            maxCharsPerPartInput.value = newValue;
            showMessage('حداکثر کاراکتر باید یک عدد معتبر و حداقل 100 باشد. به مقدار پیش‌فرض تنظیم شد.', 'error');
        }
        MAX_CHARS_PER_PART = newValue;
        saveSettings();
    }

    /**
     * Displays a message in the message box.
     * پیامی را در جعبه پیام نمایش می‌دهد.
     * @param {string} message - The message to display.
     * @param {string} type - 'success', 'error', or 'info'.
     * @param {number} [duration=5000] - Duration in milliseconds to show the message.
     */
    function showMessage(message, type, duration = 5000) {
        messageText.textContent = message;
        messageBox.className = 'p-4 rounded-lg relative mt-6';
        messageBox.classList.add('border');

        if (type === 'success') {
            messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        } else if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else if (type === 'info') {
             messageBox.classList.add('bg-blue-100', 'border-blue-400', 'text-blue-700');
        }
        messageBox.classList.remove('hidden');
        // Clear any existing timeout before setting a new one
        if (messageBox.timeoutId) {
            clearTimeout(messageBox.timeoutId);
        }
        messageBox.timeoutId = setTimeout(() => {
            messageBox.classList.add('hidden');
            messageBox.timeoutId = null; // Clear the timeout ID
        }, duration);
    }

    /**
     * Copies text to the clipboard and provides visual feedback on the button.
     * متن را در کلیپ‌بورد کپی کرده و بازخورد بصری روی دکمه ارائه می‌دهد.
     * @param {string} text - The text to copy.
     * @param {string} [feedbackName='متن'] - Optional: Name of the item being copied for feedback message.
     * @param {HTMLElement} [buttonElement] - Optional: The button element to provide visual feedback.
     */
    function copyTextToClipboard(text, feedbackName = 'متن', buttonElement = null) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showMessage(`${feedbackName} با موفقیت کپی شد!`, 'success');

            if (buttonElement) {
                const originalText = buttonElement.innerHTML;
                buttonElement.classList.add('copied');
                buttonElement.innerHTML = `<i class="fas fa-check ml-2"></i> کپی شد!`;
                setTimeout(() => {
                    buttonElement.innerHTML = originalText;
                    buttonElement.classList.remove('copied');
                }, 1500);
            }

        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage(`خطا در کپی کردن ${feedbackName}.`, 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * Updates the character count display for the main prompt input.
     * نمایشگر تعداد کاراکترها را برای ورودی اصلی پرامپت به روز می‌کند.
     */
    function updateCharCount() {
        const count = promptInput.value.length;
        charCountDisplay.textContent = `کاراکترها: ${count}`;

        if (count > MAX_CHARS_PER_PART) {
            charCountDisplay.classList.remove('text-gray-500', 'dark:text-gray-400');
            charCountDisplay.classList.add('text-red-600', 'font-bold');
        } else {
            charCountDisplay.classList.remove('text-red-600', 'font-bold');
            charCountDisplay.classList.add('text-gray-500', 'dark:text-gray-400');
        }
    }

    /**
     * Updates the word count display for the main prompt input.
     * نمایشگر تعداد کلمات را برای ورودی اصلی پرامپت به روز می‌کند.
     */
    function updateWordCount() {
        const text = promptInput.value;
        const words = text.match(/\b\w+\b/g);
        const count = words ? words.length : 0;
        wordCountDisplay.textContent = `کلمات: ${count}`;
    }

    /**
     * Counts tokens (approximation) for the main prompt input.
     * تعداد توکن‌ها را (تخمینی) برای ورودی اصلی پرامپت شمارش می‌کند.
     * @param {string} text - The text to count tokens for.
     * @returns {number} Estimated token count.
     */
    function countTokens(text) {
        // Simple approximation: 1 token ~ 4 characters, or ~0.75 words for English.
        // For Persian, tokenization is more complex. This is a very rough estimation based on words.
        const words = text.match(/\b\w+\b/g);
        const wordCount = words ? words.length : 0;
        return Math.ceil(wordCount * 1.5); // A slightly higher multiplier for safer estimation
    }

    /**
     * Updates the token count display for the main prompt input.
     * نمایشگر تعداد توکن‌ها را برای ورودی اصلی پرامپت به روز می‌کند.
     */
    function updateTokenCount() {
        const tokens = countTokens(promptInput.value);
        tokenCountDisplay.textContent = `توکن‌ها (تخمینی): ${tokens}`;
    }

    /**
     * Updates the character count display for the AI response textarea.
     * نمایشگر تعداد کاراکترها را برای ناحیه متنی پاسخ هوش مصنوعی به روز می‌کند.
     */
    function updateAiCharCount() {
        const count = aiResponseTextarea.value.length;
        aiCharCountDisplay.textContent = `کاراکترها: ${count}`;

        const limit = settings.aiResponseCharLimit > 0 ? settings.aiResponseCharLimit : MAX_CHARS_PER_PART; // Use AI limit if set, else main limit
        const percentage = (count / limit) * 100;
        aiResponseCharLimitBar.style.width = `${Math.min(100, percentage)}%`;
        // Remove existing classes first
        aiResponseCharLimitBar.classList.remove('warning', 'danger');
        if (percentage > 90) {
            aiResponseCharLimitBar.classList.add('danger');
        } else if (percentage > 70) {
            aiResponseCharLimitBar.classList.add('warning');
        }
    }

    /**
     * Updates the word count display for the AI response textarea.
     * نمایشگر تعداد کلمات را برای ناحیه متنی پاسخ هوش مصنوعی به روز می‌کند.
     */
    function updateAiWordCount() {
        const text = aiResponseTextarea.value;
        const words = text.match(/\b\w+\b/g);
        const count = words ? words.length : 0;
        aiWordCountDisplay.textContent = `کلمات: ${count}`;
    }

    /**
     * Updates the token count display for the AI response textarea.
     * نمایشگر تعداد توکن‌ها را برای ناحیه متنی پاسخ هوش مصنوعی به روز می‌کند.
     */
    function updateAiTokenCount() {
        const tokens = countTokens(aiResponseTextarea.value);
        aiTokenCountDisplay.textContent = `توکن‌ها (تخمینی): ${tokens}`;
    }

    /**
     * Updates all counts for the AI response textarea.
     * تمام شمارشگرها را برای ناحیه متنی پاسخ هوش مصنوعی به روز می‌کند.
     */
    function updateAiResponseCounts() {
        updateAiCharCount();
        updateAiWordCount();
        updateAiTokenCount();
    }


    /**
     * Clears the prompt input and output area.
     * ورودی پرامپت و ناحیه خروجی را پاک می‌کند.
     */
    function clearAll() {
        promptInput.value = '';
        outputContainer.innerHTML = '';
        updateCharCount();
        updateWordCount();
        updateTokenCount(); // Clear token count
        copyAllButton.disabled = true;
        copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportTextButton.disabled = true;
        exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportMarkdownButton.disabled = true; // New
        exportMarkdownButton.classList.add('opacity-50', 'cursor-not-allowed'); // New
        exportJsonButton.disabled = true;
        exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
        clearOutputOnlyButton.disabled = true;
        clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');

        showMessage('همه چیز پاک شد.', 'success');
        saveCurrentPromptState(); // Save empty state to history
    }

    /**
     * Clears only the output area, keeping the input prompt.
     * فقط ناحیه خروجی را پاک می‌کند و پرامپت ورودی را نگه می‌دارد.
     */
    function clearOutputOnly() {
        outputContainer.innerHTML = '';
        copyAllButton.disabled = true;
        copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportTextButton.disabled = true;
        exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportMarkdownButton.disabled = true; // New
        exportMarkdownButton.classList.add('opacity-50', 'cursor-not-allowed'); // New
        exportJsonButton.disabled = true;
        exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
        clearOutputOnlyButton.disabled = true;
        clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');
        showMessage('خروجی پاک شد.', 'info');
    }

    /**
     * Exports all split parts to a single text file.
     * تمام بخش‌های تقسیم‌شده را به یک فایل متنی واحد خروجی می‌دهد.
     */
    function exportTextFile() {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای خروجی گرفتن وجود ندارد.', 'error');
            return;
        }
        const combinedText = promptParts.join('\n\n--- PART BREAK ---\n\n');
        
        const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt_parts.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('بخش‌ها با موفقیت در یک فایل متنی ذخیره شدند.', 'success');
    }

    /**
     * Exports all split parts to a single Markdown file.
     * تمام بخش‌های تقسیم‌شده را به یک فایل Markdown واحد خروجی می‌دهد.
     */
    function exportMarkdownFile() {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای خروجی گرفتن وجود ندارد.', 'error');
            return;
        }
        // Join parts with a clear Markdown separator, e.g., "---" or "### Part X"
        const combinedMarkdown = promptParts.map((part, index) => {
            return `## بخش ${index + 1}\n\n${part}\n`; // Example: Add a Markdown heading for each part
        }).join('\n---\n\n'); // Use a horizontal rule as a break

        const blob = new Blob([combinedMarkdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt_parts.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('بخش‌ها با موفقیت در یک فایل مارک‌داون ذخیره شدند.', 'success');
    }

    /**
     * Exports all split parts to a JSON file.
     * تمام بخش‌های تقسیم‌شده را به یک فایل JSON خروجی می‌دهد.
     */
    function exportJsonFile() {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای خروجی گرفتن وجود ندارد.', 'error');
            return;
        }
        const jsonOutput = promptParts.map((part, index) => ({
            part_number: index + 1,
            content: part,
            length: part.length
        }));
        
        const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt_parts.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('بخش‌ها با موفقیت در یک فایل JSON ذخیره شدند.', 'success');
    }

    // --- Text Pre-processing Helpers ---
    function cleanEmptyLines() {
        promptInput.value = promptInput.value.replace(/^\s*$(?:\r?\n)/gm, "");
        updateCharCount();
        updateWordCount();
        updateTokenCount();
        triggerAutoSplit();
        saveCurrentStateToHistory();
        showMessage('خطوط خالی حذف شد.', 'success', 1500);
    }

    function trimExtraWhitespace() {
        const trimmed = promptInput.value.split(/\n/).map(line => line.trim()).join('\n');
        promptInput.value = trimmed;
        updateCharCount();
        updateWordCount();
        updateTokenCount();
        triggerAutoSplit();
        saveCurrentStateToHistory();
        showMessage('فاصله‌های اضافی حذف شدند.', 'success', 1500);
    }

    function convertToLowercase() {
        promptInput.value = promptInput.value.toLowerCase();
        updateCharCount();
        updateWordCount();
        updateTokenCount();
        triggerAutoSplit();
        saveCurrentStateToHistory();
        showMessage('تمام متن به حروف کوچک تبدیل شد.', 'success', 1500);
    }

    function convertToUppercase() {
        promptInput.value = promptInput.value.toUpperCase();
        updateCharCount();
        updateWordCount();
        updateTokenCount();
        triggerAutoSplit();
        saveCurrentStateToHistory();
        showMessage('تمام متن به حروف بزرگ تبدیل شد.', 'success', 1500);
    }

    function exportAiResponseMarkdown() {
        const text = aiResponseTextarea.value.trim();
        if (!text) {
            showMessage('پاسخی برای تبدیل وجود ندارد.', 'error');
            return;
        }
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai_response.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('پاسخ در قالب مارک‌داون دانلود شد.', 'success');
    }

    function exportAiResponseJson() {
        const text = aiResponseTextarea.value.trim();
        if (!text) {
            showMessage('پاسخی برای تبدیل وجود ندارد.', 'error');
            return;
        }
        const blob = new Blob([JSON.stringify({ response: text }, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai_response.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('پاسخ در قالب JSON دانلود شد.', 'success');
    }

    function toggleCompactView() {
        document.body.classList.toggle('compact-view');
        const isCompact = document.body.classList.contains('compact-view');
        if (compactViewText) {
            compactViewText.textContent = isCompact ? 'نمای عادی' : 'حالت فشرده';
        }
    }

    function addPromptTemplate() {
        const promptContent = promptInput.value.trim();
        if (!promptContent) {
            showMessage('پرامپتی برای ذخیره وجود ندارد.', 'error');
            return;
        }
        const defaultName = `الگو ${new Date().toLocaleString()}`;
        showInputModal(
            'افزودن الگو',
            'لطفاً نامی برای الگوی پرامپت وارد کنید:',
            'نام الگو',
            defaultName,
            (name) => {
                if (!name || name.trim() === '') {
                    showMessage('نام الگو نمی‌تواند خالی باشد.', 'error');
                    return;
                }
                promptTemplates.push({ name: name.trim(), content: promptContent });
                saveTemplatesToLocalStorage(promptTemplates);
                renderPromptTemplates();
                showMessage(`الگوی "${name.trim()}" ذخیره شد.`, 'success');
            },
            'ذخیره'
        );
    }

    // --- Splitting Logic ---

    /**
     * Checks if a given line appears to be part of a markdown code block (fenced ```)
     * or a list item (-, *, +, 1. etc.). This is a heuristic.
     * بررسی می‌کند که آیا یک خط معین به نظر می‌رسد بخشی از بلوک کد Markdown (```) یا یک آیتم لیست باشد.
     * @param {string} line - The line to check.
     * @returns {boolean} True if the line likely belongs to a block/list, false otherwise.
     */
    function isLikelyMarkdownBlockLine(line) {
        // Checks for fenced code blocks (```)
        if (line.trim().startsWith('```')) return true;
        // Checks for list items (-, *, +, 1., 2.)
        if (/^\s*([-*+]|\d+\.)\s/.test(line)) return true;
        // Checks for indented code blocks (4 spaces or a tab)
        if (line.startsWith('    ') || line.startsWith('\t')) return true;
        return false;
    }

    /**
     * Splits the prompt input into manageable parts based on selected strategy.
     * Includes advanced "auto" strategy that tries to preserve markdown blocks/lists.
     * ورودی پرامپت را بر اساس استراتژی انتخاب شده به بخش‌های قابل مدیریت تقسیم می‌کند.
     * @param {string} prompt - The full prompt text.
     * @param {string} strategy - 'auto', 'paragraph', 'line', 'custom', or 'regex'.
     * @param {string} customDelim - The custom delimiter if strategy is 'custom'.
     * @param {string} regexDelim - The regex pattern if strategy is 'regex'.
     * @param {boolean} includeDelimiters - Whether to include delimiters in the output parts for custom/regex strategies.
     * @returns {Array<string>} An array of split prompt parts.
     */
    function splitPrompt(prompt, strategy = 'auto', customDelim = '', regexDelim = '', includeDelimiters = false) {
        if (!prompt.trim()) {
            return [];
        }

        let initialChunks = [];

        // Determine initial chunks based on selected strategy
        if (strategy === 'custom' && customDelim.length > 0) {
            if (includeDelimiters) {
                // If delimiters should be included, split while preserving them
                const partsWithDelim = [];
                let currentIndex = 0;
                while (true) {
                    const nextIndex = prompt.indexOf(customDelim, currentIndex);
                    if (nextIndex === -1) {
                        partsWithDelim.push(prompt.substring(currentIndex));
                        break;
                    }
                    partsWithDelim.push(prompt.substring(currentIndex, nextIndex + customDelim.length));
                    currentIndex = nextIndex + customDelim.length;
                }
                initialChunks = partsWithDelim;
            } else {
                // Standard split by custom delimiter
                initialChunks = prompt.split(customDelim);
            }

        } else if (strategy === 'regex' && regexDelim.length > 0) {
            try {
                // Use regex for splitting, capturing the delimiter if needed
                const regex = new RegExp(`(${regexDelim})`, 'g');
                const splitResult = prompt.split(regex);
                
                if (includeDelimiters) {
                    // Recombine content with their delimiters if includeDelimiters is true
                    const tempCombined = [];
                    for (let i = 0; i < splitResult.length; i++) {
                        if (i % 2 === 0) { // Content part
                            let currentContent = splitResult[i] || '';
                            if (i + 1 < splitResult.length) { // Check for corresponding delimiter
                                currentContent += (splitResult[i + 1] || '');
                            }
                            if (currentContent.trim() !== '') {
                                tempCombined.push(currentContent);
                            }
                        }
                    }
                    initialChunks = tempCombined;
                } else {
                    // Filter out delimiters if not included
                    initialChunks = splitResult.filter((_, i) => i % 2 === 0 && _.trim() !== '');
                }
            } catch (e) {
                showMessage(`خطا در عبارت با قاعده (Regex): ${e.message}`, 'error');
                return [];
            }

        } else if (strategy === 'paragraph') {
            // Split by double newline (paragraphs)
            initialChunks = prompt.split('\n\n');
        } else if (strategy === 'line') {
            // Split by single newline (lines)
            initialChunks = prompt.split('\n');
        } else { // 'auto' strategy or fallback
            // Default to paragraph splitting for 'auto'
            initialChunks = prompt.split('\n\n');
        }

        const parts = [];

        // Process initial chunks to respect MAX_CHARS_PER_PART
        initialChunks.forEach(chunk => {
            chunk = chunk.trim();
            if (chunk === '') return;

            if (chunk.length <= MAX_CHARS_PER_PART) {
                parts.push(chunk);
            } else {
                // If a chunk is too long, further split it by lines or as a single large block
                let subChunksToProcess;
                if (strategy === 'auto' || strategy === 'paragraph' || strategy === 'custom' || (strategy === 'regex' && includeDelimiters)) {
                    subChunksToProcess = chunk.split('\n'); // Break into lines for further splitting
                } else if (strategy === 'regex' && !includeDelimiters) {
                    subChunksToProcess = [chunk]; // Keep as one chunk for character-level splitting below
                } else {
                    subChunksToProcess = [chunk]; // Default fallback for direct character splitting
                }

                let tempPart = '';

                for (let i = 0; i < subChunksToProcess.length; i++) {
                    const subChunk = subChunksToProcess[i];
                    const proposedAddition = (tempPart === '' ? '' : '\n') + subChunk;

                    if ((tempPart + proposedAddition).length <= MAX_CHARS_PER_PART) {
                        tempPart += proposedAddition;
                    } else {
                        // If adding the next subChunk exceeds limit, push current tempPart and start new
                        if (tempPart !== '') {
                            parts.push(tempPart);
                        }
                        tempPart = subChunk;
                    }
                }
                // Push any remaining tempPart after the loop
                if (tempPart !== '') {
                    parts.push(tempPart);
                }
            }
        });

        const finalParts = [];
        // Final pass to ensure all parts are within MAX_CHARS_PER_PART, handling long chunks by character if necessary
        parts.forEach(part => {
            if (part.length <= MAX_CHARS_PER_PART) {
                finalParts.push(part);
            } else {
                let remaining = part;
                while (remaining.length > 0) {
                    let splitPoint = MAX_CHARS_PER_PART; // Default split point

                    let potentialSplitSegment = remaining.substring(0, MAX_CHARS_PER_PART);
                    let bestNaturalBreak = -1;
                    // Define a safe range within the limit to look for natural breaks
                    const breakSearchRangeStart = MAX_CHARS_PER_PART - MIN_CHARS_FOR_NEW_SPLIT;

                    const linesInSegment = potentialSplitSegment.split('\n');
                    let currentLength = potentialSplitSegment.length; // Track length from end of segment
                    // Iterate backwards to find a good breaking point (e.g., end of sentence, empty line)
                    for (let i = linesInSegment.length - 1; i >= 0; i--) {
                        const currentLine = linesInSegment[i];
                        const lineStartIndex = currentLength - currentLine.length - (i > 0 ? 1 : 0); // Start index of current line in segment

                        if (lineStartIndex >= breakSearchRangeStart) {
                            if (strategy === 'auto' && isLikelyMarkdownBlockLine(currentLine)) {
                                // For Markdown blocks, try to break *before* the block or at previous natural break
                                const prevNewlineIndex = potentialSplitSegment.substring(0, lineStartIndex).lastIndexOf('\n');
                                if (prevNewlineIndex !== -1 && prevNewlineIndex >= breakSearchRangeStart) {
                                    bestNaturalBreak = prevNewlineIndex;
                                    break;
                                }
                            } else {
                                // Look for sentence endings or non-empty lines as natural breaks
                                if (currentLine.endsWith('.') || currentLine.endsWith('?') || currentLine.endsWith('!')) {
                                    bestNaturalBreak = currentLength; // Break after sentence
                                    break;
                                }
                                if (currentLine.trim().length > 0) {
                                    bestNaturalBreak = currentLength; // Break after a significant line
                                    break;
                                }
                            }
                        }
                        currentLength -= (currentLine.length + (i > 0 ? 1 : 0)); // Decrement length for next iteration
                    }

                    if (bestNaturalBreak !== -1) {
                        splitPoint = bestNaturalBreak + 1; // Adjust to be inclusive of the break character
                    } else {
                        // Fallback: if no natural break found in the safe range, try last newline
                        let fallbackNewline = potentialSplitSegment.lastIndexOf('\n');
                        if (fallbackNewline !== -1) {
                            splitPoint = fallbackNewline + 1;
                        } else {
                            // Absolute fallback: split exactly at MAX_CHARS_PER_PART or remaining length
                            splitPoint = Math.min(MAX_CHARS_PER_PART, remaining.length);
                        }
                    }
                    
                    finalParts.push(remaining.substring(0, splitPoint).trim());
                    remaining = remaining.substring(splitPoint).trim();
                }
            }
        });

        return finalParts.filter(p => p.length > 0); // Filter out any empty parts
    }

    /**
     * Renders the split prompt parts to the output container.
     * Also manages the state of 'Copy All' and 'Export All' buttons.
     * Applies user-defined prefix and suffix.
     * بخش‌های پرامپت تقسیم‌شده را در کانتینر خروجی رندر می‌کند.
     * @param {Array<string>} parts - An array of split prompt parts.
     */
    function renderOutput(parts) {
        outputContainer.innerHTML = '';
        
        const partPrefix = partPrefixInput.value;
        const partSuffix = partSuffixInput.value;

        if (parts.length === 0) {
            copyAllButton.disabled = true;
            copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
            exportTextButton.disabled = true;
            exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
            exportMarkdownButton.disabled = true; // New
            exportMarkdownButton.classList.add('opacity-50', 'cursor-not-allowed'); // New
            exportJsonButton.disabled = true;
            exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
            clearOutputOnlyButton.disabled = true;
            clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');
            return;
        }

        copyAllButton.disabled = false;
        copyAllButton.classList.remove('opacity-50', 'cursor-not-allowed');
        exportTextButton.disabled = false;
        exportTextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        exportMarkdownButton.disabled = false; // New
        exportMarkdownButton.classList.remove('opacity-50', 'cursor-not-allowed'); // New
        exportJsonButton.disabled = false;
        exportJsonButton.classList.remove('opacity-50', 'cursor-not-allowed');
        clearOutputOnlyButton.disabled = false;
        clearOutputOnlyButton.classList.remove('opacity-50', 'cursor-not-allowed');


        parts.forEach((partContent, index) => {
            const partBox = document.createElement('div');
            partBox.classList.add('prompt-part-box', 'dark:bg-gray-800', 'dark:border-gray-600', 'dark:shadow-lg');
            partBox.draggable = true;
            partBox.dataset.originalContent = partContent;
            partBox.dataset.originalIndex = index; // Store original index for reordering logic

            const partTitle = document.createElement('h3');
            partTitle.classList.add('text-lg', 'font-medium', 'mb-2', 'text-gray-900', 'dark:text-gray-200');
            partTitle.textContent = `بخش ${index + 1} ( ${partContent.length} کاراکتر )`;
            partBox.appendChild(partTitle);

            const charLimitBarContainer = document.createElement('div');
            charLimitBarContainer.classList.add('char-limit-bar-container');
            const charLimitBar = document.createElement('div');
            charLimitBar.classList.add('char-limit-bar');
            
            const percentage = (partContent.length / MAX_CHARS_PER_PART) * 100;
            charLimitBar.style.width = `${Math.min(100, percentage)}%`;
            if (percentage > 90) {
                charLimitBar.classList.add('danger');
            } else if (percentage > 70) {
                charLimitBar.classList.add('warning');
            }
            charLimitBarContainer.appendChild(charLimitBar);
            partBox.appendChild(charLimitBarContainer);


            const pre = document.createElement('pre');
            pre.textContent = partPrefix + partContent + partSuffix;
            pre.setAttribute('aria-label', `Prompt Part ${index + 1}`);
            partBox.appendChild(pre);

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('flex', 'flex-wrap', 'gap-2', 'mt-4');

            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button', 'flex-grow', 'flex', 'items-center', 'justify-center');
            copyButton.innerHTML = `<i class="fas fa-copy ml-2"></i> کپی بخش`;
            copyButton.setAttribute('aria-label', `Copy Part ${index + 1}`);
            copyButton.addEventListener('click', () => {
                copyTextToClipboard(pre.textContent, `بخش ${index + 1}`, copyButton);
            });
            buttonContainer.appendChild(copyButton);

            const aiRefineButton = document.createElement('button');
            aiRefineButton.classList.add('ai-button', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'flex-grow', 'flex', 'items-center', 'justify-center');
            aiRefineButton.innerHTML = `<i class="fas fa-robot ml-2"></i> اصلاح با هوش مصنوعی`;
            aiRefineButton.title = 'اصلاح یا خلاصه سازی این بخش با هوش مصنوعی';
            aiRefineButton.addEventListener('click', () => {
                openAiModal(partContent, index, partBox); // Pass partBox for highlighting
            });
            buttonContainer.appendChild(aiRefineButton);

            // New: Rename Part button (visual only)
            const renamePartButton = document.createElement('button');
            renamePartButton.classList.add('bg-purple-500', 'hover:bg-purple-600', 'text-white', 'py-2', 'px-4', 'rounded-lg', 'font-medium', 'transition', 'duration-200', 'flex', 'items-center', 'justify-center');
            renamePartButton.innerHTML = `<i class="fas fa-edit ml-2"></i> تغییر نام بخش`;
            renamePartButton.title = `تغییر نام نمایش بخش ${index + 1}`;
            renamePartButton.addEventListener('click', () => {
                const currentDisplayTitle = partTitle.textContent; // Get current displayed title
                showInputModal(
                    `تغییر نام نمایش بخش ${index + 1}`,
                    `نام جدید برای نمایش این بخش را وارد کنید:`,
                    'نام نمایش جدید',
                    currentDisplayTitle.split('(')[0].trim(), // Pre-fill with existing name without char count
                    (newDisplayName) => {
                        if (newDisplayName.trim() === '') {
                            showMessage('نام نمایش نمی‌تواند خالی باشد. نام پیش‌فرض بازگردانده شد.', 'error');
                            partTitle.textContent = `بخش ${index + 1} ( ${partContent.length} کاراکتر )`; // Revert to default
                            return;
                        }
                        partTitle.textContent = `${newDisplayName.trim()} ( ${partContent.length} کاراکتر )`;
                        showMessage(`نام نمایش بخش ${index + 1} با موفقیت تغییر کرد.`, 'success');
                    },
                    'تغییر نام'
                );
            });
            buttonContainer.appendChild(renamePartButton);

            // New: Delete Part button
            const deletePartButton = document.createElement('button');
            deletePartButton.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white', 'py-2', 'px-4', 'rounded-lg', 'font-medium', 'transition', 'duration-200', 'flex', 'items-center', 'justify-center');
            deletePartButton.innerHTML = `<i class="fas fa-trash-alt ml-2"></i> حذف بخش`;
            deletePartButton.title = `حذف بخش ${index + 1}`;
            deletePartButton.addEventListener('click', () => {
                showConfirmationModal(
                    `آیا مطمئنید می‌خواهید بخش ${index + 1} را حذف کنید؟`,
                    () => deletePart(index)
                );
            });
            buttonContainer.appendChild(deletePartButton);

            partBox.appendChild(buttonContainer);
            outputContainer.appendChild(partBox);
        });

        addDragDropListenersToParts();
    }

    /**
     * Deletes a specific part from the output container and rebuilds the main prompt input.
     * یک بخش خاص را از کانتینر خروجی حذف کرده و ورودی پرامپت اصلی را بازسازی می‌کند.
     * @param {number} indexToDelete - The index of the part to delete.
     */
    function deletePart(indexToDelete) {
        const currentParts = Array.from(outputContainer.querySelectorAll('.prompt-part-box')).map(el => el.dataset.originalContent);
        
        if (indexToDelete >= 0 && indexToDelete < currentParts.length) {
            currentParts.splice(indexToDelete, 1); // Remove the part
            const rebuiltPrompt = currentParts.join('\n\n');
            promptInput.value = rebuiltPrompt;
            updateCharCount();
            updateWordCount();
            updateTokenCount();
            showMessage(`بخش ${indexToDelete + 1} حذف شد.`, 'success');
            triggerAutoSplit(); // Re-split and re-render the output
            saveCurrentStateToHistory(); // Save to history after deletion
        } else {
            showMessage('بخش نامعتبر برای حذف.', 'error');
        }
    }


    // --- AI Integration Logic ---
    let currentPartOriginalContent = null;
    let currentPartOriginalIndex = -1;
    let currentlyHighlightedPartElement = null;

    /**
     * Opens the AI response modal and prepares for AI interaction.
     * پنجره مودال پاسخ هوش مصنوعی را باز کرده و آن را برای تعامل با هوش مصنوعی آماده می‌کند.
     * @param {string} partContent - The content of the prompt part selected.
     * @param {number} partIndex - The index of the part in the current output for replacement.
     * @param {HTMLElement} partElement - The DOM element of the part to highlight.
     */
    function openAiModal(partContent, partIndex, partElement) {
        if (currentlyHighlightedPartElement) {
            currentlyHighlightedPartElement.classList.remove('active-ai-edit');
        }
        currentlyHighlightedPartElement = partElement;
        currentlyHighlightedPartElement.classList.add('active-ai-edit');

        // Only clear aiPromptInput if it's a new part or a different part
        if (partContent !== currentPartOriginalContent) {
            aiPromptInput.value = '';
        }
        currentPartOriginalContent = partContent;
        currentPartOriginalIndex = partIndex;
        aiResponseTextarea.value = '';
        aiLoadingSpinner.classList.add('hidden');
        aiResponseTextarea.classList.remove('hidden');
        aiRefiningPartInfo.textContent = `(در حال اصلاح بخش ${partIndex + 1})`; // Update part info
        aiRefiningPartInfo.classList.remove('hidden');
        aiResponseModal.classList.add('open');
        updateAiResponseCounts(); // Initial update for empty textarea on modal open
    }

    /**
     * Sends a request to the Gemini API to refine a prompt part.
     * درخواستی را به API گیمی‌نی برای اصلاح یک بخش از پرامپت ارسال می‌کند.
     * @param {string} textToRefine - The text content to be refined by AI.
     * @param {string} commandPrompt - The specific instruction for the AI (e.g., "Summarize", "Rephrase).
     */
    async function sendToAI(textToRefine, commandPrompt) {
        const apiKey = (apiKeyInput && apiKeyInput.value.trim()) || localStorage.getItem('promptPartoApiKey') || '';
        if (!apiKey) {
            showMessage('کلید Gemini API وارد نشده است.', 'error');
            return;
        }
        localStorage.setItem('promptPartoApiKey', apiKey);
        aiResponseTextarea.value = '';
        updateAiResponseCounts(); // Clear counts
        aiLoadingSpinner.classList.remove('hidden');
        aiResponseTextarea.classList.add('hidden');
        copyAiResponseButton.disabled = true;
        insertAiResponseButton.disabled = true;
        aiSendToAIButton.disabled = true;
        aiSendToAIButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال ارسال...`;

        const finalCommand = aiPromptInput.value.trim(); // Always use aiPromptInput value
        const temperature = parseFloat(aiTemperatureInput.value);
        const topP = parseFloat(aiTopPInput.value);
        const aiResponseCharLimit = parseInt(aiResponseCharLimitInput.value, 10);

        try {
            const prompt = `${finalCommand}:\n\n"${textToRefine}"\n\nلطفا فقط متن اصلاح شده یا خلاصه شده را برگردانید و از هرگونه مقدمه یا خاتمه اضافه خودداری کنید.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = {
                contents: chatHistory,
                generationConfig: {
                    temperature: isNaN(temperature) ? 0.7 : Math.max(0, Math.min(1, temperature)),
                    topP: isNaN(topP) ? 0.9 : Math.max(0, Math.min(1, topP)),
                    // maxOutputTokens is not directly configurable for gemini-2.0-flash via generateContent payload.
                    // Client-side truncation will be applied after response.
                }
            };
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                let aiResponse = result.candidates[0].content.parts[0].text;
                
                // Apply client-side truncation if a limit is set
                if (aiResponseCharLimit > 0 && aiResponse.length > aiResponseCharLimit) {
                    aiResponse = aiResponse.substring(0, aiResponseCharLimit);
                    showMessage(`پاسخ هوش مصنوعی به دلیل محدودیت ${aiResponseCharLimit} کاراکتری کوتاه شد.`, 'info');
                }

                aiResponseTextarea.value = aiResponse.trim();
                showMessage(`پاسخ هوش مصنوعی دریافت شد.`, 'success');
            } else {
                aiResponseTextarea.value = 'پاسخی از هوش مصنوعی دریافت نشد. لطفاً دوباره تلاش کنید.';
                showMessage('خطا در دریافت پاسخ هوش مصنوعی.', 'error');
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            aiResponseTextarea.value = 'خطا در ارتباط با هوش مصنوعی. لطفاً اتصال اینترنت خود را بررسی کنید یا بعداً تلاش کنید.';
            showMessage('خطا در ارتباط با هوش مصنوعی.', 'error');
        } finally {
            aiLoadingSpinner.classList.add('hidden');
            aiResponseTextarea.classList.remove('hidden');
            copyAiResponseButton.disabled = false;
            insertAiResponseButton.disabled = false;
            aiSendToAIButton.disabled = false;
            aiSendToAIButton.innerHTML = `<i class="fas fa-paper-plane ml-2"></i> ارسال به هوش مصنوعی`;
            updateAiResponseCounts(); // Update counts after AI response is received
        }
    }

    // Event listeners for AI modal buttons
    closeAiModalButton.addEventListener('click', () => {
        aiResponseModal.classList.remove('open');
        aiRefiningPartInfo.classList.add('hidden'); // Hide part info
        if (currentlyHighlightedPartElement) {
            currentlyHighlightedPartElement.classList.remove('active-ai-edit');
            currentlyHighlightedPartElement = null;
        }
        currentPartOriginalContent = null;
        currentPartOriginalIndex = -1;
        aiResponseTextarea.value = ''; // Clear AI response on close
        updateAiResponseCounts(); // Clear counts
    });

    aiSummarizeButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را خلاصه کن';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiRephraseButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را بازنویسی کن تا واضح تر و روان تر شود';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiElaborateButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را بیشتر توضیح بده و جزئیات بیشتری اضافه کن';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });
    
    aiConciseButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را به صورت مختصر و مفید بنویس';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiExpandButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را با جزئیات بیشتر و توضیحات کامل‌تر گسترش بده';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiToneFormalButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'لحن این متن را به رسمی تغییر بده.';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiToneInformalButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'لحن این متن را به غیررسمی و دوستانه تغییر بده.';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiTranslateEnButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را به انگلیسی ترجمه کن.';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiTranslateFaButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را به فارسی ترجمه کن.';
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiSendToAIButton.addEventListener('click', () => {
        const customPrompt = aiPromptInput.value.trim();
        if (!customPrompt) {
            showMessage('لطفاً دستورالعمل خود را برای هوش مصنوعی وارد کنید.', 'error');
            return;
        }
        if (currentPartOriginalContent) {
            sendToAI(currentPartOriginalContent, customPrompt);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    copyAiResponseButton.addEventListener('click', () => {
        copyTextToClipboard(aiResponseTextarea.value, 'پاسخ هوش مصنوعی', copyAiResponseButton);
    });

    clearAiResponseButton.addEventListener('click', () => {
        aiResponseTextarea.value = '';
        showMessage('پاسخ هوش مصنوعی پاک شد.', 'info');
        updateAiResponseCounts();
    });

    insertAiResponseButton.addEventListener('click', () => {
        if (currentPartOriginalContent && aiResponseTextarea.value.trim() && currentPartOriginalIndex !== -1) {
            const replacementText = aiResponseTextarea.value.trim();
            const currentPartsInOutput = Array.from(outputContainer.children).map(el => el.dataset.originalContent);

            const updatedPartsContent = currentPartsInOutput.map((content, idx) => {
                if (idx === currentPartOriginalIndex) {
                    return replacementText;
                }
                return content;
            });

            const updatedPromptValue = updatedPartsContent.join('\n\n');
            promptInput.value = updatedPromptValue;
            
            showMessage('پاسخ هوش مصنوعی در پرامپت اصلی درج شد.', 'success');
            
            updateCharCount();
            updateWordCount();
            updateTokenCount(); // Update token count after insert
            triggerAutoSplit();
            closeAiModalButton.click(); // Close AI modal and remove highlight
            saveCurrentStateToHistory(); // Save state after AI insertion
        } else {
            showMessage('پاسخ هوش مصنوعی برای درج خالی است.', 'error');
        }
    });

    // Update AI response counts when user types in the AI response textarea
    aiResponseTextarea.addEventListener('input', updateAiResponseCounts);


    // --- Drag and Drop Reordering Logic ---
    let draggedItem = null;
    let placeholder = null; // New: Placeholder element for drag-and-drop

    function addDragDropListenersToParts() {
        const parts = outputContainer.querySelectorAll('.prompt-part-box');
        parts.forEach(part => {
            part.addEventListener('dragstart', (e) => {
                draggedItem = part;
                e.dataTransfer.effectAllowed = 'move';
                // Create and insert placeholder when drag starts
                placeholder = document.createElement('div');
                placeholder.classList.add('drag-placeholder');
                part.parentNode.insertBefore(placeholder, part.nextSibling);

                setTimeout(() => {
                    part.classList.add('dragging');
                }, 0);
            });

            part.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.target.closest('.prompt-part-box') && e.target.closest('.prompt-part-box') !== draggedItem) {
                    const targetItem = e.target.closest('.prompt-part-box');
                    const bounding = targetItem.getBoundingClientRect();
                    const offset = bounding.y + (bounding.height / 2);

                    if (e.clientY - offset > 0) {
                        // Dragging below target, insert after
                        if (targetItem.nextSibling !== placeholder) { // Prevent moving if placeholder is already correctly positioned
                            targetItem.parentNode.insertBefore(placeholder, targetItem.nextSibling);
                        }
                    } else {
                        // Dragging above target, insert before
                        if (targetItem.previousSibling !== placeholder) { // Prevent moving if placeholder is already correctly positioned
                             targetItem.parentNode.insertBefore(placeholder, targetItem);
                        }
                    }
                }
            });

            part.addEventListener('dragleave', (e) => {
                // No specific action needed for `.prompt-part-box` itself
            });

            part.addEventListener('dragend', (e) => {
                if (draggedItem) {
                    draggedItem.classList.remove('dragging');
                    if (placeholder && placeholder.parentNode) {
                        placeholder.parentNode.removeChild(placeholder); // Remove placeholder
                    }
                    // Insert the dragged item at the placeholder's final position
                    const targetParent = outputContainer;
                    if (placeholder && placeholder.parentNode === targetParent) {
                        targetParent.insertBefore(draggedItem, placeholder);
                    } else {
                         // Fallback if placeholder was unexpectedly removed, just re-append to parent
                        outputContainer.appendChild(draggedItem);
                    }
                }
                draggedItem = null;
                placeholder = null; // Reset placeholder
                rebuildPromptFromReorderedParts();
                // After reordering, if the AI modal was open for a part, reset its original index
                if (currentPartOriginalContent && currentPartOriginalIndex !== -1) {
                    const reorderedElements = Array.from(outputContainer.querySelectorAll('.prompt-part-box'));
                    const newIndex = reorderedElements.findIndex(el => el.dataset.originalContent === currentPartOriginalContent);
                    if (newIndex !== -1) {
                        currentPartOriginalIndex = newIndex;
                    } else {
                        // If the original part is somehow not found after reordering, reset.
                        currentPartOriginalContent = null;
                        currentPartOriginalIndex = -1;
                        if (currentlyHighlightedPartElement) {
                            currentlyHighlightedPartElement.classList.remove('active-ai-edit');
                            currentlyHighlightedPartElement = null;
                        }
                    }
                }
            });
        });

        // Add dragover listener to the output container itself to handle drops at the end or empty space
        outputContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allows drop
            if (draggedItem && !e.target.closest('.prompt-part-box') && placeholder && !placeholder.parentNode) {
                // If dragging over empty space in the container, append placeholder to end
                outputContainer.appendChild(placeholder);
            }
        });
    }

    /**
     * Rebuilds the main prompt input based on the reordered parts in the output container.
     * پرامپت اصلی را بر اساس ترتیب جدید بخش‌ها در کانتینر خروجی بازسازی می‌کند.
     */
    function rebuildPromptFromReorderedParts() {
        const reorderedPartElements = outputContainer.querySelectorAll('.prompt-part-box');
        const originalContents = Array.from(reorderedPartElements).map(el => el.dataset.originalContent);

        const rebuiltPrompt = originalContents.join('\n\n');

        promptInput.value = rebuiltPrompt;
        updateCharCount();
        updateWordCount();
        updateTokenCount(); // Update token count after reorder
        showMessage('ترتیب بخش‌ها تغییر کرد. می‌توانید پرامپپت اصلی را کپی کنید یا دوباره تقسیم کنید.', 'info');
        triggerAutoSplit();
        saveCurrentStateToHistory(); // Save to history after reordering
    }


    // --- Prompt History Logic (distinct from undo/redo stack) ---
    const PROMPT_HISTORY_LIMIT = 20; // Limit history to last 20 states
    let promptHistory = []; // Stores { content: string, timestamp: Date }

    // saveCurrentPromptState() is for undo/redo.
    // We need a separate function for long-term history saved to localStorage.
    /**
     * Saves the current prompt input value to the long-term history.
     * مقدار فعلی ورودی پرامپت را در تاریخچه بلندمدت ذخیره می‌کند.
     */
    function saveLongTermPromptHistory() {
        const currentContent = promptInput.value.trim();
        // Prevent saving if current content is identical to the latest history entry OR if content is empty and history already has an empty entry
        if (promptHistory.length > 0 && currentContent === promptHistory[0].content) {
            return;
        }
        promptHistory.unshift({ content: currentContent, timestamp: new Date() });
        if (promptHistory.length > PROMPT_HISTORY_LIMIT) {
            promptHistory.pop(); // Remove oldest entry
        }
        savePromptHistoryToLocalStorage(); // Persist history
        renderPromptHistoryList();
    }

    /**
     * Loads prompt history from local storage.
     * تاریخچه پرامپت را از حافظه محلی بارگذاری می‌کند.
     */
    function loadPromptHistoryFromLocalStorage() {
        try {
            const storedHistory = localStorage.getItem('promptPartoHistory');
            if (storedHistory) {
                promptHistory = JSON.parse(storedHistory).map(entry => ({
                    content: entry.content,
                    timestamp: new Date(entry.timestamp) // Convert timestamp string back to Date object
                }));
            }
        } catch (e) {
            console.error('Error loading prompt history from localStorage:', e);
            promptHistory = []; // Clear history on error
        }
    }

    /**
     * Saves prompt history to local storage.
     * تاریخچه پرامپت را در حافظه محلی ذخیره می‌کند.
     */
    function savePromptHistoryToLocalStorage() {
        try {
            localStorage.setItem('promptPartoHistory', JSON.stringify(promptHistory));
        } catch (e) {
            console.error('Error saving prompt history to localStorage:', e);
            showMessage('ذخیره تاریخچه با مشکل مواجه شد. حافظه مرورگر پر است؟', 'error');
        }
    }


    /**
     * Renders the prompt history list in the dropdown.
     * لیست تاریخچه پرامپت را در منوی کشویی رندر می‌کند.
     */
    function renderPromptHistoryList() {
        historyList.innerHTML = '';
        if (promptHistory.length === 0) {
            historyList.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 p-2">هیچ تاریخچه‌ای وجود ندارد.</p>';
            clearHistoryButton.classList.add('hidden'); // Hide clear button if no history
            return;
        } else {
            clearHistoryButton.classList.remove('hidden'); // Show clear button if history exists
        }

        promptHistory.forEach((entry, index) => {
            const timeAgo = formatTimeAgo(entry.timestamp);
            const div = document.createElement('div');
            div.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'transition-colors', 'duration-200');

            const historyItem = document.createElement('a');
            historyItem.href = '#';
            historyItem.classList.add('flex-grow', 'block', 'px-2', 'py-1', 'text-sm', 'text-gray-700', 'dark:text-gray-200', 'truncate');
            historyItem.textContent = `${entry.content.substring(0, 40)}... (${timeAgo})`;
            historyItem.title = `بازگشت به: ${entry.content}\nذخیره شده: ${entry.timestamp.toLocaleString()}`;
            historyItem.addEventListener('click', (e) => {
                e.preventDefault();
                promptInput.value = entry.content;
                updateCharCount();
                updateWordCount();
                updateTokenCount();
                showMessage(`پرامپت به نسخه قبلی بازگردانده شد (${timeAgo}).`, 'info');
                promptHistoryDropdownMenu.classList.add('hidden');
                triggerAutoSplit();
                saveCurrentStateToHistory(); // Save the loaded state to undo/redo history
                // When loading from history, we *don't* want to immediately add to history again
                // The next user input will add a new state.
            });
            div.appendChild(historyItem);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-prompt-btn', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'p-1', 'rounded', 'text-xs', 'ml-2');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.title = `حذف این مورد از تاریخچه`;
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationModal('آیا مطمئنید می‌خواهید این مورد را از تاریخچه حذف کنید؟', () => {
                    deleteHistoryItem(index);
                    showMessage('آیتم تاریخچه حذف شد.', 'success');
                });
            });
            div.appendChild(deleteButton);
            historyList.appendChild(div);
        });
    }

    /**
     * Deletes a specific item from the prompt history by index.
     * یک آیتم خاص را از تاریخچه پرامپت بر اساس ایندکس حذف می‌کند.
     * @param {number} indexToDelete - The index of the item to delete.
     */
    function deleteHistoryItem(indexToDelete) {
        promptHistory.splice(indexToDelete, 1);
        savePromptHistoryToLocalStorage();
        renderPromptHistoryList();
    }

    /**
     * Clears the entire prompt history.
     * کل تاریخچه پرامپت را پاک می‌کند.
     */
    function clearPromptHistory() {
        showConfirmationModal('آیا مطمئنید می‌خواهید کل تاریخچه پرامپت را پاک کنید؟ این عمل برگشت‌ناپذیر است.', () => {
            promptHistory = [];
            savePromptHistoryToLocalStorage();
            renderPromptHistoryList();
            showMessage('تاریخچه پرامپت پاک شد.', 'success');
        });
    }


    /**
     * Formats a date object to "X minutes/hours/days ago".
     * یک شی تاریخ را به فرمت "X دقیقه/ساعت/روز پیش" قالب‌بندی می‌کند.
     * @param {Date} date - The date object.
     * @returns {string} Formatted string.
     */
    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " سال پیش";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " ماه پیش";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " روز پیش";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " ساعت پیش";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " دقیقه پیش";
        return Math.floor(seconds) + " ثانیه پیش";
    }

    // --- Auto-Save Prompt Logic ---
    let autoSaveTimer;
    function startAutoSave() {
        if (autoSaveTimer) clearInterval(autoSaveTimer);
        autoSaveTimer = setInterval(saveAutoPrompt, AUTO_SAVE_INTERVAL);
    }

    function saveAutoPrompt() {
        const currentContent = promptInput.value;
        try {
            localStorage.setItem('promptPartoAutoSave', currentContent);
            autoSaveStatus.textContent = `ذخیره خودکار شد. (${new Date().toLocaleTimeString()})`;
            autoSaveStatus.classList.remove('hidden', 'text-red-500', 'text-gray-400');
            autoSaveStatus.classList.add('text-green-500');
            clearTimeout(autoSaveStatus.hideTimeout);
            autoSaveStatus.hideTimeout = setTimeout(() => {
                autoSaveStatus.classList.add('hidden');
            }, 5000); // Hide status after 5 seconds
        } catch (e) {
            console.error('Error auto-saving prompt:', e);
            autoSaveStatus.textContent = `خطا در ذخیره خودکار!`;
            autoSaveStatus.classList.remove('hidden', 'text-green-500');
            autoSaveStatus.classList.add('text-red-500');
        }
    }

    function loadAutoPrompt() {
        try {
            const savedContent = localStorage.getItem('promptPartoAutoSave');
            if (savedContent && promptInput.value.trim() === '') { // Only load if input is empty
                promptInput.value = savedContent;
                updateCharCount();
                updateWordCount();
                updateTokenCount();
                showMessage('پرامپت ذخیره شده خودکار بارگذاری شد.', 'info');
                // Do not save to history immediately, let the user's first input do that.
            }
        } catch (e) {
            console.error('Error loading auto-saved prompt:', e);
        }
    }


    // --- Share Functionality ---
    /**
     * Generates a shareable URL containing the current prompt and settings.
     * یک URL قابل اشتراک‌گذاری حاوی پرامپت فعلی و تنظیمات را تولید می‌کند.
     */
    function generateShareableUrl() {
        const dataToShare = {
            prompt: promptInput.value,
            settings: settings // 'settings' object holds all current config
        };
        const encodedData = btoa(JSON.stringify(dataToShare));
        const shareUrl = `${window.location.origin}${window.location.pathname}?promptData=${encodedData}`;
        
        copyTextToClipboard(shareUrl, 'لینک اشتراک‌گذاری', shareButton);
        showMessage('لینک اشتراک‌گذاری کپی شد!', 'success');
    }

    /**
     * Applies prompt and settings from a shareable URL.
     * پرامپت و تنظیمات را از یک URL قابل اشتراک‌گذاری اعمال می‌کند.
     */
    function applyStateFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('promptData');

        if (encodedData) {
            try {
                const decodedData = JSON.parse(atob(encodedData));
                if (decodedData.prompt !== undefined) {
                    promptInput.value = decodedData.prompt;
                    updateCharCount();
                    updateWordCount();
                    updateTokenCount();
                    // Clear long-term history if loading from URL to avoid confusion
                    promptHistory = [];
                    renderPromptHistoryList();
                    // Clear undo/redo history as well
                    promptHistoryStack = [];
                    currentHistoryIndex = -1;
                    updateUndoRedoButtons();
                }
                if (decodedData.settings) {
                    for (const key in decodedData.settings) {
                        if (settings.hasOwnProperty(key)) {
                            settings[key] = decodedData.settings[key];
                        }
                    }
                    maxCharsPerPartInput.value = settings.maxCharsPerPart;
                    splitStrategySelect.value = settings.splitStrategy;
                    customDelimiterInput.value = settings.customDelimiter;
                    regexDelimiterInput.value = settings.regexDelimiter;
                    partPrefixInput.value = settings.partPrefix;
                    partSuffixInput.value = settings.partSuffix;
                    includeDelimitersInOutputCheckbox.checked = settings.includeDelimitersInOutput;
                    aiTemperatureInput.value = settings.aiTemperature; // New
                    aiTopPInput.value = settings.aiTopP; // New
                    aiResponseCharLimitInput.value = settings.aiResponseCharLimit; // New
                    applyTheme(settings.theme);
                }
                showMessage('پرامپت و تنظیمات از لینک بارگذاری شد!', 'info');
                history.replaceState(null, '', window.location.pathname); // Clean up URL
                triggerAutoSplit();
                // Ensure initial state from URL is saved to undo history
                saveCurrentStateToHistory();
            }
            catch (e) {
                console.error('Error decoding/applying shared URL data:', e);
                showMessage('خطا در بارگذاری اطلاعات از لینک اشتراک‌گذاری.', 'error');
            }
        }
    }


    // --- Drag and Drop File Handling ---
    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default to allow drop
        dragDropZone.classList.add('drag-over');
    });

    dragDropZone.addEventListener('dragleave', (e) => {
        // Only remove drag-over if leaving the main drop zone, not just child elements
        if (!dragDropZone.contains(e.relatedTarget)) {
            dragDropZone.classList.remove('drag-over');
        }
    });

    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault(); // Prevent default file open
        dragDropZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    promptInput.value = event.target.result;
                    updateCharCount();
                    updateWordCount();
                    updateTokenCount();
                    triggerAutoSplit();
                    saveCurrentStateToHistory(); // Save loaded file to undo history
                    saveLongTermPromptHistory(); // Save loaded file to long-term history
                    saveAutoPrompt();
                    showMessage('فایل متنی با موفقیت بارگذاری شد.', 'success');
                };
                reader.onerror = () => {
                    showMessage('خطا در خواندن فایل.', 'error');
                };
                reader.readAsText(file);
            } else {
                showMessage('لطفاً فقط فایل‌های متنی (.txt) را رها کنید.', 'error');
            }
        }
    });
    
    // Handle file input click fallback (though drag-drop is primary)
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    promptInput.value = event.target.result;
                    updateCharCount();
                    updateWordCount();
                    updateTokenCount();
                    triggerAutoSplit();
                    saveCurrentStateToHistory(); // Save loaded file to undo history
                    saveLongTermPromptHistory(); // Save loaded file to long-term history
                    saveAutoPrompt();
                    showMessage('فایل متنی با موفقیت بارگذاری شد.', 'success');
                };
                reader.onerror = () => {
                    showMessage('خطا در خواندن فایل.', 'error');
                };
                reader.readAsText(file);
            } else {
                showMessage('لطفاً فقط فایل‌های متنی (.txt) را انتخاب کنید.', 'error');
            }
        }
    });
    
    // Allow clicking the overlay to open file dialog (for accessibility/fallback)
    dragDropOverlay.addEventListener('click', () => {
        fileInput.click();
    });

    // Open file dialog when the upload button is clicked
    uploadFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    // --- Event Listeners ---
    
    // Manual split button click
    splitButton.addEventListener('click', () => {
        updateMaxCharsPerPart();
        const prompt = promptInput.value;
        const strategy = splitStrategySelect.value;
        const customDelim = customDelimiterInput.value;
        const regexDelim = regexDelimiterInput.value;
        const includeDelimiters = includeDelimitersInOutputCheckbox.checked;

        // Basic validation for regex
        if (strategy === 'regex' && regexDelim.trim() !== '') {
            try {
                new RegExp(regexDelim); // Test if regex is valid
            } catch (e) {
                showMessage(`عبارت با قاعده نامعتبر: ${e.message}`, 'error');
                return;
            }
        }

        splitButton.disabled = true;
        splitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال تقسیم...`;
        
        const parts = splitPrompt(prompt, strategy, customDelim, regexDelim, includeDelimiters);
        renderOutput(parts);
        splitButton.disabled = false;
        splitButton.innerHTML = `<i class="fas fa-cut mr-2"></i> تقسیم پرامپت`;

        saveCurrentStateToHistory(); // Save state after manual split
        saveLongTermPromptHistory(); // Save state to long-term history after manual split
    });

    copyAllButton.addEventListener('click', () => {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای کپی کردن وجود ندارد.', 'error');
            return;
        }
        const combinedText = promptParts.join('\n\n---\n\n');
        copyTextToClipboard(combinedText, 'همه‌ی بخش‌ها', copyAllButton);
    });

    loadExampleButton.addEventListener('click', async () => {
        loadExampleButton.disabled = true;
        loadExampleButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> بارگذاری...`;
        try {
            const response = await fetch('prompts/example.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.examplePrompt) {
                promptInput.value = data.examplePrompt;
                updateCharCount();
                updateWordCount();
                updateTokenCount();
                setTimeout(() => {
                    triggerAutoSplit();
                    saveCurrentStateToHistory(); // Save example to undo history
                    saveLongTermPromptHistory(); // Save example as first long-term history entry
                }, 100);
                showMessage('مثال با موفقیت بارگذاری شد.', 'success');
            } else {
                showMessage('فرمت فایل مثال نامعتبر است.', 'error');
            }
        } catch (error) {
            console.error('Error loading example prompt:', error);
            showMessage('خطا در بارگذاری فایل مثال.', 'error');
        } finally {
            loadExampleButton.disabled = false;
            loadExampleButton.innerHTML = `<i class="fas fa-file-alt mr-2"></i> بارگذاری مثال`;
        }
    });

    clearAllButton.addEventListener('click', () => {
        showConfirmationModal('آیا مطمئنید می‌خواهید همه چیز را پاک کنید؟ این عمل برگشت‌ناپذیر است.', clearAll);
    });
    clearOutputOnlyButton.addEventListener('click', clearOutputOnly);
    exportTextButton.addEventListener('click', exportTextFile);
    exportMarkdownButton.addEventListener('click', exportMarkdownFile); // New
    exportJsonButton.addEventListener('click', exportJsonFile);
    savePromptButton.addEventListener('click', saveCurrentPrompt);
    shareButton.addEventListener('click', generateShareableUrl);
    clearHistoryButton.addEventListener('click', clearPromptHistory); // New listener for clear history

    loadPromptDropdownToggle.addEventListener('click', () => {
        loadPromptDropdownMenu.classList.toggle('hidden');
        if (!loadPromptDropdownMenu.classList.contains('hidden')) {
            renderSavedPromptsList();
        }
        // Toggle aria-expanded
        const isExpanded = loadPromptDropdownToggle.getAttribute('aria-expanded') === 'true';
        loadPromptDropdownToggle.setAttribute('aria-expanded', !isExpanded);
    });

    promptHistoryDropdownToggle.addEventListener('click', () => {
        promptHistoryDropdownMenu.classList.toggle('hidden');
        if (!promptHistoryDropdownMenu.classList.contains('hidden')) {
            renderPromptHistoryList();
        }
        // Toggle aria-expanded
        const isExpanded = promptHistoryDropdownToggle.getAttribute('aria-expanded') === 'true';
        promptHistoryDropdownToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // New: Prompt Templates Dropdown Toggle
    templateDropdownToggle.addEventListener('click', () => {
        templateDropdownMenu.classList.toggle('hidden');
        if (!templateDropdownMenu.classList.contains('hidden')) {
            renderPromptTemplates();
        }
        const isExpanded = templateDropdownToggle.getAttribute('aria-expanded') === 'true';
        templateDropdownToggle.setAttribute('aria-expanded', !isExpanded);
    });

    addTemplateButton.addEventListener('click', addPromptTemplate);
    aiConvertMarkdownButton.addEventListener('click', exportAiResponseMarkdown);
    aiConvertJsonButton.addEventListener('click', exportAiResponseJson);
    cleanEmptyLinesButton.addEventListener('click', cleanEmptyLines);
    trimWhitespaceButton.addEventListener('click', trimExtraWhitespace);
    lowercaseButton.addEventListener('click', convertToLowercase);
    uppercaseButton.addEventListener('click', convertToUppercase);
    toggleCompactViewButton.addEventListener('click', toggleCompactView);

    // Close dropdowns if clicked outside
    document.addEventListener('click', (event) => {
        if (!loadPromptDropdownToggle.contains(event.target) && !loadPromptDropdownMenu.contains(event.target)) {
            loadPromptDropdownMenu.classList.add('hidden');
            loadPromptDropdownToggle.setAttribute('aria-expanded', 'false');
        }
        if (!promptHistoryDropdownToggle.contains(event.target) && !promptHistoryDropdownMenu.contains(event.target) && !confirmModal.contains(event.target) && !inputModal.contains(event.target)) {
            promptHistoryDropdownMenu.classList.add('hidden');
            promptHistoryDropdownToggle.setAttribute('aria-expanded', 'false');
        }
        // New: Close template dropdown if clicked outside
        if (!templateDropdownToggle.contains(event.target) && !templateDropdownMenu.contains(event.target)) {
            templateDropdownMenu.classList.add('hidden');
            templateDropdownToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // New: Close input modal if clicking its specific close button
    inputModalCloseButton.addEventListener('click', hideInputModal);


    // Toggle visibility of custom/regex delimiter inputs based on strategy selection
    function toggleDelimiterInputs() {
        const strategy = splitStrategySelect.value;
        if (strategy === 'custom') {
            customDelimiterContainer.classList.remove('hidden');
            regexDelimiterContainer.classList.add('hidden');
        } else if (strategy === 'regex') {
            regexDelimiterContainer.classList.remove('hidden');
            customDelimiterContainer.classList.add('hidden');
        } else {
            customDelimiterContainer.classList.add('hidden');
            regexDelimiterContainer.classList.add('hidden');
        }
        saveSettings();
    }
    splitStrategySelect.addEventListener('change', toggleDelimiterInputs);
    
    // Save settings and trigger auto-split when these inputs change (debounced for text inputs)
    maxCharsPerPartInput.addEventListener('input', () => {
        updateMaxCharsPerPart();
        triggerAutoSplit();
    });

    const DEBOUNCE_DELAY_SETTINGS = 300;
    let debounceTimerSettings;
    const debounceSaveSettings = () => {
        clearTimeout(debounceTimerSettings);
        debounceTimerSettings = setTimeout(saveSettings, DEBOUNCE_DELAY_SETTINGS);
    };

    customDelimiterInput.addEventListener('input', debounceSaveSettings);
    regexDelimiterInput.addEventListener('input', debounceSaveSettings);
    partPrefixInput.addEventListener('input', debounceSaveSettings);
    partSuffixInput.addEventListener('input', debounceSaveSettings);
    // New: AI advanced settings inputs also trigger save
    aiTemperatureInput.addEventListener('input', debounceSaveSettings);
    aiTopPInput.addEventListener('input', debounceSaveSettings);
    aiResponseCharLimitInput.addEventListener('input', debounceSaveSettings);
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', () => {
            localStorage.setItem('promptPartoApiKey', apiKeyInput.value.trim());
        });
    }
    
    includeDelimitersInOutputCheckbox.addEventListener('change', () => {
        saveSettings();
        triggerAutoSplit();
    });


    // Listen for input changes to update character/word/token count AND trigger auto-split/history save
    let debounceTimerAutoSplit;
    const DEBOUNCE_DELAY_AUTO_SPLIT = 500;

    promptInput.addEventListener('input', () => {
        updateCharCount();
        updateWordCount();
        updateTokenCount();
        clearTimeout(debounceTimerAutoSplit);
        debounceTimerAutoSplit = setTimeout(() => {
            triggerAutoSplit();
            saveCurrentStateToHistory(); // Save to undo history on input
            saveLongTermPromptHistory(); // Save to long-term history on input
            saveAutoPrompt(); // Trigger auto-save on input
        }, DEBOUNCE_DELAY_AUTO_SPLIT);
    });

    // --- Debounce for Auto-Split (moved to top level for clarity) ---
    function triggerAutoSplit() {
        if (promptInput.value.trim() !== '') {
            const prompt = promptInput.value;
            const strategy = splitStrategySelect.value;
            const customDelim = customDelimiterInput.value;
            const regexDelim = regexDelimiterInput.value;
            const includeDelimiters = includeDelimitersInOutputCheckbox.checked;

            // Basic validation for regex before splitting
            if (strategy === 'regex' && regexDelim.trim() !== '') {
                try {
                    new RegExp(regexDelim); // Test if regex is valid
                } catch (e) {
                    showMessage(`عبارت با قاعده نامعتبر: ${e.message}`, 'error');
                    splitButton.disabled = false;
                    splitButton.innerHTML = `<i class="fas fa-cut mr-2"></i> تقسیم پرامپت`;
                    return;
                }
            }

            splitButton.disabled = true;
            splitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال تقسیم...`;
            
            setTimeout(() => {
                const parts = splitPrompt(prompt, strategy, customDelim, regexDelim, includeDelimiters);
                renderOutput(parts);
                splitButton.disabled = false;
                splitButton.innerHTML = `<i class="fas fa-cut mr-2"></i> تقسیم پرامپت`;
            }, 50);
        } else {
            clearOutputOnly();
        }
    }


    // --- Local Storage Management for Saved Prompts (for persistent saved prompts, distinct from history) ---

    /**
     * Retrieves saved prompts from local storage.
     * پرامپت‌های ذخیره‌شده را از حافظه محلی بازیابی می‌کند.
     * @returns {Array<Object>} An array of saved prompt objects.
     */
    function getSavedPrompts() {
        try {
            const stored = localStorage.getItem('promptPartoSavedPrompts');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error parsing saved prompts from localStorage:', e);
            return [];
        }
    }

    /**
     * Saves prompts to local storage.
     * پرامپت‌ها را در حافظه محلی ذخیره می‌کند.
     * @param {Array<Object>} prompts - The array of prompt objects to save.
     */
    function savePromptsToLocalStorage(prompts) {
        try {
            localStorage.setItem('promptPartoSavedPrompts', JSON.stringify(prompts));
        } catch (e) {
            console.error('Error saving prompts to localStorage:', e);
            showMessage('ذخیره پرامپت با مشکل مواجه شد. حافظه مرورگر پر است؟', 'error');
        }
    }

    /**
     * Adds the current prompt to local storage with a user-defined name.
     * پرامپت فعلی را با نامی که کاربر تعیین کرده است، به حافظه محلی اضافه می‌کند.
     */
    function saveCurrentPrompt() {
        const promptContent = promptInput.value.trim();
        if (!promptContent) {
            showMessage('پرامپتی برای ذخیره کردن وجود ندارد.', 'error');
            return;
        }

        const defaultName = `پرامپت ${new Date().toLocaleString()}`;

        showInputModal(
            'ذخیره پرامپت',
            'لطفاً یک نام برای پرامپت خود وارد کنید:',
            'نام پرامپت',
            defaultName,
            (promptName) => {
                if (!promptName || promptName.trim() === '') {
                    showMessage('نام پرامپت نمی‌تواند خالی باشد.', 'error');
                    return;
                }

                const savedPrompts = getSavedPrompts();
                const existingPromptIndex = savedPrompts.findIndex(p => p.name === promptName.trim());

                if (existingPromptIndex !== -1) {
                    showConfirmationModal(`پرامپتی با نام "${promptName.trim()}" از قبل وجود دارد. آیا می‌خواهید آن را بازنویسی کنید؟`, () => {
                        savedPrompts[existingPromptIndex].content = promptContent;
                        savePromptsToLocalStorage(savedPrompts);
                        renderSavedPromptsList();
                        showMessage(`پرامپت "${promptName.trim()}" با موفقیت بازنویسی شد.`, 'success');
                    }, 'بازنویسی پرامپت');
                } else {
                    savedPrompts.push({ name: promptName.trim(), content: promptContent });
                    savePromptsToLocalStorage(savedPrompts);
                    renderSavedPromptsList();
                    showMessage(`پرامپت "${promptName.trim()}" با موفقیت ذخیره شد.`, 'success');
                }
            },
            'ذخیره',
            'لغو'
        );
    }

    /**
     * Renders the list of saved prompts in the dropdown menu.
     * لیست پرامپت‌های ذخیره‌شده را در منوی کشویی رندر می‌کند.
     */
    function renderSavedPromptsList() {
        const savedPrompts = getSavedPrompts();
        savedPromptsList.innerHTML = '';

        if (savedPrompts.length === 0) {
            savedPromptsList.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 p-2">پرامپتی ذخیره نشده است.</p>';
            return;
        }

        savedPrompts.forEach(prompt => {
            const div = document.createElement('div');
            div.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'transition-colors', 'duration-200');
            div.setAttribute('role', 'menuitem');

            const loadLink = document.createElement('a');
            loadLink.href = '#';
            loadLink.classList.add('flex-grow', 'text-gray-700', 'dark:text-gray-200', 'block', 'px-2', 'py-1', 'text-sm', 'truncate');
            loadLink.textContent = prompt.name;
            loadLink.title = prompt.name;
            loadLink.addEventListener('click', (e) => {
                e.preventDefault();
                promptInput.value = prompt.content;
                updateCharCount();
                updateWordCount();
                updateTokenCount(); // Update token count
                showMessage(`پرامپت "${prompt.name}" بارگذاری شد.`, 'success');
                loadPromptDropdownMenu.classList.add('hidden');
                loadPromptDropdownToggle.setAttribute('aria-expanded', 'false'); // Close and update aria
                triggerAutoSplit();
                saveCurrentStateToHistory(); // Save state after loading from saved prompts to undo history
                saveLongTermPromptHistory(); // Save state after loading from saved prompts to long-term history
            });
            div.appendChild(loadLink);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-prompt-btn', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'p-1', 'rounded', 'text-xs', 'mr-2');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.title = `حذف "${prompt.name}"`;
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationModal(`آیا مطمئنید می‌خواهید پرامپت "${prompt.name}" را حذف کنید؟`, () => {
                    deletePrompt(prompt.name);
                    showMessage(`پرامپت "${prompt.name}" حذف شد.`, 'success');
                }, 'حذف پرامپت');
            });
            div.appendChild(deleteButton);

            savedPromptsList.appendChild(div);
        });
    }

    /**
     * Deletes a saved prompt by name from local storage.
     * یک پرامپت ذخیره‌شده را بر اساس نام از حافظه محلی حذف می‌کند.
     * @param {string} nameToDelete - The name of the prompt to delete.
     */
    function deletePrompt(nameToDelete) {
        let savedPrompts = getSavedPrompts();
        savedPrompts = savedPrompts.filter(p => p.name !== nameToDelete);
        savePromptsToLocalStorage(savedPrompts);
        renderSavedPromptsList();
    }

    // --- Prompt Templates Logic ---
    const DEFAULT_TEMPLATES = [
        { name: "ایمیل رسمی", content: "موضوع: [موضوع]\n\nبا سلام و احترام،\n\n[متن ایمیل رسمی]\n\nبا تشکر،\n[نام شما]" },
        { name: "داستان کوتاه", content: "عنوان: [عنوان داستان]\n\n[شروع داستان]\n\n[میانه داستان]\n\n[پایان داستان]" },
        { name: "ایده پردازی", content: "موضوع: [موضوع ایده پردازی]\n\nایده‌های اولیه:\n- [ایده 1]\n- [ایده 2]\n- [ایده 3]\n\nنکات کلیدی:\n- [نکته 1]\n- [نکته 2]" },
        { name: "خلاصه کتاب", content: "عنوان کتاب: [نام کتاب]\nنویسنده: [نام نویسنده]\n\nخلاصه:\n[خلاصه کلی کتاب]\n\nنکات کلیدی:\n- [نکته کلیدی 1]\n- [نکته کلیدی 2]\n\nبخش‌های مورد علاقه:\n[بخش مورد علاقه 1]\n[بخش مورد علاقه 2]" }
    ];

    let promptTemplates = [];

    function getSavedTemplates() {
        try {
            const stored = localStorage.getItem("promptPartoTemplates");
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Error parsing templates from localStorage:", e);
            return [];
        }
    }

    function saveTemplatesToLocalStorage(templates) {
        try {
            localStorage.setItem("promptPartoTemplates", JSON.stringify(templates));
        } catch (e) {
            console.error("Error saving templates to localStorage:", e);
            showMessage("ذخیره الگو با مشکل مواجه شد. حافظه مرورگر پر است؟", "error");
        }
    }

    function loadPromptTemplates() {
        const stored = getSavedTemplates();
        if (stored.length > 0) {
            promptTemplates = stored;
        } else {
            promptTemplates = [...DEFAULT_TEMPLATES];
        }
    }

    /**
     * Renders the list of prompt templates in the dropdown menu.
     * لیست الگوهای پرامپت را در منوی کشویی رندر می‌کند.
     */
    function renderPromptTemplates() {
        templateList.innerHTML = '';
        if (promptTemplates.length === 0) {
            templateList.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 p-2">الگویی وجود ندارد.</p>';
            return;
        }

        promptTemplates.forEach(template => {
            const div = document.createElement('div');
            div.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'transition-colors', 'duration-200');
            div.setAttribute('role', 'menuitem');

            const loadLink = document.createElement('a');
            loadLink.href = '#';
            loadLink.classList.add('flex-grow', 'text-gray-700', 'dark:text-gray-200', 'block', 'px-2', 'py-1', 'text-sm', 'truncate');
            loadLink.textContent = template.name;
            loadLink.title = template.name;
            loadLink.addEventListener('click', (e) => {
                e.preventDefault();
                promptInput.value = template.content;
                updateCharCount();
                updateWordCount();
                updateTokenCount();
                showMessage(`الگوی "${template.name}" بارگذاری شد.`, 'success');
                templateDropdownMenu.classList.add('hidden');
                templateDropdownToggle.setAttribute('aria-expanded', 'false');
                triggerAutoSplit();
                saveCurrentStateToHistory(); // Save loaded template to undo history
                saveLongTermPromptHistory(); // Save loaded template to long-term history
            });
            div.appendChild(loadLink);
            templateList.appendChild(div);
        });
    }


    // --- Global Data Export/Import ---

    /**
     * Exports all PromptParto data (settings, saved prompts, history) to a JSON file.
     * تمام داده‌های PromptParto (تنظیمات، پرامپت‌های ذخیره‌شده، تاریخچه) را به یک فایل JSON خروجی می‌دهد.
     */
    function exportAllUserData() {
        const allData = {
            settings: JSON.parse(localStorage.getItem('promptPartoSettings') || '{}'),
            savedPrompts: JSON.parse(localStorage.getItem('promptPartoSavedPrompts') || '[]'),
            promptHistory: JSON.parse(localStorage.getItem('promptPartoHistory') || '[]'),
            templates: JSON.parse(localStorage.getItem('promptPartoTemplates') || '[]')
        };
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'promptparto_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('تمام داده‌های شما با موفقیت خروجی گرفته شد!', 'success');
    }

    /**
     * Imports PromptParto data from a JSON file and applies it to local storage.
     * داده‌های PromptParto را از یک فایل JSON وارد کرده و به حافظه محلی اعمال می‌کند.
     */
    function importAllUserData() {
        importFileInput.click(); // Trigger hidden file input
    }

    importFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        showConfirmationModal(
                            'وارد کردن داده‌ها، داده‌های موجود را بازنویسی خواهد کرد. آیا مطمئنید؟',
                            () => { // On Confirm
                                if (importedData.settings) {
                                    localStorage.setItem('promptPartoSettings', JSON.stringify(importedData.settings));
                                }
                                if (importedData.savedPrompts) {
                                    localStorage.setItem('promptPartoSavedPrompts', JSON.stringify(importedData.savedPrompts));
                                }
                                if (importedData.promptHistory) {
                                    localStorage.setItem('promptPartoHistory', JSON.stringify(importedData.promptHistory));
                                }
                                if (importedData.templates) {
                                    localStorage.setItem('promptPartoTemplates', JSON.stringify(importedData.templates));
                                }
                                // Reload everything to reflect imported data
                                loadSettings();
                                loadAutoPrompt();
                                loadPromptHistoryFromLocalStorage();
                                loadPromptTemplates();
                                renderSavedPromptsList();
                                renderPromptHistoryList();
                                renderPromptTemplates();
                                triggerAutoSplit();
                                // Clear undo/redo history upon full data import
                                promptHistoryStack = [];
                                currentHistoryIndex = -1;
                                updateUndoRedoButtons();
                                showMessage('تمام داده‌ها با موفقیت وارد شدند!', 'success');
                            }
                        , 'وارد کردن داده‌ها');
                    } catch (parseError) {
                        showMessage('خطا در خواندن فایل JSON. فایل معتبر نیست.', 'error');
                        console.error('Error parsing imported JSON:', parseError);
                    }
                };
                reader.onerror = () => {
                    showMessage('خطا در خواندن فایل.', 'error');
                };
                reader.readAsText(file);
            } else {
                showMessage('لطفاً فقط فایل‌های JSON (.json) را انتخاب کنید.', 'error');
            }
        }
        importFileInput.value = ''; // Clear the file input for next time
    });


    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        const isCtrlCmd = e.ctrlKey || e.metaKey;

        if (isCtrlCmd) {
            switch (e.key.toLowerCase()) {
                case 'z': // Ctrl/Cmd + Z for Undo
                    e.preventDefault();
                    undoButton.click();
                    break;
                case 'y': // Ctrl/Cmd + Y for Redo
                    e.preventDefault();
                    redoButton.click();
                    break;
                case 's':
                    e.preventDefault();
                    saveCurrentPrompt();
                    break;
                case 'l':
                    if (e.altKey) {
                        e.preventDefault();
                        loadExampleButton.click();
                    }
                    break;
                case 'e':
                    e.preventDefault();
                    exportTextButton.click();
                    break;
                case 'm': // Ctrl/Cmd + M for Markdown Export
                    e.preventDefault();
                    exportMarkdownButton.click();
                    break;
                case 'j':
                    e.preventDefault();
                    exportJsonButton.click();
                    break;
                case 'c':
                    if (e.shiftKey) {
                        e.preventDefault();
                        clearAllButton.click(); // This will trigger the confirmation modal
                    }
                    break;
                case 'o':
                    e.preventDefault();
                    clearOutputOnlyButton.click();
                    break;
                case 'd': // Ctrl+D for Dark Mode Toggle
                    e.preventDefault();
                    darkModeToggle.click();
                    break;
                case 'h': // Ctrl+H for History Dropdown
                    e.preventDefault();
                    promptHistoryDropdownToggle.click();
                    break;
                case 't': // Ctrl+T for Templates Dropdown
                    e.preventDefault();
                    templateDropdownToggle.click();
                    break;
            }
        }
    });


    // Initial state setup on page load
    applyStateFromUrl(); // Try to apply state from URL first
    loadSettings(); // Load other settings from localStorage
    loadAutoPrompt(); // Load auto-saved draft
    loadPromptHistoryFromLocalStorage(); // Load history from local storage
    startAutoSave(); // Start auto-save interval

    // Initial population of undo/redo history if promptInput has content
    if (promptInput.value.trim() !== '') {
        saveCurrentStateToHistory();
    }
    updateUndoRedoButtons(); // Initialize undo/redo button states

    updateCharCount();
    updateWordCount();
    updateTokenCount(); // Initial update of token count

    renderSavedPromptsList();
    renderPromptHistoryList(); // Render history on load
    loadPromptTemplates();
    renderPromptTemplates();

    // Disable buttons initially (will be enabled by renderOutput if parts exist)
    copyAllButton.disabled = true;
    copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
    exportTextButton.disabled = true;
    exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
    exportMarkdownButton.disabled = true; // New
    exportMarkdownButton.classList.add('opacity-50', 'cursor-not-allowed'); // New
    exportJsonButton.disabled = true;
    exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
    clearOutputOnlyButton.disabled = true;
    clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');

    // Add event listeners for new data management buttons
    exportAllDataButton.addEventListener('click', exportAllUserData);
    importAllDataButton.addEventListener('click', importAllUserData);


    // Trigger an initial auto-split if there's content (either from URL or pre-existing)
    if (promptInput.value.trim() !== '') {
        triggerAutoSplit();
    } else {
        // If the prompt input is empty after loading, clear output, too.
        clearOutputOnly();
    }
});
