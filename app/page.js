'use client';
import { useState } from 'react';
import JSZip from 'jszip';

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY; // 等等你再加這行 env
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

export default function Home() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [style, setStyle] = useState('Q版可愛風');
  const [count, setCount] = useState(8);
  const [occasion, setOccasion] = useState('');
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState('');

  const styles = ['Q版可愛風', '蠟筆塗鴉風', '麥克筆手繪風', '3D卡通風', '少女漫畫風', '炭筆素描風'];

  // 步驟1：上傳照片
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  // 步驟2：生成文字（直接呼叫 Gemini）
  const generateTexts = async () => {
    setLoading('正在用 Gemini 產生文字…');
    const prompt = `你是一個專業 LINE 貼圖文字專家，只回傳純 JSON 陣列（不要任何說明）：
[{"id":1,"zh":"生日快樂","en":"Happy Birthday","tone":"happy"}, ...]

要求：
- 總共 ${count} 組
- 風格：${style} 
- 場合：${occasion || '日常對話'}
- 中文 2-8 字，英文 1-6 字
- 絕對不能重複
- tone 只用 happy, sad, love, angry, surprised, laugh, shy, excited, sorry, ok

現在開始：`;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });
      const data = await res.json();
      const jsonText = data.candidates[0].content.parts[0].text;
      setTexts(JSON.parse(jsonText));
      setStep(3);
    } catch (e) {
      alert('文字生成失敗，請確認 GEMINI_KEY 是否正確');
    }
    setLoading('');
  };

  // 步驟3：生成所有貼圖 + ZIP
  const generateStickers = async () => {
    setLoading('製作貼圖中，可能要 2-5 分鐘，請勿關閉頁面…');
    const zip = new JSZip();
    let processed = 0;

    for (let i = 0; i < texts.length; i++) {
      const t = texts[i];
      const action = {
        happy: 'big smile sparkling eyes', love: 'heart eyes blushing', angry: 'angry face', 
        surprised: 'wide eyes mouth open', laugh: 'laughing hard', shy: 'blushing looking away',
        excited: 'jumping with joy', sorry: 'bowing apology', ok: 'OK hand gesture'
      }[t.tone] || 'neutral expression';

      const prompt = `A ${style} chibi sticker of the exact same person in the reference photo, ${action}, centered, 320x320, transparent background, no text, cute style, high detail`;

      const form = new FormData();
      form.append('inputs', prompt);
      form.append('image', photo);

      try {
        const res = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
          method: 'POST',
          headers: { Authorization: `Bearer ${HF_TOKEN}` },
          body: form
        });
        const blob = await res.blob();
        zip.file(`${i+1}_${t.zh}.png`, blob);
        processed++;
        setLoading(`已完成 ${processed}/${texts.length} 張…`);
      } catch (e) {
        console.log('第', i+1, '張失敗');
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `StickerHero_${style}_${count}張.zip`;
    a.click();
    setLoading('完成！已下載');
    setTimeout(() => setStep(1), 3000);
  };

  // === 畫面 ===
  if (step === 1) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">StickerHero v1.0.0</h1>
        <p className="text-xl text-gray-700 mb-10">上傳你的照片，30 秒後擁有專屬 LINE 貼圖！</p>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:scale-110 transition inline-block">
            選擇照片開始
          </div>
        </label>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold mb-8 text-center">設定你的貼圖</h2>
        {photoUrl && <img src={photoUrl} alt="預覽" className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6 shadow-lg" />}
        <div className="space-y-6">
          <select value={style} onChange={e=>setStyle(e.target.value)} className="w-full p-4 text-xl border-2 rounded-xl">
            {styles.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={count} onChange={e=>setCount(+e.target.value)} className="w-full p-4 text-xl border-2 rounded-xl">
            <option value={8}>8 張（最快）</option><option value={16}>16 張</option><option value={24}>24 張</option>
          </select>
          <input value={occasion} onChange={e=>setOccasion(e.target.value)} placeholder="場合（可留空） ex: 生日、情侶" className="w-full p-4 text-xl border-2 rounded-xl" />
          <button onClick={generateTexts} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 rounded-2xl text-2xl font-bold hover:scale-105 transition">
            {loading || '下一步 → 生成文字'}
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold mb-8 text-center">編輯文字（可直接改）</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {texts.map((t,i)=>(
            <div key={i} className="bg-purple-50 rounded-2xl p-6 flex items-center gap-4">
              <div className="text-3xl font-bold text-purple-600 w-12">{i+1}</div>
              <input value={t.zh} onChange={e=>{const nt=[...texts]; nt[i].zh=e.target.value; setTexts(nt);}} className="text-2xl font-bold flex-1 bg-transparent border-b-4 border-purple-300 focus:border-purple-600 outline-none" />
              <span className="text-2xl">→</span>
              <input value={t.en} onChange={e=>{const nt=[...texts]; nt[i].en=e.target.value; setTexts(nt);}} className="text-xl w-32 bg-transparent border-b-4 border-pink-300" />
            </div>
          ))}
        </div>
        <button onClick={generateStickers} className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-8 rounded-3xl text-3xl font-bold hover:scale-105 transition">
          {loading || '開始製作所有貼圖！'}
        </button>
        {loading && <div className="text-center mt-6 text-2xl text-gray-600">{loading}</div>}
      </div>
    </div>
  );
}
