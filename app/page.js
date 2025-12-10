'use client';
import { useState } from 'react';
import JSZip from 'jszip';

export default function Home() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [style, setStyle] = useState('Q版可愛風');
  const [count, setCount] = useState(8);
  const [occasion, setOccasion] = useState('');
  const [texts, setTexts] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);

  const styles = ['Q版可愛風', '蠟筆塗鴉風', '麥克筆手繪風', '3D卡通風', '少女漫畫風', '炭筆素描風'];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoUrl(URL.createObjectURL(file));
      setStep(2); // 自動跳到第二步
    }
  };

  const generateTexts = async () => {
    setLoading(true);
    const res = await fetch('/api/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occasion: occasion || '日常', style_tone: style, count })
    });
    const data = await res.json();
    setTexts(data);
    setStep(3);
    setLoading(false);
  };

  const generateStickers = async () => {
    setLoading(true);
    const form = new FormData();
    form.append('photo', photo);
    form.append('texts', JSON.stringify(texts));
    form.append('style', style);

    const res = await fetch('/api/generate', { method: 'POST', body: form });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StickerHero_貼圖包.zip';
    a.click();
    setLoading(false);
  };

  if (step === 1) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">StickerHero v1.0.0</h1>
        <p className="text-gray-600 mb-8">上傳你的照片，生成個人化 LINE 貼圖！</p>
        <label className="block">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full cursor-pointer text-lg font-semibold hover:scale-105 transition">
            選擇檔案
          </div>
        </label>
        {photoUrl && <img src={photoUrl} alt="預覽" className="mt-6 rounded-lg max-h-60 mx-auto" />}
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6">設定你的貼圖</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">風格</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3 border rounded-lg text-lg">
              {styles.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">張數</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-3 border rounded-lg text-lg">
              <option value={8}>8 張（免費快）</option>
              <option value={16}>16 張</option>
              <option value={24}>24 張</option>
              <option value={40}>40 張</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">使用場合（可留空）</label>
            <input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="例如：生日、情侶、道歉、工作" className="w-full p-3 border rounded-lg text-lg" />
          </div>
          <button onClick={generateTexts} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-full text-xl font-bold hover:scale-105 transition disabled:opacity-50">
            {loading ? '生成文字中…' : '下一步 → 生成文字'}
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6">編輯文字（可直接修改）</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {texts.map((t, i) => (
            <div key={i} className="border rounded-lg p-4 flex gap-3 items-center">
              <span className="text-2xl font-bold text-gray-400 w-8">{i+1}</span>
              <input value={t.zh} onChange={(e) => { const nt = [...texts]; nt[i].zh = e.target.value; setTexts(nt); }} className="flex-1 border-b-2 border-purple-300 focus:border-purple-600 outline-none text-lg" />
              <span className="text-gray-500">→</span>
              <input value={t.en} onChange={(e) => { const nt = [...texts]; nt[i].en = e.target.value; setTexts(nt); }} className="w-32 border-b-2 border-pink-300 focus:border-pink-600 outline-none" />
            </div>
          ))}
        </div>
        <button onClick={generateStickers} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-5 rounded-full text-2xl font-bold hover:scale-105 transition disabled:opacity-50">
          {loading ? '製作貼圖中，請稍候（8張約1-3分鐘）…' : '🎉 開始製作貼圖！'}
        </button>
      </div>
    </div>
  );

  return <div className="min-h-screen flex items-center justify-center">生成完成！ZIP 已經自動下載了 🎉</div>;
}
