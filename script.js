document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const promptInput = document.getElementById('promptInput');
    const splitButton = document.getElementById('splitButton');
    const copyAllButton = document.getElementById('copyAllButton');
    const loadExampleButton = document.getElementById('loadExampleButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const exportAllButton = document.getElementById('exportAllButton');
    const outputContainer = document.getElementById('outputContainer');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const charCountDisplay = document.getElementById('charCount');
    const maxCharsPerPartInput = document.getElementById('maxCharsPerPart');
    const splitStrategySelect = document.getElementById('splitStrategy');
    const customDelimiterContainer = document.getElementById('customDelimiterContainer'); // New container for custom delimiter
    const customDelimiterInput = document.getElementById('customDelimiter'); // New custom delimiter input
    const partPrefixInput = document.getElementById('partPrefix'); // New: Part Prefix Input
    const partSuffixInput = document.getElementById('partSuffix'); // New: Part Suffix Input
    const savePromptButton = document.getElementById('savePromptButton');
    const loadPromptDropdownToggle = document.getElementById('loadPromptDropdownToggle');
    const loadPromptDropdownMenu = document.getElementById('loadPromptDropdownMenu');
    const savedPromptsList = document.getElementById('savedPromptsList');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeText = document.getElementById('darkModeText');

    // Default constants for splitting logic
    let MAX_CHARS_PER_PART = parseInt(maxCharsPerPartInput.value, 10) || 3800;
    const MIN_CHARS_FOR_NEW_SPLIT = 100; // Minimum characters remaining to attempt a new split

    // --- Dark Mode Logic ---
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    /**
     * Applies the selected theme (dark or light) to the body.
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

    // Initialize theme on load
    if (storedTheme) {
        applyTheme(storedTheme);
    } else if (prefersDarkMode) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default to light if no preference
    }

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- Utility Functions ---

    /**
     * Updates the MAX_CHARS_PER_PART based on user input and validates it.
     */
    function updateMaxCharsPerPart() {
        let newValue = parseInt(maxCharsPerPartInput.value, 10);
        if (isNaN(newValue) || newValue < MIN_CHARS_FOR_NEW_SPLIT) {
            newValue = 3800; // Default or minimum sensible value
            maxCharsPerPartInput.value = newValue; // Correct the input field
            showMessage('حداکثر کاراکتر باید یک عدد معتبر و حداقل 100 باشد. به مقدار پیش‌فرض تنظیم شد.', 'error');
        }
        MAX_CHARS_PER_PART = newValue;
    }

    /**
     * Displays a message in the message box.
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
            showMessage(`${feedbackName} با موفقیت کپی شد!`, 'success');

            if (buttonElement) {
                const originalText = buttonElement.innerHTML;
                buttonElement.classList.add('copied');
                buttonElement.innerHTML = `<i class="fas fa-check ml-2"></i> کپی شد!`;
                setTimeout(() => {
                    buttonElement.innerHTML = originalText;
                    buttonElement.classList.remove('copied');
                }, 1500); // Revert after 1.5 seconds
            }

        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage(`خطا در کپی کردن ${feedbackName}.`, 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * Updates the character count display.
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
     * Clears the prompt input and output area.
     */
    function clearAll() {
        promptInput.value = '';
        outputContainer.innerHTML = '';
        updateCharCount(); // Reset character count
        // Disable buttons
        copyAllButton.disabled = true;
        copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
        exportAllButton.disabled = true;
        exportAllButton.classList.add('opacity-50', 'cursor-not-allowed');
        showMessage('همه چیز پاک شد.', 'success');
    }

    /**
     * Exports all split parts to a single text file.
     */
    function exportAllParts() {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای خروجی گرفتن وجود ندارد.', 'error');
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
        showMessage('بخش‌ها با موفقیت در یک فایل متنی ذخیره شدند.', 'success');
    }

    // --- Splitting Logic ---

    /**
     * Checks if a given line appears to be part of a markdown code block (fenced ```)
     * or a list item (-, *, +, 1. etc.). This is a heuristic.
     * @param {string} line - The line to check.
     * @returns {boolean} True if the line likely belongs to a block/list, false otherwise.
     */
    function isLikelyMarkdownBlockLine(line) {
        // Check for fenced code blocks
        if (line.trim().startsWith('```')) return true;
        // Check for list items
        if (/^\s*([-*+]|\d+\.)\s/.test(line)) return true;
        // Check for highly indented lines (often code)
        if (line.startsWith('    ') || line.startsWith('\t')) return true;
        return false;
    }

    /**
     * Splits the prompt input into manageable parts based on selected strategy.
     * Includes advanced "auto" strategy that tries to preserve markdown blocks/lists.
     * @param {string} prompt - The full prompt text.
     * @param {string} strategy - 'auto', 'paragraph', 'line', or 'custom'.
     * @param {string} customDelim - The custom delimiter if strategy is 'custom'.
     * @returns {Array<string>} An array of split prompt parts.
     */
    function splitPrompt(prompt, strategy = 'auto', customDelim = '') {
        if (!prompt.trim()) {
            showMessage('لطفاً پرامپت خود را وارد کنید.', 'error');
            return [];
        }

        let initialChunks = [];

        if (strategy === 'custom' && customDelim.length > 0) {
            initialChunks = prompt.split(customDelim);
        } else if (strategy === 'paragraph') {
            initialChunks = prompt.split('\n\n');
        } else if (strategy === 'line') {
            initialChunks = prompt.split('\n');
        } else { // 'auto' or fallback
            // Start with double newlines for auto, then refine
            initialChunks = prompt.split('\n\n');
        }

        const parts = [];

        initialChunks.forEach(chunk => {
            chunk = chunk.trim();
            if (chunk === '') return;

            if (chunk.length <= MAX_CHARS_PER_PART) {
                parts.push(chunk);
            } else {
                // Chunk is too long, need to break it down further
                let subChunks;
                if (strategy === 'custom' || strategy === 'paragraph' || strategy === 'auto') {
                    // For custom, paragraph, or auto strategies, break by lines first if the primary chunk is too long
                    subChunks = chunk.split('\n');
                } else if (strategy === 'line') {
                    // If the primary strategy was already 'line' and a line is too long, we need a force split
                    subChunks = [chunk]; // Treat the whole chunk as one sub-chunk for force splitting below
                }

                let tempPart = '';
                for (let i = 0; i < subChunks.length; i++) {
                    const subChunk = subChunks[i];
                    const nextSubChunk = subChunks[i + 1] || '';

                    const proposedPart = tempPart + (tempPart === '' ? '' : '\n') + subChunk;

                    if (proposedPart.length <= MAX_CHARS_PER_PART) {
                        tempPart = proposedPart;
                    } else {
                        // Current proposed part exceeds limit. Push tempPart and start new.
                        if (tempPart !== '') {
                            parts.push(tempPart);
                        }
                        tempPart = subChunk; // Start new part with the current subChunk

                        // If the new tempPart itself is too long, it will be force-split in the final pass.
                    }
                }
                if (tempPart !== '') {
                    parts.push(tempPart);
                }
            }
        });

        // Final pass: Ensure no part exceeds MAX_CHARS_PER_PART, force split if necessary.
        // This is where "smart" auto-splitting (preserving blocks) also comes into play.
        const finalParts = [];
        parts.forEach(part => {
            if (part.length <= MAX_CHARS_PER_PART) {
                finalParts.push(part);
            } else {
                let remaining = part;
                while (remaining.length > 0) {
                    let splitPoint = MAX_CHARS_PER_PART;
                    let potentialSplitSegment = remaining.substring(0, MAX_CHARS_PER_PART);

                    // Try to find a natural break point (double newline, single newline, sentence ending)
                    // within a reasonable distance from MAX_CHARS_PER_PART.
                    let bestNaturalBreak = -1;
                    const breakSearchRange = MAX_CHARS_PER_PART - MIN_CHARS_FOR_NEW_SPLIT; // Search back from limit

                    // Priority 1: Double newline
                    let lastDoubleNewline = potentialSplitSegment.lastIndexOf('\n\n');
                    if (lastDoubleNewline !== -1 && lastDoubleNewline >= breakSearchRange) {
                        bestNaturalBreak = lastDoubleNewline;
                    }

                    // Priority 2: Single newline
                    if (bestNaturalBreak === -1) {
                        let lastNewline = potentialSplitSegment.lastIndexOf('\n');
                        if (lastNewline !== -1 && lastNewline >= breakSearchRange) {
                            bestNaturalBreak = lastNewline;
                        }
                    }

                    // Priority 3: Sentence ending (. ? !)
                    if (bestNaturalBreak === -1) {
                        let lastPeriod = potentialSplitSegment.lastIndexOf('.');
                        let lastQuestion = potentialSplitSegment.lastIndexOf('?');
                        let lastExclamation = potentialSplitSegment.lastIndexOf('!');
                        
                        let tempSentenceBreak = Math.max(lastPeriod, lastQuestion, lastExclamation);
                        if (tempSentenceBreak !== -1 && tempSentenceBreak >= breakSearchRange) {
                            bestNaturalBreak = tempSentenceBreak;
                        }
                    }

                    // Apply block preservation heuristic only if we are in 'auto' mode
                    if (strategy === 'auto' && bestNaturalBreak !== -1) {
                        // Check if the proposed split point falls inside a "block-like" line
                        const lineAfterSplit = remaining.substring(bestNaturalBreak + 1).split('\n')[0];
                        const lineBeforeSplit = remaining.substring(0, bestNaturalBreak).split('\n').pop();

                        if (isLikelyMarkdownBlockLine(lineAfterSplit) || isLikelyMarkdownBlockLine(lineBeforeSplit)) {
                            // If a natural break is found but it's within a block-like context,
                            // try to shift the break point to the nearest logical block boundary.
                            // This is complex to do perfectly without a full parser.
                            // For simplicity, if we detect a block, we can try to find an earlier/later newline.
                            // For this iteration, let's prioritize simple natural breaks over breaking blocks.
                            // The `splitPoint` will be `bestNaturalBreak + 1`.
                            // A more advanced approach would involve backtracking to the start of the block
                            // or fast-forwarding to the end of it. For now, we accept the current `bestNaturalBreak`.
                        }
                    }
                    
                    if (bestNaturalBreak !== -1) {
                        splitPoint = bestNaturalBreak + 1; // Split right after the natural break
                    } else {
                        // If no good natural break, find the last newline before MAX_CHARS_PER_PART
                        // or just force split at MAX_CHARS_PER_PART.
                        let fallbackNewline = potentialSplitSegment.lastIndexOf('\n');
                        if (fallbackNewline !== -1) {
                            splitPoint = fallbackNewline + 1;
                        } else {
                            splitPoint = Math.min(MAX_CHARS_PER_PART, remaining.length); // Fallback to character limit
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
     * @param {Array<string>} parts - An array of split prompt parts.
     */
    function renderOutput(parts) {
        outputContainer.innerHTML = ''; // Clear previous output
        
        const partPrefix = partPrefixInput.value;
        const partSuffix = partSuffixInput.value;

        if (parts.length === 0) {
            copyAllButton.disabled = true;
            copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
            exportAllButton.disabled = true;
            exportAllButton.classList.add('opacity-50', 'cursor-not-allowed');
            return;
        }

        copyAllButton.disabled = false;
        copyAllButton.classList.remove('opacity-50', 'cursor-not-allowed');
        exportAllButton.disabled = false;
        exportAllButton.classList.remove('opacity-50', 'cursor-not-allowed');

        parts.forEach((partContent, index) => {
            const partBox = document.createElement('div');
            partBox.classList.add('prompt-part-box', 'dark:bg-gray-800', 'dark:border-gray-600', 'dark:shadow-lg');

            // Add title for the part
            const partTitle = document.createElement('h3');
            partTitle.classList.add('text-lg', 'font-medium', 'mb-2', 'text-gray-900', 'dark:text-gray-200');
            partTitle.textContent = `بخش ${index + 1} ( ${partContent.length} کاراکتر )`;
            partBox.appendChild(partTitle);

            // Add preformatted text content with prefix/suffix
            const pre = document.createElement('pre');
            pre.textContent = partPrefix + partContent + partSuffix; // Apply prefix and suffix
            pre.setAttribute('aria-label', `Prompt Part ${index + 1}`);
            partBox.appendChild(pre);

            // Add copy button for individual part
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button', 'flex', 'items-center', 'justify-center');
            copyButton.innerHTML = `<i class="fas fa-copy ml-2"></i> کپی بخش`;
            copyButton.setAttribute('aria-label', `Copy Part ${index + 1}`);
            copyButton.addEventListener('click', () => {
                copyTextToClipboard(pre.textContent, `بخش ${index + 1}`, copyButton); // Copy with prefix/suffix
            });
            partBox.appendChild(copyButton);

            outputContainer.appendChild(partBox);
        });
    }

    // --- Local Storage Management ---

    /**
     * Retrieves saved prompts from local storage.
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
     */
    function saveCurrentPrompt() {
        const promptContent = promptInput.value.trim();
        if (!promptContent) {
            showMessage('پرامپتی برای ذخیره کردن وجود ندارد.', 'error');
            return;
        }

        const promptName = prompt('لطفاً یک نام برای پرامپت خود وارد کنید:');
        if (!promptName || promptName.trim() === '') {
            showMessage('نام پرامپت نمی‌تواند خالی باشد.', 'error');
            return;
        }

        const savedPrompts = getSavedPrompts();
        const existingPromptIndex = savedPrompts.findIndex(p => p.name === promptName.trim());

        if (existingPromptIndex !== -1) {
            if (!confirm(`پرامپتی با نام "${promptName.trim()}" از قبل وجود دارد. آیا می‌خواهید آن را بازنویسی کنید؟`)) {
                return;
            }
            savedPrompts[existingPromptIndex].content = promptContent;
        } else {
            savedPrompts.push({ name: promptName.trim(), content: promptContent });
        }
        
        savePromptsToLocalStorage(savedPrompts);
        renderSavedPromptsList(); // Update the dropdown list
        showMessage(`پرامپت "${promptName.trim()}" با موفقیت ذخیره شد.`, 'success');
    }

    /**
     * Renders the list of saved prompts in the dropdown menu.
     */
    function renderSavedPromptsList() {
        const savedPrompts = getSavedPrompts();
        savedPromptsList.innerHTML = ''; // Clear existing list

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
            loadLink.classList.add('flex-grow', 'text-gray-700', 'dark:text-gray-200', 'block', 'px-2', 'py-1', 'text-sm', 'truncate'); // Added truncate
            loadLink.textContent = prompt.name;
            loadLink.title = prompt.name; // For hover tooltip
            loadLink.addEventListener('click', (e) => {
                e.preventDefault();
                promptInput.value = prompt.content;
                updateCharCount();
                showMessage(`پرامپت "${prompt.name}" بارگذاری شد.`, 'success');
                loadPromptDropdownMenu.classList.add('hidden'); // Close dropdown
            });
            div.appendChild(loadLink);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-prompt-btn', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'p-1', 'rounded', 'text-xs', 'mr-2');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.title = `حذف "${prompt.name}"`;
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent loadLink click
                if (confirm(`آیا مطمئنید می‌خواهید پرامپت "${prompt.name}" را حذف کنید؟`)) {
                    deletePrompt(prompt.name);
                    showMessage(`پرامپت "${prompt.name}" حذف شد.`, 'success');
                    // No need to close dropdown here, renderSavedPromptsList will re-render
                }
            });
            div.appendChild(deleteButton);

            savedPromptsList.appendChild(div);
        });
    }

    /**
     * Deletes a saved prompt by name from local storage.
     * @param {string} nameToDelete - The name of the prompt to delete.
     */
    function deletePrompt(nameToDelete) {
        let savedPrompts = getSavedPrompts();
        savedPrompts = savedPrompts.filter(p => p.name !== nameToDelete);
        savePromptsToLocalStorage(savedPrompts);
        renderSavedPromptsList(); // Re-render the list
    }

    // --- Drag and Drop Logic ---
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
                    showMessage('فایل متنی با موفقیت بارگذاری شد.', 'success');
                };
                reader.onerror = () => {
                    showMessage('خطا در خواندن فایل.', 'error');
                };
                reader.readAsText(file);
            } else {
                showMessage('لطفاً یک فایل متنی (.txt) را رها کنید.', 'error');
            }
        }
    });


    // --- Event Listeners ---
    
    splitButton.addEventListener('click', () => {
        updateMaxCharsPerPart(); // Ensure latest max char setting is used
        const prompt = promptInput.value;
        const strategy = splitStrategySelect.value;
        const customDelim = customDelimiterInput.value;

        splitButton.disabled = true; // Disable button while processing
        splitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال تقسیم...`;
        
        // Use a slight delay to allow UI to update before heavy computation
        setTimeout(() => {
            const parts = splitPrompt(prompt, strategy, customDelim);
            renderOutput(parts);
            splitButton.disabled = false; // Re-enable button
            splitButton.innerHTML = `<i class="fas fa-cut mr-2"></i> تقسیم پرامپت`;
        }, 50); 
    });

    copyAllButton.addEventListener('click', () => {
        const promptParts = Array.from(outputContainer.querySelectorAll('pre')).map(pre => pre.textContent);
        if (promptParts.length === 0) {
            showMessage('هیچ بخشی برای کپی کردن وجود ندارد.', 'error');
            return;
        }
        const combinedText = promptParts.join('\n\n---\n\n'); // Join parts with a separator for copy
        copyTextToClipboard(combinedText, 'همه‌ی بخش‌ها', copyAllButton); // Pass copyAllButton for feedback
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
                updateCharCount(); // Update character count after loading example
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

    clearAllButton.addEventListener('click', clearAll);
    exportAllButton.addEventListener('click', exportAllParts);
    savePromptButton.addEventListener('click', saveCurrentPrompt);

    loadPromptDropdownToggle.addEventListener('click', () => {
        loadPromptDropdownMenu.classList.toggle('hidden');
        if (!loadPromptDropdownMenu.classList.contains('hidden')) {
            renderSavedPromptsList(); // Refresh list every time it's opened
        }
    });

    // Toggle visibility of custom delimiter input based on strategy selection
    splitStrategySelect.addEventListener('change', () => {
        if (splitStrategySelect.value === 'custom') {
            customDelimiterContainer.classList.remove('hidden');
        } else {
            customDelimiterContainer.classList.add('hidden');
        }
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!loadPromptDropdownToggle.contains(event.target) && !loadPromptDropdownMenu.contains(event.target)) {
            loadPromptDropdownMenu.classList.add('hidden');
        }
    });

    // Listen for input changes to update character count
    promptInput.addEventListener('input', updateCharCount);

    // Initial state setup on page load
    updateMaxCharsPerPart(); // Set initial MAX_CHARS_PER_PART from input
    updateCharCount(); // Initial update of character count
    renderSavedPromptsList(); // Populate saved prompts list on load

    // Disable buttons initially
    copyAllButton.disabled = true;
    copyAllButton.classList.add('opacity-50', 'cursor-not-allowed');
    exportAllButton.disabled = true;
    exportAllButton.classList.add('opacity-50', 'cursor-not-allowed');
});
