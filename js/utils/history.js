export function saveLongTermPromptHistory() {
    const currentContent = window.promptInput.value.trim();
    if (window.promptHistory.length > 0 && currentContent === window.promptHistory[0].content) {
        return;
    }
    window.promptHistory.unshift({ content: currentContent, timestamp: new Date() });
    if (window.promptHistory.length > window.PROMPT_HISTORY_LIMIT) {
        window.promptHistory.pop();
    }
    savePromptHistoryToLocalStorage();
    renderPromptHistoryList();
}

export function loadPromptHistoryFromLocalStorage() {
    try {
        const storedHistory = localStorage.getItem('promptPartoHistory');
        if (storedHistory) {
            window.promptHistory = JSON.parse(storedHistory).map(entry => ({
                content: entry.content,
                timestamp: new Date(entry.timestamp)
            }));
        }
    } catch (e) {
        console.error('Error loading prompt history from localStorage:', e);
        window.promptHistory = [];
    }
}

export function savePromptHistoryToLocalStorage() {
    try {
        localStorage.setItem('promptPartoHistory', JSON.stringify(window.promptHistory));
    } catch (e) {
        console.error('Error saving prompt history to localStorage:', e);
        window.showMessage('ذخیره تاریخچه با مشکل مواجه شد. حافظه مرورگر پر است؟', 'error');
    }
}

export function renderPromptHistoryList() {
    window.historyList.innerHTML = '';
    if (window.promptHistory.length === 0) {
        window.historyList.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 p-2">هیچ تاریخچه‌ای وجود ندارد.</p>';
        window.clearHistoryButton.classList.add('hidden');
        return;
    } else {
        window.clearHistoryButton.classList.remove('hidden');
    }
    window.promptHistory.forEach((entry, index) => {
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
            window.promptInput.value = entry.content;
            window.updateCharCount();
            window.updateWordCount();
            window.updateTokenCount();
            window.showMessage(`پرامپت به نسخه قبلی بازگردانده شد (${timeAgo}).`, 'info');
            window.promptHistoryDropdownMenu.classList.add('hidden');
            window.triggerAutoSplit();
            window.saveCurrentStateToHistory();
        });
        div.appendChild(historyItem);
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-prompt-btn', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'p-1', 'rounded', 'text-xs', 'ml-2');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = `حذف این مورد از تاریخچه`;
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            window.showConfirmationModal('آیا مطمئنید می‌خواهید این مورد را از تاریخچه حذف کنید؟', () => {
                deleteHistoryItem(index);
                window.showMessage('آیتم تاریخچه حذف شد.', 'success');
            });
        });
        div.appendChild(deleteButton);
        window.historyList.appendChild(div);
    });
}

export function deleteHistoryItem(indexToDelete) {
    window.promptHistory.splice(indexToDelete, 1);
    savePromptHistoryToLocalStorage();
    renderPromptHistoryList();
}

export function clearPromptHistory() {
    window.showConfirmationModal('آیا مطمئنید می‌خواهید کل تاریخچه پرامپت را پاک کنید؟ این عمل برگشت‌ناپذیر است.', () => {
        window.promptHistory = [];
        savePromptHistoryToLocalStorage();
        renderPromptHistoryList();
        window.showMessage('تاریخچه پرامپت پاک شد.', 'success');
    });
}

export function formatTimeAgo(date) {
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
