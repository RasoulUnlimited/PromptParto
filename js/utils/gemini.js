export async function sendToAI(textToRefine, commandPrompt) {
    const apiKey = (window.apiKeyInput && window.apiKeyInput.value.trim()) || sessionStorage.getItem('promptPartoApiKey') || '';
    if (!apiKey) {
        window.showMessage('کلید Gemini API وارد نشده است.', 'error');
        return;
    }
    sessionStorage.setItem('promptPartoApiKey', apiKey);
    window.aiResponseTextarea.value = '';
    window.updateAiResponseCounts();
    window.aiLoadingSpinner.classList.remove('hidden');
    window.aiResponseTextarea.classList.add('hidden');
    window.copyAiResponseButton.disabled = true;
    window.insertAiResponseButton.disabled = true;
    window.aiSendToAIButton.disabled = true;
    window.aiSendToAIButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> در حال ارسال...`;

    const finalCommand = window.aiPromptInput.value.trim();
    const temperature = parseFloat(window.aiTemperatureInput.value);
    const topP = parseFloat(window.aiTopPInput.value);
    const aiResponseCharLimit = parseInt(window.aiResponseCharLimitInput.value, 10);

    try {
        const prompt = `${finalCommand}:\n\n"${textToRefine}"\n\nلطفا فقط متن اصلاح شده یا خلاصه شده را برگردانید و از هرگونه مقدمه یا خاتمه اضافه خودداری کنید.`;
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = {
            contents: chatHistory,
            generationConfig: {
                temperature: isNaN(temperature) ? 0.7 : Math.max(0, Math.min(1, temperature)),
                topP: isNaN(topP) ? 0.9 : Math.max(0, Math.min(1, topP)),
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
            if (aiResponseCharLimit > 0 && aiResponse.length > aiResponseCharLimit) {
                aiResponse = aiResponse.substring(0, aiResponseCharLimit);
                window.showMessage(`پاسخ هوش مصنوعی به دلیل محدودیت ${aiResponseCharLimit} کاراکتری کوتاه شد.`, 'info');
            }
            window.aiResponseTextarea.value = aiResponse.trim();
            window.showMessage(`پاسخ هوش مصنوعی دریافت شد.`, 'success');
        } else {
            window.aiResponseTextarea.value = 'پاسخی از هوش مصنوعی دریافت نشد. لطفاً دوباره تلاش کنید.';
            window.showMessage('خطا در دریافت پاسخ هوش مصنوعی.', 'error');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        window.aiResponseTextarea.value = 'خطا در ارتباط با هوش مصنوعی. لطفاً اتصال اینترنت خود را بررسی کنید یا بعداً تلاش کنید.';
        window.showMessage('خطا در ارتباط با هوش مصنوعی.', 'error');
    } finally {
        window.aiLoadingSpinner.classList.add('hidden');
        window.aiResponseTextarea.classList.remove('hidden');
        window.copyAiResponseButton.disabled = false;
        window.insertAiResponseButton.disabled = false;
        window.aiSendToAIButton.disabled = false;
        window.aiSendToAIButton.innerHTML = `<i class="fas fa-paper-plane ml-2"></i> ارسال به هوش مصنوعی`;
        window.updateAiResponseCounts();
    }
}