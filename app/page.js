'use client';
import { useState } from 'react';

export default function Home() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [preview, setPreview] = useState('');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setHasPhoto(true);
    }
  };

  if (hasPhoto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center max-w-2xl">
          <div className="text-9xl mb-8">成功！</div>
          <h1 className="text-5xl font-bold mb-6 text-green-600">StickerHero 已就緒！</h1>
          <img src={preview} alt="你的照片" className="w-64 h-64 object-cover rounded-3xl mx-auto my-8 shadow-2xl" />
          <p className="text-3xl font-bold text-gray-800">完整貼圖功能明天上線！</p>
          <p className="text-xl text-gray-600 mt-4">開發者正在衝刺最後 1% 給你</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          StickerHero v1.0.0
        </h1>
        <p className="text-2xl mb-10">上傳一張照片，30 秒後獲得專屬 LINE 貼圖！</p>
        
        <label className="cursor-pointer">
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:scale-110 transition inline-block">
            選擇照片開始
          </div>
        </label>
      </div>
    </div>
  );
}
