console.log('loaded!');
const input = document.getElementById('english');
const output = document.getElementById('telugu');

    async function sendToServer() {
        const text = input.value.trim();
        console.log("Typing:", text);   // Debug

        if (!text) {
            output.value = '';
            return;
        }

        try {
            console.log("Sending to /transliterate...");
            const res = await fetch('/transliterate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Received from server:", data);
                output.value = data.telugu || 'No output';
            } else {
                output.value = `Server error: ${res.status}`;
            }
        } catch (err) {
            console.error("Fetch error:", err);
            output.value = "Cannot connect to server...";
        }
    }

const debugBox = document.getElementById("debug");
async function checkServer(){
    try{
        const response = await fetch("/health");
        if(response.ok){
            debugBox.textContent = "Connected";
            debugBox.style.backgroundColor = "#ffbf00";
            debugBox.style.color = "#000000";
        }
    }
    catch(err){
        debugBox.textContent = "Server is offline";
        debugBox.style.backgroundColor = "#fe5f6a";
        debugBox.style.color = "#000000";
    }
}

const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", copytext);

async function copytext() {
    const text = output.value;

    if (!text) {
        copyBtn.textContent = "Nothing to copy";
        setTimeout(() => {
            copyBtn.textContent = "Copy Telugu Text";
        }, 2000);
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "Copied! ✓";

        setTimeout(() => {
            copyBtn.textContent = "Copy Telugu Text";
        }, 2000);

    } catch (err) {
        copyBtn.textContent = "Copy failed";

        setTimeout(() => {
            copyBtn.textContent = "Copy Telugu Text";
        }, 2000);
    }
}

    input.addEventListener('input', () => {
        clearTimeout(window.timer);
        window.timer = setTimeout(sendToServer, 250);
    });

    function clearText() {
        input.value = '';
        output.value = '';
    }

    let currsize = 16;
    function changeSize(ch){
        currsize+=ch;
        if(currsize<10) currsize = 10;
        if(currsize>50) currsize = 50;
        document.getElementById("english").style.fontSize = currsize + "px";
        document.getElementById("telugu").style.fontSize = currsize + "px";
    }

    function resetSize(){
        currsize = 16;
        document.getElementById("english").style.fontSize = currsize + "px";
        document.getElementById("telugu").style.fontSize = currsize + "px";
    }
    

    checkServer();
    setInterval(checkServer, 60000);