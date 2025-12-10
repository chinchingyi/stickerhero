'use client';
import { useState } from 'react';

export default function Home() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [style, setStyle] = useState('Q版可愛風');
  const [count, setCount] = useState(8);
  const [occasion, setOccasion] = useState('');
  const [loading, setLoading] = useState('');

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const makeStickers = () => {
    setLoading('功能開發中…');
    setTimeout(() => {
      alert('恭喜！你的 StickerHero 已成功上線！\n\n完整 AI 貼圖功能將於 24 小時內開放～');
      setLoading('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <h1 className="text-5xl md:text-7xl font-bold text-center mt-8 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          StickerHero v1.0.0
        </h1>

        {/* 上傳區 */}
        {!preview ? (
          <div className="text-center">
            <p className="text-2xl mb-12">上傳一張照片，30 秒後獲得專屬 LINE 貼圖！</p>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-16 py-8 rounded-3xl text-3xl font-bold hover:scale-110 transition shadow-2xl">
                選擇照片開始
              </div>
            </label>
          </div>
        ) : (
          <>
            {/* 照片預覽 */}
            <div className="text-center mb-10">
              <img src={preview} alt="預覽" className="max-w-sm mx-auto rounded-3xl shadow-2xl" />
            </div>

            {/* 設定區 */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div>
                <label className="block text-xl font-bold mb-3">風格</label>
                <select value={style} onChange={e => setStyle(e.target.value)} className="w-full p-4 text-xl border-4 border-purple-300 rounded-2xl">
                  {['Q版可愛風','蠟筆塗鴉風','麥克筆手繪風','3D卡通風','少女漫畫風','炭筆素描風'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xl font-bold mb-3">張數</label>
                <select value={count} onChange={e => setCount(+e.target.value)} className="w-full p-4 text-xl border-4 border-purple-300 rounded-2xl">
                  <option>8 張</option><option>16 張</option><option>24 張</option>
                </select>
              </div>
              <div>
                <label className="block text-xl font-bold mb-3">場合（可留空）</label>
                <input value={occasion} onChange={e => setOccasion(e.target.value)} placeholder="生日 / 情侶 / 工作" className="w-full p-4 text-xl border-4 border-purple-300 rounded-2xl" />
              </div>
            </div>

            {/* 開始按鈕 */}
            <div className="text-center">
              <button onClick={makeStickers} disabled={!!loading} className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-10 rounded-3xl text-4xl font-bold hover:scale-105 transition disabled:opacity-70">
                {loading || '開始製作我的貼圖！'}
              </button>
              {loading && <p className="text-center mt-6 text-2xl text-gray-700">{loading}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
