from flask import Flask, render_template, request, jsonify
from indic_transliteration import sanscript

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/transliterate', methods=['POST'])
def transliterate():

    data = request.get_json()

    english = data.get("text", "")

    try:
        telugu = sanscript.transliterate(
            english,
            sanscript.ITRANS,
            sanscript.TELUGU
        )
    except Exception:
        telugu = ""

    return jsonify({
        "telugu": telugu
    })


if __name__ == "__main__":
    app.run(debug=True)