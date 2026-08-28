const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const speakInput = document.getElementById("speakInput");
const speakOutput = document.getElementById("speakOutput");
const charCount = document.getElementById("charCount");
const loader = document.getElementById("loader");

// Character counter
inputText.addEventListener("input", () => {
    charCount.textContent = `${inputText.value.length} characters`;
});

// Translate function
async function translateText() {
    const text = inputText.value.trim();

    if (!text) {
        outputText.value = "";
        return;
    }

    loader.classList.remove("hidden");
    translateBtn.disabled = true;

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                source: sourceLang.value,
                target: targetLang.value
            })
        });

        const data = await response.json();

        if (data.error) {
            outputText.value = "Error: " + data.error;
        } else {
            outputText.value = data.translated_text;
        }
    } catch (err) {
        outputText.value = "Something went wrong. Check your internet connection.";
        console.error(err);
    } finally {
        loader.classList.add("hidden");
        translateBtn.disabled = false;
    }
}

translateBtn.addEventListener("click", translateText);

// Auto translate on Enter (without Shift)
inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        translateText();
    }
});

// Swap languages
swapBtn.addEventListener("click", () => {
    if (sourceLang.value === "auto") {
        alert("Cannot swap when source is set to 'Detect Language'. Please select a specific source language first.");
        return;
    }

    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;

    const tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;

    charCount.textContent = `${inputText.value.length} characters`;
});

// Copy translated text
copyBtn.addEventListener("click", () => {
    if (!outputText.value) return;

    navigator.clipboard.writeText(outputText.value).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 1500);
    });
});

// Text-to-speech function
function speak(text, lang) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

speakInput.addEventListener("click", () => {
    speak(inputText.value, sourceLang.value === "auto" ? "en" : sourceLang.value);
});

speakOutput.addEventListener("click", () => {
    speak(outputText.value, targetLang.value);
});
