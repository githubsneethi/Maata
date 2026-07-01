As we know, we face a lot of difficulties in transliterating from one language to another, particularly if it involves scripts different from Latin (i.e. English scripts). 
Thus, the Maata keyboard was created, taking inspiration from www.lexilogos.com, which has transliteration tools for over 100 languages.
This is a simple attempt to practice my skills in transliteration using the indic-transliteration and aksharamukha libaries in Python, combined with a frontend in HTML, CSS, and Flask for API integration, JavaScript Fetch API.
I personally found that aksharamukha works better when compared to indic-transliteration, but only when the user types proper romanized words: eg. if we write 'kRsNa' as opposed to simply 'krishna'

## Features of Maata ##

- 🔤 Real-time English to Telugu transliteration
- ⚡ Instant updates using JavaScript Fetch API
- 🎨 Clean and responsive user interface
- 🧹 Clear button to reset the text
- 🌍 Flask backend with REST API
- 🔄 JSON-based communication between frontend and backend

## 💻 How It Works

1. The user types English text into the input box.
2. JavaScript sends the text to the Flask backend using the Fetch API.
3. Flask processes the text using the `indic_transliteration` library.
4. The transliterated Telugu text is returned as JSON.
5. The webpage updates the Telugu text area instantly.

## 📌 Current Limitations

- Uses ITRANS transliteration, which expects specific transliteration conventions.
- Does not currently provide predictive suggestions.
- Does not support voice input or speech synthesis.

## 🚀 Future Improvements

- Add autocomplete suggestions similar to Google Input Tools.
- Translation support.
- Text-to-Speech for Telugu pronunciation.
