'use client';
import { useState } from 'react';
import { generateText, removeBackground, generateImage } from '../lib/api'; // 後端 API 呼叫

export default function Home() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [style, setStyle] = useState('Q版可愛風');
  const [count, setCount] = useState(8);
  const [occasion, setOccasion] = useState('');
  const [texts, setTexts] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);

  const styles = ['Q版可愛風', '蠟筆塗鴉風', '麥克筆手繪風', '3D卡通風', '少女漫畫風', '炭筆素描風'];

  const handleUpload = (e) => {
    setPhoto(e.target.files[0]);
    setStep(2);
  };

  const handleGenerateText = async () => {
    setLoading(true);
    const data = await generateText({ occasion, style_tone: style, count });
    setTexts(data);
    setStep(3);
    setLoading(false);
  };

  const handleGenerateStickers = async () => {
    setLoading(true);
    const processed = [];
    for (const text of texts) {
      const bgRemoved = await removeBackground(photo); // 假設 photo 是 URL
      const sticker = await generateImage({ photo: bgRemoved, ...text, style });
      processed.push(sticker);
    }
    setStickers(processed);
    setStep(4);
    setLoading(false);
  };

  const downloadZip = () => {
    // 用 jszip 打包
    const zip = new JSZip();
    stickers.forEach((s, i) => zip.file(`sticker_${i}.png`, s, { binary: true }));
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'stickers.zip';
      link.click();
    });
  };

  if (step === 1) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">StickerHero v1.0.0</h1>
        <p className="mb-6">上傳你的照片，生成個人化 LINE 貼圖！</p>
        <input type="file" onChange={handleUpload} accept="image/*" className="mb-4" />
      </div>
    </div>
  );

  // 步驟 2: 選風格/張數/場合
  if (step === 2) return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl mb-4">設定你的貼圖</h2>
      <select value={style} onChange={(e) => setStyle(e.target.value)} className="block w-full mb-4 p-2 border">
        {styles.map(s => <option key={s}>{s}</option>)}
      </select>
      <select value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="block w-full mb-4 p-2 border">
        <option value={8}>8 張</option>
        <option value={16}>16 張</option>
        <option value={24}>24 張</option>
        <option value={40}>40 張</option>
      </select>
      <input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="使用場合 (e.g., 生日)" className="block w-full mb-4 p-2 border" />
      <button onClick={handleGenerateText} className="bg-blue-500 text-white px-4 py-2 rounded">生成文字</button>
    </div>
  );

  // 步驟 3: 編輯文字
  if (step === 3) return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl mb-4">編輯你的文字 ({texts.length} 組)</h2>
      {texts.map((t, i) => (
        <div key={i} className="border p-2 mb-2">
          <input value={t.zh} onChange={(e) => { const newT = [...texts]; newT[i].zh = e.target.value; setTexts(newT); }} placeholder="中文" className="mr-2" />
          <input value={t.en} onChange={(e) => { const newT = [...texts]; newT[i].en = e.target.value; setTexts(newT); }} placeholder="英文" className="mr-2" />
          <span>{t.tone}</span>
        </div>
      ))}
      <button onClick={handleGenerateStickers} className="bg-green-500 text-white px-4 py-2 rounded">產生貼圖</button>
    </div>
  );

  // 步驟 4: 預覽 + 下載
  if (step === 4) return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl mb-4">你的貼圖準備好了！</h2>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stickers.map((s, i) => <img key={i} src={s} alt={`Sticker ${i}`} className="w-20 h-20" />)}
      </div>
      <button onClick={downloadZip} className="bg-purple-500 text-white px-4 py-2 rounded">下載 ZIP</button>
      <button onClick={() => setStep(1)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">重新開始</button>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">生成中... 請稍候</div>;
}
