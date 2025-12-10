// 環境變數
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;
const PHOTOROOM_KEY = process.env.PHOTOROOM_API_KEY;

export async function generateText({ occasion, style_tone, count }) {
  const prompt = `你是一個 LINE 貼圖文字專家。請只輸出純 JSON 陣列，不要任何其他文字：
[{"id":1,"zh":"下班啦","en":"Off work!","tone":"happy"}, ...]

規則：
- 總共 ${count} 組。
- 中文 2-8 字，英文 1-6 字。
- 場合：${occasion || '日常可愛'}。
- 風格：${style_tone}。
- 絕對無重複。
- tone 只用：happy, sad, angry 等。

輸入：occasion: "${occasion}", style_tone: "${style_tone}", count: ${count}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json' }
    })
  });
  const data = await res.json();
  return JSON.parse(data.candidates[0].content.parts[0].text); // 解析 JSON
}

export async function removeBackground(imageFile) {
  // 上傳到臨時 URL 或直接用 buffer
  const form = new FormData();
  form.append('image_file', imageFile);
  const res = await fetch('https://api.photoroom.com/v1/remove-background', {
    method: 'POST',
    headers: { 'x-api-key': PHOTOROOM_KEY },
    body: form
  });
  return await res.arrayBuffer(); // 返回 PNG buffer
}

export async function generateImage({ photo, zh, en, tone, style }) {
  const action = { happy: 'big smile' /* 更多映射 */ }[tone] || 'neutral';
  const prompt = `A ${style} sticker of the EXACT same person from reference: identical face. ${tone} expression with ${action}. 320x320, transparent bg, no text.`;

  const form = new FormData();
  form.append('inputs', prompt);
  form.append('image', photo); // buffer
  const res = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
    method: 'POST',
    headers: { Authorization: `Bearer ${HF_TOKEN}` },
    body: form
  });
  return await res.arrayBuffer(); // PNG buffer
}
