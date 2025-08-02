// src/components/SavdoShare.jsx - Yaxshilangan ulashish komponenti
import React, { useState } from "react";
import QRCode from "react-qr-code";
import {
  X,
  Copy,
  Share2,
  MessageCircle,
  CheckCircle,
  QrCode,
  AlertCircle,
  ExternalLink,
  Globe,
  Smartphone,
} from "lucide-react";

export const SavdoShare = ({ setShowShare, data }) => {
  const [copied, setCopied] = useState({});
  const [showQR, setShowQR] = useState(false);

  const secretCode = data.secretCode || data.secret_code;

  // Turli URL formatlarini yaratish
  const generateUrls = () => {
    const baseUrl = window.location.origin;

    return {
      // Asosiy URL (eng qulay)
      main: `${baseUrl}/join/${secretCode}`,

      // Query parameter bilan
      query: `${baseUrl}/join?trade=${secretCode}`,

      // Qisqa URL
      short: `${baseUrl}/t/${secretCode}`,

      // Telegram WebApp URL
      telegram: `https://t.me/Trade_Lock_bot/start_app?startapp=savdo_${secretCode}`,

      // Direct bot link
      botDirect: `https://t.me/Trade_Lock_bot?start=savdo_${secretCode}`,
    };
  };

  const urls = generateUrls();

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const shareViaTelegram = (url) => {
    const text = encodeURIComponent(
      `🔐 Sizga xavfsiz savdo taklifi!\n\n` +
        `📦 Mahsulot: ${data.trade_name || data.savdoName}\n` +
        `💰 Narx: ${data.amount || data.value} UZS\n\n` +
        `🎯 Quyidagi havolani bosing:\n` +
        `${url}\n\n` +
        `✅ Yoki kodni botga yuboring: ${secretCode}\n` +
        `🤖 Bot: @Trade_Lock_bot`
    );

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`,
      "_blank"
    );
  };

  const shareViaWhatsApp = (url) => {
    const text = encodeURIComponent(
      `🔐 Sizga xavfsiz savdo taklifi!\n\n` +
        `📦 Mahsulot: ${data.trade_name || data.savdoName}\n` +
        `💰 Narx: ${data.amount || data.value} UZS\n\n` +
        `🎯 Quyidagi havolani bosing:\n` +
        `${url}\n\n` +
        `✅ Yoki kodni botga yuboring: ${secretCode}\n` +
        `🤖 Bot: t.me/Trade_Lock_bot`
    );

    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaWebShare = (url) => {
    if (navigator.share) {
      navigator.share({
        title: "TradeLock Savdo Taklifi",
        text: `${data.trade_name || data.savdoName} - ${
          data.amount || data.value
        } UZS`,
        url: url,
      });
    } else {
      copyToClipboard(url, "web");
    }
  };

  const UrlCard = ({
    title,
    url,
    type,
    description,
    icon: Icon,
    recommended = false,
  }) => (
    <div
      className={`bg-white rounded-xl p-4 border-2 ${
        recommended ? "border-blue-200 bg-blue-50" : "border-gray-100"
      }`}
    >
      {recommended && (
        <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2">
          <CheckCircle size={12} />
          TAVSIYA ETILADI
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            recommended ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${
              recommended ? "text-blue-600" : "text-gray-600"
            }`}
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3 break-all">
        <div className="text-sm text-gray-700 font-mono">{url}</div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => copyToClipboard(url, type)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
            copied[type]
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {copied[type] ? <CheckCircle size={16} /> : <Copy size={16} />}
          {copied[type] ? "Nusxalandi!" : "Nusxalash"}
        </button>

        <button
          onClick={() => shareViaTelegram(url)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          title="Telegramda ulashish"
        >
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowShare(false)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 relative">
          <button
            onClick={() => setShowShare(false)}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Share2 className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Savdoni Ulashish</h2>
              <p className="text-green-100 text-sm">
                Turli usullar bilan havola ulashing
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showQR ? (
            <>
              {/* Savdo ma'lumotlari */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Savdo ma'lumotlari
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mahsulot:</span>
                    <span className="font-medium text-gray-800 ml-2">
                      {data.trade_name || data.savdoName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Narx:</span>
                    <span className="font-medium text-gray-800 ml-2">
                      {data.amount || data.value} UZS
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Kod:</span>
                    <span className="font-mono font-medium text-gray-800 ml-2">
                      {secretCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium text-gray-800 ml-2">
                      #{data.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* URL Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Ulashish usullari
                </h3>

                <UrlCard
                  title="Asosiy havola"
                  url={urls.main}
                  type="main"
                  description="Eng qulay va sodda havola"
                  icon={Globe}
                  recommended={true}
                />

                <UrlCard
                  title="Telegram WebApp"
                  url={urls.telegram}
                  type="telegram"
                  description="To'g'ridan-to'g'ri Telegram ilovasida ochiladi"
                  icon={Smartphone}
                />

                <UrlCard
                  title="Telegram Bot"
                  url={urls.botDirect}
                  type="botDirect"
                  description="Bot orqali ochiladi"
                  icon={MessageCircle}
                />

                <UrlCard
                  title="Qisqa havola"
                  url={urls.short}
                  type="short"
                  description="Qisqa va esda qolarli"
                  icon={ExternalLink}
                />
              </div>

              {/* Tezkor ulashish */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Tezkor ulashish
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => shareViaTelegram(urls.main)}
                    className="flex flex-col items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={24} />
                    <span className="text-sm font-medium">Telegram</span>
                  </button>

                  <button
                    onClick={() => shareViaWhatsApp(urls.main)}
                    className="flex flex-col items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={24} />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => shareViaWebShare(urls.main)}
                    className="flex flex-col items-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <Share2 size={24} />
                    <span className="text-sm font-medium">Boshqalar</span>
                  </button>
                </div>
              </div>

              {/* QR kod tugmasi */}
              <button
                onClick={() => setShowQR(true)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <QrCode size={20} />
                <span className="font-medium">QR kod yaratish</span>
              </button>
            </>
          ) : (
            /* QR kod ko'rinishi */
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">QR Kod</h3>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-100 flex justify-center">
                <QRCode
                  value={urls.main}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  level="M"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  QR kodni skanerlash orqali to'g'ridan-to'g'ri savdoga o'tish
                  mumkin
                </p>
                <p className="text-xs text-blue-600 mt-2 font-mono">
                  {urls.main}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(urls.main, "qr")}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                    copied.qr
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {copied.qr ? "Nusxalandi!" : "Havolani nusxalash"}
                </button>

                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Orqaga qaytish
                </button>
              </div>
            </div>
          )}

          {/* Yo'riqnoma */}
          {!showQR && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-yellow-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Qo'llanma:
                  </h3>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Yuqoridagi havolalardan birini tanlang</li>
                    <li>Nusxalash yoki ulashish tugmasini bosing</li>
                    <li>Do'stingizga yuboring</li>
                    <li>Ular havolani bosib savdoga qo'shiladi</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Xavfsizlik eslatmasi */}
          {!showQR && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-red-500 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    Xavfsizlik:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Havolani faqat ishonchli odamlar bilan ulashing</li>
                    <li>• Savdo 24 soat davomida faol bo'ladi</li>
                    <li>• Kod ishlatilgandan keyin o'chadi</li>
                    <li>• Noto'g'ri kodni ulashmang</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
