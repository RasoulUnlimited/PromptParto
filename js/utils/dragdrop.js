export function addDragDropListenersToParts() {
    let draggedItem = null;
    let placeholder = null;
    const outputContainer = window.outputContainer;
    const promptInput = window.promptInput;

    const parts = outputContainer.querySelectorAll('.prompt-part-box');
    parts.forEach(part => {
        part.addEventListener('dragstart', (e) => {
            draggedItem = part;
            e.dataTransfer.effectAllowed = 'move';
            placeholder = document.createElement('div');
            placeholder.classList.add('drag-placeholder');
            part.parentNode.insertBefore(placeholder, part.nextSibling);
            setTimeout(() => { part.classList.add('dragging'); }, 0);
        });
        part.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.target.closest('.prompt-part-box') && e.target.closest('.prompt-part-box') !== draggedItem) {
                const targetItem = e.target.closest('.prompt-part-box');
                const bounding = targetItem.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    if (targetItem.nextSibling !== placeholder) {
                        targetItem.parentNode.insertBefore(placeholder, targetItem.nextSibling);
                    }
                } else {
                    if (targetItem.previousSibling !== placeholder) {
                        targetItem.parentNode.insertBefore(placeholder, targetItem);
                    }
                }
            }
        });
        part.addEventListener('dragleave', () => {});
        part.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                if (placeholder && placeholder.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                }
                const targetParent = outputContainer;
                if (placeholder && placeholder.parentNode === targetParent) {
                    targetParent.insertBefore(draggedItem, placeholder);
                } else {
                    outputContainer.appendChild(draggedItem);
                }
            }
            draggedItem = null;
            placeholder = null;
            rebuildPromptFromReorderedParts();
        });
    });
    outputContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedItem && !e.target.closest('.prompt-part-box') && placeholder && !placeholder.parentNode) {
            outputContainer.appendChild(placeholder);
        }
    });
}

export function rebuildPromptFromReorderedParts() {
    const outputContainer = window.outputContainer;
    const promptInput = window.promptInput;
    const reorderedPartElements = outputContainer.querySelectorAll('.prompt-part-box');
    const originalContents = Array.from(reorderedPartElements).map(el => el.dataset.originalContent);
    const rebuiltPrompt = originalContents.join('\n\n');
    promptInput.value = rebuiltPrompt;
    window.updateCharCount();
    window.updateWordCount();
    window.updateTokenCount();
    window.showMessage('ترتیب بخش‌ها تغییر کرد. می‌توانید پرامپپت اصلی را کپی کنید یا دوباره تقسیم کنید.', 'info');
    window.triggerAutoSplit();
    window.saveCurrentStateToHistory();
}

export function setupFileDragDrop() {
    const dragDropZone = window.dragDropZone;
    const fileInput = window.fileInput;
    const dragDropOverlay = window.dragDropOverlay;
    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropZone.classList.add('drag-over');
    });
    dragDropZone.addEventListener('dragleave', (e) => {
        if (!dragDropZone.contains(e.relatedTarget)) {
            dragDropZone.classList.remove('drag-over');
        }
    });
    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    window.promptInput.value = event.target.result;
                    window.updateCharCount();
                    window.updateWordCount();
                    window.updateTokenCount();
                    window.triggerAutoSplit();
                    window.saveCurrentStateToHistory();
                    window.saveLongTermPromptHistory();
                    window.saveAutoPrompt();
                    window.showMessage('فایل متنی با موفقیت بارگذاری شد.', 'success');
                };
                reader.onerror = () => {
                    window.showMessage('خطا در خواندن فایل.', 'error');
                };
                reader.readAsText(file);
            } else {
                window.showMessage('لطفاً فقط فایل‌های متنی (.txt) را رها کنید.', 'error');
            }
        }
    });
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    window.promptInput.value = event.target.result;
                    window.updateCharCount();
                    window.updateWordCount();
                    window.updateTokenCount();
                    window.triggerAutoSplit();
                    window.saveCurrentStateToHistory();
                    window.saveLongTermPromptHistory();
                    window.saveAutoPrompt();
                    window.showMessage('فایل متنی با موفقیت بارگذاری شد.', 'success');
                };
                reader.onerror = () => {
                    window.showMessage('خطا در خواندن فایل.', 'error');
                };
                reader.readAsText(file);
            } else {
                window.showMessage('لطفاً فقط فایل‌های متنی (.txt) را انتخاب کنید.', 'error');
            }
        }
    });
    dragDropOverlay.addEventListener('click', () => fileInput.click());
}