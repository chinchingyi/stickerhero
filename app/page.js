'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [style, setStyle] = useState('Q版可愛風');
  const [count, setCount] = useState(8);
  const [occasion, setOcc�] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setShowSettings(true); // 強制顯示設定頁
    }
  };

  if (!showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            StickerHero v1.0.0
          </h1>
          <p className="text-2xl mb-10">上傳你的照片，30 秒擁有專屬 LINE 貼圖！</p>
          
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:scale-110 transition inline-block">
              選擇照片開始
            </div>
          </label>

          {preview && (
            <div className="mt-8">
              <img src={preview} alt="預覽" className="rounded-2xl shadow-lg max-h-96 mx-auto" />
              <p className="mt-4 text-gray-600">照片已上傳，準備生成設定…</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 第二步：設定頁（一定會出現！）
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center mb-8">設定你的貼圖</h2>
        {preview && <img src={preview} alt="預覽" className="w-48 h-48 object-cover rounded-2xl mx-auto mb-8 shadow-lg" />}

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-bold mb-2">風格</label>
            <select value={style} onChange={e => setStyle(e.target.value)} className="w-full p-4 text-xl border-4 border-purple-300 rounded-2xl">
              {['Q版可愛風','蠟筆塗鴉風','麥克筆手繪風','3D卡通風','少女漫畫風','炭筆素描風'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xl font-bold mb-2">張數</label>
            <select value={count} onChange={e => setCount(+e.target.value)} className="w-full p-4 text-xl border-4 border-purple-300 rounded-2xl">
              <option value={8}>8 張（最快）</option>
              <option value={16}>16 張</option>
              <option value={24}>24 張</option>
            </select>
          </div>

          <div>
            <label className="block text-xl font-bold mb-2">場合（可留空）</label>
            <input value={occasion} onChange={e => setOccasion(e.target.value)} placeholder="例如：生日、情侶、工作" className="w-full p-4 text-xl border-4 border-purple-300 rounded-2xl" />
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 rounded-2xl text-2xl font-bold hover:scale-105 transition">
            生成文字 → 開始製作貼圖
          </button>
        </div>
      </div>
    </div>
  );
}
