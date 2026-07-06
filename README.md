# 📓 Lazy Notes

![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Issues](https://img.shields.io/github/issues/MB-PieSec/lazy-notes?style=flat-square)](https://github.com/MB-PieSec/lazy-notes/issues)

An AI-powered CLI tool that fetches YouTube video transcripts and generates structured notes and flashcards in Markdown format — so you can learn without taking notes manually.

---

## ✨ Features

- 🎥 Fetches transcripts from any YouTube video via yt-dlp
- 🤖 Supports multiple AI providers — Gemini, Claude, OpenAI, Groq, Grok, OpenRouter
- 🔒 Encrypted API key storage — keys saved locally, never shared
- 📝 Generates structured Markdown notes with summary, key concepts, and flashcards
- 💾 Saves output as `.md` files automatically
- 🛠️ Auto-installs dependencies on first run
- 🖥️ Interactive CLI with arrow key navigation

---

## 📋 Requirements

- Node.js v18+
- Python 3.x
- A YouTube cookies file (for transcript access)
- At least one AI provider API key

---

## 🛠️ Installation

```bash
git clone https://github.com/MB-PieSec/lazy-notes.git
cd lazy-notes
node start.js
```

The tool automatically installs all Node.js dependencies and `yt-dlp` on first run.

---

## 🍪 YouTube Cookies Setup

YouTube requires authentication to access transcripts. You need to export your browser cookies:

1. Install the **"Get cookies.txt LOCALLY"** extension in your browser
2. Go to [youtube.com](https://youtube.com) while logged in
3. Click the extension → Export as **Netscape format**
4. Save the file anywhere on your machine (e.g. `C:\Users\you\cookies.txt`)
5. In Lazy Notes → Configure API Keys → YouTube Cookies → enter the full path

> ⚠️ YouTube rotates cookies periodically. If transcript fetching fails, re-export your cookies and update the path.

---

## 🚀 Usage

```bash
node start.js
```

On first launch the tool will:
1. Install all dependencies automatically
2. Show the main menu

From the main menu:
- **Generate Notes** — enter a YouTube URL, choose an AI provider, get your notes
- **Configure API Keys** — set up your AI provider keys and cookies path

Output files are saved to the `output/` folder as `VideoTitle.md`.

---

## 🤖 Supported AI Providers

| Provider | Get API Key |
|----------|------------|
| Gemini | [aistudio.google.com](https://aistudio.google.com) |
| Claude | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI | [platform.openai.com](https://platform.openai.com) |
| Groq | [console.groq.com](https://console.groq.com) |
| Grok | [console.x.ai](https://console.x.ai) |
| OpenRouter | [openrouter.ai](https://openrouter.ai) |

---

## 📂 Output Example

```
output/
  7_Authentication_Concepts_Every_Developer_Should_Know.md
  System_Design_Explained.md
```

Each file contains:
- Video summary
- Key concepts with detailed explanations
- Practical takeaways
- Flashcards for review

---

## 📄 Project Structure

```
lazy-notes/
  start.js              — bootstrap entry point
  src/
    cli/
      index.js          — main CLI logic
    services/
      transcriptService.js  — yt-dlp transcript fetching
      aiService.js          — AI provider integrations
      fileService.js        — markdown file output
    utils/
      config.js         — encrypted API key storage
      logger.js         — colored terminal output
      setup.js          — dependency checks
  output/               — generated notes saved here
```

---

## 🤝 Contributing

Pull requests are welcome. Please open an issue first for major changes.

---

## 📜 License

MIT

---

## 💡 Credits

Made with ❤️ by [MB-PieSec](https://github.com/MB-PieSec)

---

---

# 📓 Lazy Notes — نسخه فارسی

یک ابزار CLI هوشمند که ترنسکریپت ویدیوهای یوتیوب رو دریافت می‌کنه و به صورت خودکار نوت و فلش‌کارت در فرمت Markdown تولید می‌کنه — تا بدون نوشتن دستی یاد بگیری.

---

## ✨ امکانات

- 🎥 دریافت ترنسکریپت از هر ویدیوی یوتیوب از طریق yt-dlp
- 🤖 پشتیبانی از چندین AI — Gemini، Claude، OpenAI، Groq، Grok، OpenRouter
- 🔒 ذخیره‌سازی رمزنگاری‌شده API Key — کلیدها روی سیستم خودت ذخیره می‌شن
- 📝 تولید نوت‌های ساختاریافته با خلاصه، مفاهیم کلیدی و فلش‌کارت
- 💾 ذخیره خودکار خروجی به صورت فایل `.md`
- 🛠️ نصب خودکار وابستگی‌ها در اولین اجرا
- 🖥️ CLI تعاملی با ناوبری با کیبورد

---

## 📋 پیش‌نیازها

- Node.js نسخه ۱۸ به بالا
- Python 3.x
- فایل کوکی یوتیوب
- حداقل یک API Key از یکی از پروایدرها

---

## 🛠️ نصب

```bash
git clone https://github.com/MB-PieSec/lazy-notes.git
cd lazy-notes
node start.js
```

ابزار در اولین اجرا به صورت خودکار تمام وابستگی‌های Node.js و yt-dlp رو نصب می‌کنه.

---

## 🍪 تنظیم کوکی یوتیوب

یوتیوب برای دسترسی به ترنسکریپت نیاز به احراز هویت داره. باید کوکی‌های مرورگرت رو اکسپورت کنی:

1. اکستنشن **"Get cookies.txt LOCALLY"** رو تو مرورگرت نصب کن
2. در حالی که لاگین هستی به [youtube.com](https://youtube.com) برو
3. روی اکستنشن کلیک کن ← Export به فرمت **Netscape**
4. فایل رو ذخیره کن (مثلاً `C:\Users\you\cookies.txt`)
5. تو Lazy Notes ← Configure API Keys ← YouTube Cookies ← مسیر کامل فایل رو وارد کن

> ⚠️ یوتیوب کوکی‌ها رو به صورت دوره‌ای می‌چرخونه. اگه دریافت ترنسکریپت با خطا مواجه شد، کوکی‌ها رو دوباره اکسپورت کن.

---

## 🚀 استفاده

```bash
node start.js
```

در اولین اجرا ابزار:
1. تمام وابستگی‌ها رو نصب می‌کنه
2. منوی اصلی رو نشون می‌ده

از منوی اصلی:
- **Generate Notes** — لینک یوتیوب رو وارد کن، AI رو انتخاب کن، نوت‌هات رو دریافت کن
- **Configure API Keys** — کلیدهای API و مسیر کوکی رو تنظیم کن

فایل‌های خروجی در پوشه `output/` به صورت `VideoTitle.md` ذخیره می‌شن.

---

## 📜 لایسنس

MIT

---

## 💡 ساخته شده توسط

با ❤️ توسط [MB-PieSec](https://github.com/MB-PieSec)
