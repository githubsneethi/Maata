from flask import Flask, render_template, jsonify, request
from indic_transliteration import sanscript
import re

app = Flask(__name__)

def load_dictionary(path):
    import json

    with open(path, encoding="utf-8") as f:
        return json.load(f)

SPECIAL_WORDS = load_dictionary("dic1.json")
ENGLISH_TELUGU_DICT = load_dictionary("eng2tel.json")

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = None


class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.word = word
    
    def search_prefix(self, prefix, max_results=5):
        node = self.root
        prefix_lower = prefix.lower()
        
        for char in prefix_lower:
            if char not in node.children:
                return []
            node = node.children[char]
        
        results = []
        self._dfs(node, results, max_results)
        return results
    
    def _dfs(self, node, results, max_results):
        if len(results) >= max_results:
            return
        if node.is_end:
            results.append(node.word)
        for child in node.children.values():
            if len(results) < max_results:
                self._dfs(child, results, max_results)


trie = Trie()
for english_word in ENGLISH_TELUGU_DICT.keys():
    trie.insert(english_word)

def preprocess_telugu(text):

    if not text:
        return ""

    result = text.strip()

    
    lower = result.lower()

    if lower in SPECIAL_WORDS:
        return SPECIAL_WORDS[lower]

    result = re.sub(r'm(?=[bcdfghjklmnpqrstvwxyz])',
                    'M',
                    result,
                    flags=re.IGNORECASE)

    result = re.sub(r'nt', 'NT', result, flags=re.IGNORECASE)

    result = re.sub(r'nd', 'ND', result, flags=re.IGNORECASE)

    result = re.sub(r'mp', 'Mp', result, flags=re.IGNORECASE)

    result = re.sub(r'mb', 'Mb', result, flags=re.IGNORECASE)

    result = re.sub(r'ng', 'G', result, flags=re.IGNORECASE)

    return result

typed_text = ""
listener_running = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transliterate', methods=['POST'])
def transliterate():
    data = request.get_json()
    text = data.get('text', '')
    
    preprocessed = preprocess_telugu(text)
    try:
        telugu_text = sanscript.transliterate(preprocessed, sanscript.ITRANS, sanscript.TELUGU)
    except:
        telugu_text = text

    return jsonify({
        'english': text,
        'telugu': telugu_text
    })

@app.route('/get-suggestions/<prefix>')
def get_suggestions(prefix):
    if not prefix or len(prefix) < 1:
        return jsonify({'suggestions': []})
    
    suggestions = trie.search_prefix(prefix, max_results=5)
    result = [{'english': w, 'telugu': ENGLISH_TELUGU_DICT.get(w, '')} for w in suggestions]
    return jsonify({'suggestions': result})


@app.route('/clear')
def clear():
    return jsonify({'status': 'cleared'})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    print("Server running at http://localhost:5000")
    app.run(debug=True)