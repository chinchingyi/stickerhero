'use client';
import { useState } from 'react';

export default function Home() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [step, setStep] = useState(1);
  const [style] = useState('Q版可愛風');
  const [count] = useState(8);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setStep(2);
    }
  };

  // 第一步：上傳頁面
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            StickerHero v1.0.0
          </h1>
          <p className="text-2xl mb-10">上傳一張照片，30 秒後獲得專屬 LINE 貼圖！</p>

          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:scale-110 transition inline-block">
              選擇照片開始
            </div>
          </label>

          {preview && (
            <div className="mt-8">
              <p className="text-xl mb-4 text-green-600 font-bold">照片上傳成功！</p>
              <img src={preview} alt="預覽" className="rounded-2xl shadow-lg max-h-80 mx-auto" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 第二步：成功頁面（直接顯示）
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
        <div className="text-8xl mb-8">成功啦！</div>
        <h2 className="text-4xl font-bold mb-6">你的 StickerHero 已經上線</h2>
        <p className="text-2xl mb-8 text-gray-700">
          目前功能還在開發中，很快就能生成貼圖喔！
        </p>
        <p className="text-xl text-gray-600">開發者正在加班加點為你製作完整版～</p>
      </div>
    </div>
  );
}
