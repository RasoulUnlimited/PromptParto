document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const promptInput = document.getElementById('promptInput');
    const splitButton = document.getElementById('splitButton');
    const copyAllButton = document.getElementById('copyAllButton');
    const loadExampleButton = document.getElementById('loadExampleButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const clearOutputOnlyButton = document.getElementById('clearOutputOnlyButton');
    const exportTextButton = document.getElementById('exportTextButton');
    const exportJsonButton = document.getElementById('exportJsonButton');
    const outputContainer = document.getElementById('outputContainer');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const charCountDisplay = document.getElementById('charCount');
    const wordCountDisplay = document.getElementById('wordCount'); // New: Word count display
    const maxCharsPerPartInput = document.getElementById('maxCharsPerPart');
    const splitStrategySelect = document.getElementById('splitStrategy');
    const customDelimiterContainer = document.getElementById('customDelimiterContainer');
    const customDelimiterInput = document.getElementById('customDelimiter');
    const regexDelimiterContainer = document.getElementById('regexDelimiterContainer');
    const regexDelimiterInput = document.getElementById('regexDelimiter');
    const partPrefixInput = document.getElementById('partPrefix');
    const partSuffixInput = document.getElementById('partSuffix');
    const includeDelimitersInOutputCheckbox = document.getElementById('includeDelimitersInOutput'); // New checkbox
    const savePromptButton = document.getElementById('savePromptButton');
    const loadPromptDropdownToggle = document.getElementById('loadPromptDropdownToggle');
    const loadPromptDropdownMenu = document.getElementById('loadPromptDropdownMenu');
    const savedPromptsList = document.getElementById('savedPromptsList');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeText = document.getElementById('darkModeText');

    // AI Modal elements
    const aiResponseModal = document.getElementById('aiResponseModal');
    const closeAiModalButton = document.getElementById('closeAiModal');
    const aiLoadingSpinner = document.getElementById('aiLoadingSpinner');
    const aiPromptInput = document.getElementById('aiPromptInput'); // New: Input for custom AI prompts
    const aiResponseTextarea = document.getElementById('aiResponseTextarea');
    const aiSummarizeButton = document.getElementById('aiSummarizeButton'); // New: Summarize AI button
    const aiRephraseButton = document.getElementById('aiRephraseButton'); // New: Rephrase AI button
    const aiElaborateButton = document.getElementById('aiElaborateButton'); // New: Elaborate AI button
    const aiSendToAIButton = document.getElementById('aiSendToAIButton'); // New: Send Custom Prompt to AI
    const copyAiResponseButton = document.getElementById('copyAiResponseButton');
    const insertAiResponseButton = document.getElementById('insertAiResponseButton');

    // Default constants for splitting logic
    let MAX_CHARS_PER_PART = parseInt(maxCharsPerPartInput.value, 10) || 3800;
    const MIN_CHARS_FOR_NEW_SPLIT = 100; // Minimum characters remaining to attempt a new split

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
        theme: 'light' // Default theme
    };

    /**
     * Loads settings from local storage and applies them to the UI.
     * تنظیمات را از حافظه محلی بارگذاری کرده و به رابط کاربری اعمال می‌کند.
     */
    function loadSettings() {
        try {
            const storedSettings = JSON.parse(localStorage.getItem('promptPartoSettings'));
            if (storedSettings) {
                // Use Object.assign to merge, but iterate for specific UI elements
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
                applyTheme(settings.theme); // Apply theme
            } else {
                // If no settings stored, check system preference for initial theme
                const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDarkMode ? 'dark' : 'light');
            }
        } catch (e) {
            console.error('Error loading settings from localStorage:', e); // خطا در بارگذاری تنظیمات
            // Fallback to defaults if parsing fails
            applyTheme('light');
        }
        updateMaxCharsPerPart(); // Ensure MAX_CHARS_PER_PART global variable is updated
        toggleDelimiterInputs(); // Ensure correct delimiter input is shown/hidden
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
        try {
            localStorage.setItem('promptPartoSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings to localStorage:', e); // خطا در ذخیره تنظیمات
            showMessage('ذخیره تنظیمات با مشکل مواجه شد. حافظه مرورگر پر است؟', 'error'); // Failed to save settings. Is browser storage full?
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
            darkModeText.textContent = 'حالت روشن'; // Light Mode
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('dark');
            darkModeText.textContent = 'حالت تاریک'; // Dark Mode
            darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
    }

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        saveSettings(); // Ensure theme change is saved immediately
    });

    // --- Utility Functions ---

    /**
     * Updates the MAX_CHARS_PER_PART based on user input and validates it.
     * MAX_CHARS_PER_PART را بر اساس ورودی کاربر به روز کرده و اعتبار سنجی می‌کند.
     */
    function updateMaxCharsPerPart() {
        let newValue = parseInt(maxCharsPerPartInput.value, 10);
        if (isNaN(newValue) || newValue < MIN_CHARS_FOR_NEW_SPLIT) {
            newValue = 3800; // Default or minimum sensible value
            maxCharsPerPartInput.value = newValue; // Correct the input field
            showMessage('حداکثر کاراکتر باید یک عدد معتبر و حداقل 100 باشد. به مقدار پیش‌فرض تنظیم شد.', 'error'); // Max characters must be a valid number and at least 100. Set to default.
        }
        MAX_CHARS_PER_PART = newValue;
        saveSettings(); // Save the updated setting
    }

    /**
     * Displays a message in the message box.
     * پیامی را در جعبه پیام نمایش می‌دهد.
     * @param {string} message - The message to display.
     * @param {string} type - 'success', 'error', or 'info'.
     */
    function showMessage(message, type) {
        messageText.textContent = message;
        // Reset classes for the message box
        messageBox.className = 'p-4 rounded-lg relative mt-6'; // Reset base classes
        messageBox.classList.add('border'); // Ensure border is always there for messages

        if (type === 'success') {
            messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        } else if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else if (type === 'info') {
             messageBox.classList.add('bg-blue-100', 'border-blue-400', 'text-blue-700');
        }
        messageBox.classList.remove('hidden');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000); // Hide after 5 seconds
    }

    /**
     * Copies text to the clipboard and provides visual feedback on the button.
     * متن را در کلیپ‌بورد کپی کرده و بازخورد بصری روی دکمه ارائه می‌دهد.
     * Using document.execCommand('copy') for better compatibility within iframes.
     * @param {string} text - The text to copy.
     * @param {string} [feedbackName='متن'] - Optional: Name of the item being copied for feedback message.
     * @param {HTMLElement} [buttonElement] - Optional: The button element to provide visual feedback.
     */
    function copyTextToClipboard(text, feedbackName = 'متن', buttonElement = null) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Avoid scrolling to bottom
        textarea.style.left = '-9999px'; // Move off-screen
        textarea.style.opacity = '0'; // Make it invisible
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showMessage(`${feedbackName} با موفقیت کپی شد!`, 'success'); // ... successfully copied!

            if (buttonElement) {
                const originalText = buttonElement.innerHTML;
                buttonElement.classList.add('copied');
                buttonElement.innerHTML = `<i class="fas fa-check ml-2"></i> کپی شد!`; // Copied!
                setTimeout(() => {
                    buttonElement.innerHTML = originalText;
                    buttonElement.classList.remove('copied');
                }, 1500); // Revert after 1.5 seconds
            }

        } catch (err) {
            console.error('Failed to copy text: ', err); // Failed to copy text
            showMessage(`خطا در کپی کردن ${feedbackName}.`, 'error'); // Error copying ...
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * Updates the character count display.
     * نمایشگر تعداد کاراکترها را به روز می‌کند.
     */
    function updateCharCount() {
        const count = promptInput.value.length;
        charCountDisplay.textContent = `کاراکترها: ${count}`; // Characters:

        if (count > MAX_CHARS_PER_PART) {
            charCountDisplay.classList.remove('text-gray-500', 'dark:text-gray-400');
            charCountDisplay.classList.add('text-red-600', 'font-bold');
        } else {
            charCountDisplay.classList.remove('text-red-600', 'font-bold');
            charCountDisplay.classList.add('text-gray-500', 'dark:text-gray-400');
        }
    }

    /**
     * Updates the word count display.
     * نمایشگر تعداد کلمات را به روز می‌کند.
     */
    function updateWordCount() {
        const text = promptInput.value;
        const words = text.match(/\b\w+\b/g); // Simple regex to count words
        const count = words ? words.length : 0;
        wordCountDisplay.textContent = `کلمات: ${count}`; // Words:
    }


    /**
     * Clears the prompt input and output area.
     * ورودی پرامپت و ناحیه خروجی را پاک می‌کند.
     */
    function clearAll() {
        promptInput.value = '';
        outputContainer.innerHTML = '';
        updateCharCount(); // Reset character count
        updateWordCount(); // Reset word count
        // Disable buttons
        copyAllButton.disabled = true;
        copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportTextButton.disabled = true;
        exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportJsonButton.disabled = true;
        exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
        clearOutputOnlyButton.disabled = true;
        clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');

        showMessage('همه چیز پاک شد.', 'success'); // Everything cleared.
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
        exportJsonButton.disabled = true;
        exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
        clearOutputOnlyButton.disabled = true;
        clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');
        showMessage('خروجی پاک شد.', 'info'); // Output cleared.
    }

    /**
     * Exports all split parts to a single text file.
     * تمام بخش‌های تقسیم‌شده را به یک فایل متنی واحد خروجی می‌دهد.
     */
    function exportTextFile() {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای خروجی گرفتن وجود ندارد.', 'error'); // No parts to export.
            return;
        }
        const combinedText = promptParts.join('\n\n--- PART BREAK ---\n\n'); // Clearer separator for export
        
        const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt_parts.txt';
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up
        showMessage('بخش‌ها با موفقیت در یک فایل متنی ذخیره شدند.', 'success'); // Parts successfully saved to a text file.
    }

    /**
     * Exports all split parts to a JSON file.
     * تمام بخش‌های تقسیم‌شده را به یک فایل JSON خروجی می‌دهد.
     */
    function exportJsonFile() {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای خروجی گرفتن وجود ندارد.', 'error'); // No parts to export.
            return;
        }
        // Each part is an object with 'part' property
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
        showMessage('بخش‌ها با موفقیت در یک فایل JSON ذخیره شدند.', 'success'); // Parts successfully saved to a JSON file.
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
        // Check for fenced code blocks
        if (line.trim().startsWith('```')) return true;
        // Check for list items (e.g., - item, * item, 1. item)
        if (/^\s*([-*+]|\d+\.)\s/.test(line)) return true;
        // Check for highly indented lines (often code)
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

        if (strategy === 'custom' && customDelim.length > 0) {
            // Manual split for custom delimiter if inclusion is needed, otherwise use simple split
            if (includeDelimiters) {
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
                initialChunks = prompt.split(customDelim);
            }

        } else if (strategy === 'regex' && regexDelim.length > 0) {
            try {
                const regex = new RegExp(`(${regexDelim})`, 'g'); // Capture the delimiter
                const splitResult = prompt.split(regex);
                
                if (includeDelimiters) {
                    // Reassemble to include delimiter with the preceding chunk
                    const tempCombined = [];
                    for (let i = 0; i < splitResult.length; i++) {
                        if (i % 2 === 0) { // Content part
                            let currentContent = splitResult[i] || '';
                            if (i + 1 < splitResult.length) { // If there's a delimiter after
                                currentContent += (splitResult[i + 1] || ''); // Append delimiter
                            }
                            if (currentContent.trim() !== '') {
                                tempCombined.push(currentContent);
                            }
                        }
                    }
                    initialChunks = tempCombined;
                } else {
                    initialChunks = splitResult.filter((_, i) => i % 2 === 0 && _.trim() !== ''); // Only content parts
                }
            } catch (e) {
                showMessage(`خطا در عبارت با قاعده (Regex): ${e.message}`, 'error'); // Regex error
                return [];
            }

        } else if (strategy === 'paragraph') {
            initialChunks = prompt.split('\n\n');
        } else if (strategy === 'line') {
            initialChunks = prompt.split('\n');
        } else { // 'auto' or fallback
            initialChunks = prompt.split('\n\n');
        }

        const parts = [];

        initialChunks.forEach(chunk => {
            chunk = chunk.trim();
            if (chunk === '') return;

            if (chunk.length <= MAX_CHARS_PER_PART) {
                parts.push(chunk);
            } else {
                let subChunksToProcess;
                if (strategy === 'auto' || strategy === 'paragraph' || strategy === 'custom' || (strategy === 'regex' && includeDelimiters)) {
                    subChunksToProcess = chunk.split('\n');
                } else if (strategy === 'regex' && !includeDelimiters) {
                    subChunksToProcess = [chunk];
                } else { // 'line'
                    subChunksToProcess = [chunk];
                }

                let tempPart = '';

                for (let i = 0; i < subChunksToProcess.length; i++) {
                    const subChunk = subChunksToProcess[i];
                    const proposedAddition = (tempPart === '' ? '' : '\n') + subChunk;

                    if ((tempPart + proposedAddition).length <= MAX_CHARS_PER_PART) {
                        tempPart += proposedAddition;
                    } else {
                        if (tempPart !== '') {
                            parts.push(tempPart);
                        }
                        tempPart = subChunk;
                    }
                }
                if (tempPart !== '') {
                    parts.push(tempPart);
                }
            }
        });

        // Final pass: Ensure no part exceeds MAX_CHARS_PER_PART, force split if necessary.
        const finalParts = [];
        parts.forEach(part => {
            if (part.length <= MAX_CHARS_PER_PART) {
                finalParts.push(part);
            } else {
                let remaining = part;
                while (remaining.length > 0) {
                    let splitPoint = MAX_CHARS_PER_PART; // Default to hard limit

                    let potentialSplitSegment = remaining.substring(0, MAX_CHARS_PER_PART);
                    let bestNaturalBreak = -1;
                    const breakSearchRangeStart = MAX_CHARS_PER_PART - MIN_CHARS_FOR_NEW_SPLIT;

                    // Iterate lines in reverse to find a good break point
                    const linesInSegment = potentialSplitSegment.split('\n');
                    let currentLength = potentialSplitSegment.length;
                    for (let i = linesInSegment.length - 1; i >= 0; i--) {
                        const currentLine = linesInSegment[i];
                        // Calculate the start index of the current line within `potentialSplitSegment`
                        const lineStartIndex = currentLength - currentLine.length - (i > 0 ? 1 : 0); // Account for newline

                        // If the line is within our desirable break search range
                        if (lineStartIndex >= breakSearchRangeStart) {
                            if (strategy === 'auto' && isLikelyMarkdownBlockLine(currentLine)) {
                                // If current line is part of a block, try to find a newline *before* it.
                                const prevNewlineIndex = potentialSplitSegment.substring(0, lineStartIndex).lastIndexOf('\n');
                                if (prevNewlineIndex !== -1 && prevNewlineIndex >= breakSearchRangeStart) {
                                    bestNaturalBreak = prevNewlineIndex;
                                    break;
                                }
                            } else {
                                // Check for natural sentence breaks
                                if (currentLine.endsWith('.') || currentLine.endsWith('?') || currentLine.endsWith('!')) {
                                    bestNaturalBreak = currentLength; // Break after the sentence
                                    break;
                                }
                                // Check for simple newlines
                                if (currentLine.trim().length > 0) { // Avoid breaking on empty lines if possible
                                    bestNaturalBreak = currentLength; // Break after this line
                                    break;
                                }
                            }
                        }
                        currentLength -= (currentLine.length + (i > 0 ? 1 : 0)); // Move backwards in length
                    }

                    if (bestNaturalBreak !== -1) {
                        splitPoint = bestNaturalBreak + 1; // Split right after the natural break
                    } else {
                        // Fallback: if no good natural break found, find the last newline before the hard limit,
                        // or simply the hard limit if no newline is found in the segment.
                        let fallbackNewline = potentialSplitSegment.lastIndexOf('\n');
                        if (fallbackNewline !== -1) {
                            splitPoint = fallbackNewline + 1;
                        } else {
                            splitPoint = Math.min(MAX_CHARS_PER_PART, remaining.length); // Force split at max char if no newline
                        }
                    }
                    
                    finalParts.push(remaining.substring(0, splitPoint).trim());
                    remaining = remaining.substring(splitPoint).trim();
                }
            }
        });

        return finalParts.filter(p => p.length > 0); // Remove any empty parts that might result from trimming
    }

    /**
     * Renders the split prompt parts to the output container.
     * Also manages the state of 'Copy All' and 'Export All' buttons.
     * Applies user-defined prefix and suffix.
     * بخش‌های پرامپت تقسیم‌شده را در کانتینر خروجی رندر می‌کند.
     * @param {Array<string>} parts - An array of split prompt parts.
     */
    function renderOutput(parts) {
        outputContainer.innerHTML = ''; // Clear previous output
        
        const partPrefix = partPrefixInput.value;
        const partSuffix = partSuffixInput.value;

        if (parts.length === 0) {
            copyAllButton.disabled = true;
            copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
            exportTextButton.disabled = true;
            exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
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
        exportJsonButton.disabled = false;
        exportJsonButton.classList.remove('opacity-50', 'cursor-not-allowed');
        clearOutputOnlyButton.disabled = false;
        clearOutputOnlyButton.classList.remove('opacity-50', 'cursor-not-allowed');


        parts.forEach((partContent, index) => {
            const partBox = document.createElement('div');
            partBox.classList.add('prompt-part-box', 'dark:bg-gray-800', 'dark:border-gray-600', 'dark:shadow-lg');
            partBox.draggable = true; // Enable dragging
            partBox.dataset.originalContent = partContent; // Store original content for reordering/AI
            partBox.dataset.originalIndex = index; // Store original index for reordering logic (if needed)

            // Add title for the part
            const partTitle = document.createElement('h3');
            partTitle.classList.add('text-lg', 'font-medium', 'mb-2', 'text-gray-900', 'dark:text-gray-200');
            partTitle.textContent = `بخش ${index + 1} ( ${partContent.length} کاراکتر )`; // Section X (Y characters)
            partBox.appendChild(partTitle);

            // Add character limit bar
            const charLimitBarContainer = document.createElement('div');
            charLimitBarContainer.classList.add('char-limit-bar-container');
            const charLimitBar = document.createElement('div');
            charLimitBar.classList.add('char-limit-bar');
            
            const percentage = (partContent.length / MAX_CHARS_PER_PART) * 100;
            charLimitBar.style.width = `${Math.min(100, percentage)}%`; // Cap at 100%
            if (percentage > 90) {
                charLimitBar.classList.add('danger');
            } else if (percentage > 70) {
                charLimitBar.classList.add('warning');
            }
            charLimitBarContainer.appendChild(charLimitBar);
            partBox.appendChild(charLimitBarContainer);


            // Add preformatted text content with prefix/suffix
            const pre = document.createElement('pre');
            pre.textContent = partPrefix + partContent + partSuffix; // Apply prefix and suffix
            pre.setAttribute('aria-label', `Prompt Part ${index + 1}`);
            partBox.appendChild(pre);

            // Button container for copy and AI actions
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('flex', 'flex-wrap', 'gap-2', 'mt-4');

            // Add copy button for individual part
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button', 'flex-grow', 'flex', 'items-center', 'justify-center');
            copyButton.innerHTML = `<i class="fas fa-copy ml-2"></i> کپی بخش`; // Copy Section
            copyButton.setAttribute('aria-label', `Copy Part ${index + 1}`);
            copyButton.addEventListener('click', () => {
                copyTextToClipboard(pre.textContent, `بخش ${index + 1}`, copyButton); // Copy with prefix/suffix
            });
            buttonContainer.appendChild(copyButton);

            // Add AI Refine button
            const aiRefineButton = document.createElement('button');
            aiRefineButton.classList.add('ai-button', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'flex-grow', 'flex', 'items-center', 'justify-center');
            aiRefineButton.innerHTML = `<i class="fas fa-robot ml-2"></i> اصلاح با هوش مصنوعی`; // Refine with AI
            aiRefineButton.title = 'اصلاح یا خلاصه سازی این بخش با هوش مصنوعی'; // Refine or summarize this section with AI
            aiRefineButton.addEventListener('click', () => {
                openAiModal(partContent, index); // Pass original content and index
            });
            buttonContainer.appendChild(aiRefineButton);

            partBox.appendChild(buttonContainer);
            outputContainer.appendChild(partBox);
        });

        addDragDropListenersToParts(); // Add listeners to newly rendered parts
    }

    // --- AI Integration Logic ---
    let currentPartOriginalContent = null; // Stores the original content of the part being refined
    let currentPartOriginalIndex = -1; // Stores the original index of the part being refined within the currently displayed output

    /**
     * Opens the AI response modal and prepares for AI interaction.
     * پنجره مدال پاسخ هوش مصنوعی را باز کرده و آن را برای تعامل با هوش مصنوعی آماده می‌کند.
     * @param {string} partContent - The content of the prompt part selected.
     * @param {number} partIndex - The index of the part in the current output for replacement.
     */
    function openAiModal(partContent, partIndex) {
        currentPartOriginalContent = partContent;
        currentPartOriginalIndex = partIndex;
        aiResponseTextarea.value = ''; // Clear previous response
        aiPromptInput.value = ''; // Clear previous custom prompt
        aiLoadingSpinner.classList.add('hidden'); // Hide spinner initially
        aiResponseTextarea.classList.remove('hidden'); // Ensure textarea is visible
        aiResponseModal.classList.add('open'); // Show modal
        // aiResponseTextarea.focus(); // Focus on response textarea
    }

    /**
     * Sends a request to the Gemini API to refine a prompt part.
     * درخواستی را به API گیمی‌نی برای اصلاح یک بخش از پرامپت ارسال می‌کند.
     * @param {string} textToRefine - The text content to be refined by AI.
     * @param {string} commandPrompt - The specific instruction for the AI (e.g., "Summarize", "Rephrase").
     */
    async function sendToAI(textToRefine, commandPrompt) {
        aiResponseTextarea.value = ''; // Clear response area before new request
        aiLoadingSpinner.classList.remove('hidden'); // Show spinner
        aiResponseTextarea.classList.add('hidden'); // Hide textarea during loading
        copyAiResponseButton.disabled = true;
        insertAiResponseButton.disabled = true;
        aiSendToAIButton.disabled = true;
        aiSendToAIButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال ارسال...`; // Sending...

        // Ensure the custom prompt is used if present, otherwise use predefined command
        const finalCommand = aiPromptInput.value.trim() || commandPrompt;

        try {
            const prompt = `${finalCommand}:\n\n"${textToRefine}"\n\nلطفا فقط متن اصلاح شده یا خلاصه شده را برگردانید و از هرگونه مقدمه یا خاتمه اضافه خودداری کنید.`; // Please return only the modified or summarized text and avoid any extra introduction or conclusion.

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will provide this at runtime
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
                const aiResponse = result.candidates[0].content.parts[0].text;
                aiResponseTextarea.value = aiResponse.trim();
                showMessage(`پاسخ هوش مصنوعی دریافت شد.`, 'success'); // AI response received.
            } else {
                aiResponseTextarea.value = 'پاسخی از هوش مصنوعی دریافت نشد. لطفاً دوباره تلاش کنید.'; // No response from AI. Please try again.
                showMessage('خطا در دریافت پاسخ هوش مصنوعی.', 'error'); // Error receiving AI response.
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error); // Error calling Gemini API
            aiResponseTextarea.value = 'خطا در ارتباط با هوش مصنوعی. لطفاً اتصال اینترنت خود را بررسی کنید یا بعداً تلاش کنید.'; // Error communicating with AI. Please check your internet connection or try again later.
            showMessage('خطا در ارتباط با هوش مصنوعی.', 'error'); // Error communicating with AI.
        } finally {
            aiLoadingSpinner.classList.add('hidden'); // Hide spinner
            aiResponseTextarea.classList.remove('hidden'); // Show textarea with response
            copyAiResponseButton.disabled = false;
            insertAiResponseButton.disabled = false;
            aiSendToAIButton.disabled = false;
            aiSendToAIButton.innerHTML = `<i class="fas fa-paper-plane ml-2"></i> ارسال به هوش مصنوعی`; // Send to AI
        }
    }

    // Event listeners for AI modal buttons
    closeAiModalButton.addEventListener('click', () => {
        aiResponseModal.classList.remove('open');
        currentPartOriginalContent = null; // Clear stored content
        currentPartOriginalIndex = -1;
    });

    aiSummarizeButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را خلاصه کن'; // Summarize this text
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error'); // No text selected for AI processing.
        }
    });

    aiRephraseButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را بازنویسی کن تا واضح تر و روان تر شود'; // Rephrase this text to be clearer and more fluent
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiElaborateButton.addEventListener('click', () => {
        if (currentPartOriginalContent) {
            aiPromptInput.value = 'این متن را بیشتر توضیح بده و جزئیات بیشتری اضافه کن'; // Elaborate on this text and add more details
            sendToAI(currentPartOriginalContent, aiPromptInput.value);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    aiSendToAIButton.addEventListener('click', () => {
        const customPrompt = aiPromptInput.value.trim();
        if (!customPrompt) {
            showMessage('لطفاً دستورالعمل خود را برای هوش مصنوعی وارد کنید.', 'error'); // Please enter your instructions for the AI.
            return;
        }
        if (currentPartOriginalContent) {
            sendToAI(currentPartOriginalContent, customPrompt);
        } else {
            showMessage('متنی برای پردازش با هوش مصنوعی انتخاب نشده است.', 'error');
        }
    });

    copyAiResponseButton.addEventListener('click', () => {
        copyTextToClipboard(aiResponseTextarea.value, 'پاسخ هوش مصنوعی', copyAiResponseButton); // AI Response
    });

    insertAiResponseButton.addEventListener('click', () => {
        if (currentPartOriginalContent && aiResponseTextarea.value.trim() && currentPartOriginalIndex !== -1) {
            const replacementText = aiResponseTextarea.value.trim();
            const currentParts = Array.from(outputContainer.children).map(el => el.dataset.originalContent); // Get current ordered parts

            // Replace the specific part's content in our internal array
            if (currentPartOriginalIndex >= 0 && currentPartOriginalIndex < currentParts.length) {
                currentParts[currentPartOriginalIndex] = replacementText;
            } else {
                // Fallback if index is somehow invalid
                showMessage('خطا در درج پاسخ هوش مصنوعی: بخش مورد نظر یافت نشد.', 'error'); // Error inserting AI response: Target section not found.
                return;
            }

            // Rebuild the prompt input with the modified part
            const updatedPromptValue = currentParts.join('\n\n'); // Reconstruct using paragraph breaks
            promptInput.value = updatedPromptValue;
            
            showMessage('پاسخ هوش مصنوعی در پرامپت اصلی درج شد.', 'success'); // AI response inserted into main prompt.
            
            updateCharCount();
            updateWordCount();
            triggerAutoSplit(); // Re-split the prompt after modification
            aiResponseModal.classList.remove('open'); // Close modal
            currentPartOriginalContent = null; // Clear stored content
            currentPartOriginalIndex = -1;
        } else {
            showMessage('پاسخ هوش مصنوعی برای درج خالی است.', 'error'); // AI response is empty for insertion.
        }
    });


    // --- Drag and Drop Reordering Logic ---
    let draggedItem = null; // Element being dragged

    function addDragDropListenersToParts() {
        const parts = outputContainer.querySelectorAll('.prompt-part-box');
        parts.forEach(part => {
            part.addEventListener('dragstart', (e) => {
                draggedItem = part;
                e.dataTransfer.effectAllowed = 'move';
                // Use a small timeout to allow the class to apply before the browser takes a screenshot for dragging
                setTimeout(() => {
                    part.classList.add('dragging');
                }, 0);
            });

            part.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allow drop
                if (e.target.closest('.prompt-part-box') && e.target.closest('.prompt-part-box') !== draggedItem) {
                    const targetItem = e.target.closest('.prompt-part-box');
                    const bounding = targetItem.getBoundingClientRect();
                    const offset = bounding.y + (bounding.height / 2);

                    // Determine if dragging above or below the target item
                    if (e.clientY - offset > 0) {
                        targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
                    } else {
                        targetItem.parentNode.insertBefore(draggedItem, targetItem);
                    }
                }
            });

            part.addEventListener('dragleave', (e) => {
                // Nothing specific to do on drag leave, as dragover handles placement
            });

            part.addEventListener('dragend', (e) => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                // Rebuild the main prompt input based on the new DOM order
                rebuildPromptFromReorderedParts();
            });
        });
    }

    /**
     * Rebuilds the main prompt input based on the reordered parts in the output container.
     * پرامپت اصلی را بر اساس ترتیب جدید بخش‌ها در کانتینر خروجی بازسازی می‌کند.
     */
    function rebuildPromptFromReorderedParts() {
        const reorderedPartElements = outputContainer.querySelectorAll('.prompt-part-box');
        const originalContents = Array.from(reorderedPartElements).map(el => el.dataset.originalContent); // Get the original content stored in dataset

        // Reconstruct the prompt input
        const rebuiltPrompt = originalContents.join('\n\n'); // Use paragraph breaks as a default joiner

        // Update the main prompt input
        promptInput.value = rebuiltPrompt;
        updateCharCount();
        updateWordCount();
        // No need to triggerAutoSplit here, as it might create a loop or interfere.
        // The user can manually split again if they want the reordered parts to be re-evaluated.
        showMessage('ترتیب بخش‌ها تغییر کرد. می‌توانید پرامپت اصلی را کپی کنید یا دوباره تقسیم کنید.', 'info'); // Part order changed. You can copy the main prompt or split again.
    }


    // --- Event Listeners ---
    
    // Manual split button click
    splitButton.addEventListener('click', () => {
        updateMaxCharsPerPart(); // Ensure latest max char setting is used
        const prompt = promptInput.value;
        const strategy = splitStrategySelect.value;
        const customDelim = customDelimiterInput.value;
        const regexDelim = regexDelimiterInput.value;
        const includeDelimiters = includeDelimitersInOutputCheckbox.checked;

        splitButton.disabled = true;
        splitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال تقسیم...`; // Splitting...
        
        // No setTimeout here for manual trigger, we want immediate response
        const parts = splitPrompt(prompt, strategy, customDelim, regexDelim, includeDelimiters);
        renderOutput(parts);
        splitButton.disabled = false;
        splitButton.innerHTML = `<i class="fas fa-cut mr-2"></i> تقسیم پرامپت`; // Split Prompt
    });

    copyAllButton.addEventListener('click', () => {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای کپی کردن وجود ندارد.', 'error'); // No parts to copy.
            return;
        }
        const combinedText = promptParts.join('\n\n---\n\n');
        copyTextToClipboard(combinedText, 'همه‌ی بخش‌ها', copyAllButton); // All Sections
    });

    loadExampleButton.addEventListener('click', async () => {
        loadExampleButton.disabled = true;
        loadExampleButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> بارگذاری...`; // Loading...
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
                setTimeout(triggerAutoSplit, 100); // Trigger auto-split after loading example
                showMessage('مثال با موفقیت بارگذاری شد.', 'success'); // Example loaded successfully.
            } else {
                showMessage('فرمت فایل مثال نامعتبر است.', 'error'); // Invalid example file format.
            }
        } catch (error) {
            console.error('Error loading example prompt:', error); // Error loading example prompt
            showMessage('خطا در بارگذاری فایل مثال.', 'error'); // Error loading example file.
        } finally {
            loadExampleButton.disabled = false;
            loadExampleButton.innerHTML = `<i class="fas fa-file-alt mr-2"></i> بارگذاری مثال`; // Load Example
        }
    });

    clearAllButton.addEventListener('click', clearAll);
    clearOutputOnlyButton.addEventListener('click', clearOutputOnly);
    exportTextButton.addEventListener('click', exportTextFile);
    exportJsonButton.addEventListener('click', exportJsonFile);
    savePromptButton.addEventListener('click', saveCurrentPrompt);

    loadPromptDropdownToggle.addEventListener('click', () => {
        loadPromptDropdownMenu.classList.toggle('hidden');
        if (!loadPromptDropdownMenu.classList.contains('hidden')) {
            renderSavedPromptsList(); // Refresh list every time it's opened
        }
    });

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
        saveSettings(); // Save the updated strategy
    }
    splitStrategySelect.addEventListener('change', toggleDelimiterInputs);
    
    // Save settings and trigger auto-split when these inputs change (debounced for text inputs)
    maxCharsPerPartInput.addEventListener('input', () => {
        updateMaxCharsPerPart();
        triggerAutoSplit(); // Trigger auto-split on max chars change
    });

    const DEBOUNCE_DELAY_SETTINGS = 300; // milliseconds for settings save
    let debounceTimerSettings;
    const debounceSaveSettings = () => {
        clearTimeout(debounceTimerSettings);
        debounceTimerSettings = setTimeout(saveSettings, DEBOUNCE_DELAY_SETTINGS);
    };

    customDelimiterInput.addEventListener('input', debounceSaveSettings);
    regexDelimiterInput.addEventListener('input', debounceSaveSettings);
    partPrefixInput.addEventListener('input', debounceSaveSettings);
    partSuffixInput.addEventListener('input', debounceSaveSettings);
    includeDelimitersInOutputCheckbox.addEventListener('change', () => {
        saveSettings();
        triggerAutoSplit(); // Trigger auto-split on include delimiter change
    });


    // Close the dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!loadPromptDropdownToggle.contains(event.target) && !loadPromptDropdownMenu.contains(event.target)) {
            loadPromptDropdownMenu.classList.add('hidden');
        }
    });

    // Listen for input changes to update character/word count AND trigger auto-split
    let debounceTimerAutoSplit;
    const DEBOUNCE_DELAY_AUTO_SPLIT = 500; // milliseconds for auto-split

    promptInput.addEventListener('input', () => {
        updateCharCount();
        updateWordCount();
        clearTimeout(debounceTimerAutoSplit); // Clear previous timer
        debounceTimerAutoSplit = setTimeout(triggerAutoSplit, DEBOUNCE_DELAY_AUTO_SPLIT); // Set new timer
    });

    // --- Debounce for Auto-Split (moved to top level for clarity) ---
    function triggerAutoSplit() {
        if (promptInput.value.trim() !== '') {
            const prompt = promptInput.value;
            const strategy = splitStrategySelect.value;
            const customDelim = customDelimiterInput.value;
            const regexDelim = regexDelimiterInput.value;
            const includeDelimiters = includeDelimitersInOutputCheckbox.checked;

            // Temporarily disable buttons and show spinner for auto-split feedback
            splitButton.disabled = true;
            splitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال تقسیم...`;
            
            // Perform the actual split after a short delay
            setTimeout(() => {
                const parts = splitPrompt(prompt, strategy, customDelim, regexDelim, includeDelimiters);
                renderOutput(parts);
                splitButton.disabled = false;
                splitButton.innerHTML = `<i class="fas fa-cut mr-2"></i> تقسیم پرامپت`;
            }, 50); // A small delay for UI responsiveness
        } else {
            // If input is empty, clear output and disable copy/export buttons
            clearOutputOnly(); // Clear output but keep settings
        }
    }


    // --- Local Storage Management for Saved Prompts ---

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
            console.error('Error parsing saved prompts from localStorage:', e); // Error parsing saved prompts
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
            console.error('Error saving prompts to localStorage:', e); // Error saving prompts
            showMessage('ذخیره پرامپت با مشکل مواجه شد. حافظه مرورگر پر است؟', 'error'); // Prompt saving failed. Is browser storage full?
        }
    }

    /**
     * Adds the current prompt to local storage with a user-defined name.
     * پرامپت فعلی را با نامی که کاربر تعیین کرده است، به حافظه محلی اضافه می‌کند.
     */
    function saveCurrentPrompt() {
        const promptContent = promptInput.value.trim();
        if (!promptContent) {
            showMessage('پرامپتی برای ذخیره کردن وجود ندارد.', 'error'); // No prompt to save.
            return;
        }

        const promptName = prompt('لطفاً یک نام برای پرامپت خود وارد کنید:'); // Please enter a name for your prompt:
        if (!promptName || promptName.trim() === '') {
            showMessage('نام پرامپت نمی‌تواند خالی باشد.', 'error'); // Prompt name cannot be empty.
            return;
        }

        const savedPrompts = getSavedPrompts();
        const existingPromptIndex = savedPrompts.findIndex(p => p.name === promptName.trim());

        if (existingPromptIndex !== -1) {
            if (!confirm(`پرامپتی با نام "${promptName.trim()}" از قبل وجود دارد. آیا می‌خواهید آن را بازنویسی کنید؟`)) { // A prompt with this name already exists. Do you want to overwrite it?
                return;
            }
            savedPrompts[existingPromptIndex].content = promptContent;
        } else {
            savedPrompts.push({ name: promptName.trim(), content: promptContent });
        }
        
        savePromptsToLocalStorage(savedPrompts);
        renderSavedPromptsList(); // Update the dropdown list
        showMessage(`پرامپت "${promptName.trim()}" با موفقیت ذخیره شد.`, 'success'); // Prompt saved successfully.
    }

    /**
     * Renders the list of saved prompts in the dropdown menu.
     * لیست پرامپت‌های ذخیره‌شده را در منوی کشویی رندر می‌کند.
     */
    function renderSavedPromptsList() {
        const savedPrompts = getSavedPrompts();
        savedPromptsList.innerHTML = ''; // Clear existing list

        if (savedPrompts.length === 0) {
            savedPromptsList.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 p-2">پرامپتی ذخیره نشده است.</p>'; // No prompt saved.
            return;
        }

        savedPrompts.forEach(prompt => {
            const div = document.createElement('div');
            div.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'transition-colors', 'duration-200');
            div.setAttribute('role', 'menuitem');

            const loadLink = document.createElement('a');
            loadLink.href = '#';
            loadLink.classList.add('flex-grow', 'text-gray-700', 'dark:text-gray-200', 'block', 'px-2', 'py-1', 'text-sm', 'truncate'); // Added truncate
            loadLink.textContent = prompt.name;
            loadLink.title = prompt.name; // For hover tooltip
            loadLink.addEventListener('click', (e) => {
                e.preventDefault();
                promptInput.value = prompt.content;
                updateCharCount();
                updateWordCount();
                showMessage(`پرامپت "${prompt.name}" بارگذاری شد.`, 'success'); // Prompt loaded.
                loadPromptDropdownMenu.classList.add('hidden'); // Close dropdown
                triggerAutoSplit(); // Auto-split after loading
            });
            div.appendChild(loadLink);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-prompt-btn', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'p-1', 'rounded', 'text-xs', 'mr-2');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.title = `حذف "${prompt.name}"`; // Delete "Prompt Name"
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent loadLink click
                if (confirm(`آیا مطمئنید می‌خواهید پرامپت "${prompt.name}" را حذف کنید؟`)) { // Are you sure you want to delete prompt "Prompt Name"?
                    deletePrompt(prompt.name);
                    showMessage(`پرامپت "${prompt.name}" حذف شد.`, 'success'); // Prompt deleted.
                }
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
        renderSavedPromptsList(); // Re-render the list
    }

    // --- Drag and Drop for File Upload Logic ---
    promptInput.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        promptInput.classList.add('drag-over');
    });

    promptInput.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        promptInput.classList.remove('drag-over');
    });

    promptInput.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        promptInput.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    promptInput.value = event.target.result;
                    updateCharCount();
                    updateWordCount();
                    // Use a timeout to ensure value is set before splitting
                    setTimeout(triggerAutoSplit, 100); 
                    showMessage('فایل متنی با موفقیت بارگذاری شد.', 'success'); // Text file loaded successfully.
                };
                reader.onerror = () => {
                    showMessage('خطا در خواندن فایل.', 'error'); // Error reading file.
                };
                reader.readAsText(file);
            } else {
                showMessage('لطفاً یک فایل متنی (.txt) را رها کنید.', 'error'); // Please drop a text file (.txt).
            }
        }
    });


    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        const isCtrlCmd = e.ctrlKey || e.metaKey; // Ctrl for Windows/Linux, Cmd for Mac

        // Prevent default actions for shortcuts if we handle them
        if (isCtrlCmd) {
            switch (e.key.toLowerCase()) {
                case 's': // Ctrl/Cmd + S to save current prompt
                    e.preventDefault();
                    saveCurrentPrompt();
                    break;
                case 'l': // Ctrl/Cmd + L to load example
                    if (e.altKey) { // Ctrl/Cmd + Alt + L
                        e.preventDefault();
                        loadExampleButton.click();
                    }
                    break;
                case 'e': // Ctrl/Cmd + E to export text
                    e.preventDefault();
                    exportTextButton.click();
                    break;
                case 'j': // Ctrl/Cmd + J to export JSON
                    e.preventDefault();
                    exportJsonButton.click();
                    break;
                case 'c': // Ctrl/Cmd + Shift + C to clear all
                    if (e.shiftKey) {
                        e.preventDefault();
                        clearAllButton.click();
                    }
                    break;
                case 'o': // Ctrl/Cmd + O to clear output only
                    e.preventDefault();
                    clearOutputOnlyButton.click();
                    break;
            }
        }
    });


    // Initial state setup on page load
    loadSettings(); // Load all settings first
    updateCharCount(); // Initial update of character count (based on loaded input or empty)
    updateWordCount(); // Initial update of word count
    renderSavedPromptsList(); // Populate saved prompts list on load

    // Disable buttons initially (will be enabled by renderOutput if parts exist)
    copyAllButton.disabled = true;
    copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
    exportTextButton.disabled = true;
    exportTextButton.classList.add('opacity-50', 'cursor-not-allowed');
    exportJsonButton.disabled = true;
    exportJsonButton.classList.add('opacity-50', 'cursor-not-allowed');
    clearOutputOnlyButton.disabled = true;
    clearOutputOnlyButton.classList.add('opacity-50', 'cursor-not-allowed');

    // Trigger an initial auto-split if there's content from a loaded prompt
    if (promptInput.value.trim() !== '') {
        triggerAutoSplit();
    }
});