console.log('Maata keyboard loaded!');

const input = document.getElementById('english');
const output = document.getElementById('telugu');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const darkModeBtn = document.getElementById("dark-mode-toggle");
const debugBox = document.getElementById("debug");
const copyBtn = document.getElementById("copyBtn");

let selectedEngine = "rule";

function switchMode() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function setEngine(engine) {
    selectedEngine = engine;
    const engineBtn = document.getElementById("engineBtn");
    if (engineBtn) {
        engineBtn.textContent = "Engine: " + engine.toUpperCase();
    }
    sendToServer();
}

if (darkModeBtn) {
    darkModeBtn.addEventListener("click", switchMode);
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
});

async function sendToServer() {
    const text = input.value.trim();

    if (!text) {
        output.value = '';
        if (suggestionsContainer) suggestionsContainer.innerHTML = '';
        return;
    }

    try {
        const res = await fetch('/transliterate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                engine: selectedEngine
            })
        });

        if (res.ok) {
            const data = await res.json();
            output.value = data.telugu || '';
        } else {
            output.value = `Server error: ${res.status}`;
        }
    } catch (err) {
        console.error("Fetch error:", err);
        output.value = "Cannot connect to server...";
    }

    fetchSuggestions(text.split(" ").pop());
}

async function fetchSuggestions(lastWord) {
    if (!lastWord || !suggestionsContainer) {
        if (suggestionsContainer) suggestionsContainer.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`/get-suggestions/${encodeURIComponent(lastWord)}`);
        if (res.ok) {
            const data = await res.json();
            renderSuggestions(data.suggestions || []);
        }
    } catch (err) {
        console.error("Suggestions error:", err);
    }
}

function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'suggestion-chip';
        chip.textContent = `${item.english} (${item.telugu})`;
        chip.onclick = () => {
            const words = input.value.split(" ");
            words.pop();
            words.push(item.english);
            input.value = words.join(" ") + " ";
            sendToServer();
        };
        suggestionsContainer.appendChild(chip);
    });
}

async function checkServer() {
    try {
        const response = await fetch("/health");
        if (response.ok) {
            debugBox.textContent = "Connected";
            debugBox.style.backgroundColor = "#d4edda";
            debugBox.style.color = "#155724";
        }
    } catch (err) {
        debugBox.textContent = "Server is offline";
        debugBox.style.backgroundColor = "#f8d7da";
        debugBox.style.color = "#721c24";
    }
}

if (copyBtn) {
    copyBtn.addEventListener("click", copytext);
}

async function copytext() {
    const text = output.value;

    if (!text) {
        copyBtn.textContent = "Nothing to copy";
        setTimeout(() => copyBtn.textContent = "Copy Telugu Text", 2000);
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied! ✓";
    } catch (err) {
        copyBtn.textContent = "Copy failed";
    } finally {
        setTimeout(() => copyBtn.textContent = "Copy Telugu Text", 2000);
    }
}

input.addEventListener('input', () => {
    clearTimeout(window.timer);
    window.timer = setTimeout(sendToServer, 250);
});

function clearText() {
    input.value = '';
    output.value = '';
    if (suggestionsContainer) suggestionsContainer.innerHTML = '';
}

let currsize = 16;
function changeSize(ch) {
    currsize += ch;
    if (currsize < 10) currsize = 10;
    if (currsize > 50) currsize = 50;
    input.style.fontSize = currsize + "px";
    output.style.fontSize = currsize + "px";
}

function resetSize() {
    currsize = 16;
    input.style.fontSize = "16px";
    output.style.fontSize = "16px";
}

checkServer();
setInterval(checkServer, 60000);
