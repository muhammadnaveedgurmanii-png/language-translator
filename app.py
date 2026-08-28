from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)

# Common languages dictionary (Language Name -> Language Code)
LANGUAGES = {
    "English": "en",
    "Urdu": "ur",
    "Arabic": "ar",
    "French": "fr",
    "Spanish": "es",
    "German": "de",
    "Chinese (Simplified)": "zh-CN",
    "Hindi": "hi",
    "Japanese": "ja",
    "Korean": "ko",
    "Russian": "ru",
    "Turkish": "tr",
    "Italian": "it",
    "Portuguese": "pt",
    "Bengali": "bn",
    "Punjabi": "pa",
    "Persian": "fa",
    "Pashto": "ps",
}

@app.route("/")
def home():
    return render_template("index.html", languages=LANGUAGES)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "")
    source = data.get("source", "auto")
    target = data.get("target", "en")

    if not text.strip():
        return jsonify({"translated_text": ""})

    try:
        translated = GoogleTranslator(source=source, target=target).translate(text)
        return jsonify({"translated_text": translated})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
