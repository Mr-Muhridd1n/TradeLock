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
} from "lucide-react";

export const SavdoShare = ({ setShowShare, data }) => {
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Saqlangan mahfiy kod (o'zgarmas)
  const secretCode = data.secretCode;

  // Telegram WebApp URL yaratish
  const generateWebAppURL = () => {
    const botUsername = "Trade_Lock_bot"; // Bot username
    const webAppUrl = `https://t.me/${botUsername}/start_app?savdo=${secretCode}`;
    return webAppUrl;
  };

  const webAppURL = generateWebAppURL();

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secretCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webAppURL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const shareViaTelegram = () => {
    const text = encodeURIComponent(
      `🔐 Sizga xavfsiz savdo taklifi!\n\n` +
        `🎯 Quyidagi havolani bosing:\n` +
        `${webAppURL}\n\n` +
        `✅ Yoki kodni botga yuboring: ${secretCode}\n` +
        `🤖 Bot: @Trade_Lock_bot`
    );

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        webAppURL
      )}&text=${text}`,
      "_blank"
    );
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🔐 Sizga xavfsiz savdo taklifi!\n\n` +
        `🎯 Quyidagi havolani bosing:\n` +
        `${webAppURL}\n\n` +
        `✅ Yoki kodni botga yuboring: ${secretCode}\n` +
        `🤖 Bot: t.me/Trade_Lock_bot`
    );

    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const openWebApp = () => {
    window.open(webAppURL, "_blank");
  };

  const generateQRCode = () => {
    setShowQR(true);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowShare(false)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
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
                Xavfsiz havola orqali ulashing
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showQR ? (
            <>
              {/* WebApp URL */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <ExternalLink size={16} />
                  Tezkor havola
                </h3>
                <div className="bg-white rounded-lg p-3 mb-4 break-all">
                  <div className="text-sm text-blue-600 underline">
                    {webAppURL}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyUrlToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 flex-1 ${
                      copiedUrl
                        ? "bg-green-500 text-white"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                  >
                    {copiedUrl ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copiedUrl ? "Nusxalandi!" : "Nusxalash"}
                  </button>
                  <button
                    onClick={openWebApp}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Ochish
                  </button>
                </div>
              </div>

              {/* Mahfiy kod */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500 text-center">
                <h3 className="font-semibold text-blue-800 mb-3">Savdo Kodi</h3>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                    {secretCode}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={copyCodeToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? "Nusxalandi!" : "Nusxalash"}
                  </button>
                </div>
              </div>

              {/* Yo'riqnoma */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="text-yellow-500 mt-0.5 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      2 xil usul:
                    </h3>
                    <ol className="text-sm text-yellow-700 space-y-1">
                      <li>
                        <strong>1-usul:</strong> Havolani yuborib bosishni
                        ayting
                      </li>
                      <li>
                        <strong>2-usul:</strong> Kodni nusxalab, @Trade_Lock_bot
                        ga yuboring
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Ulashish tugmalari */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Tezkor ulashish
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareViaTelegram}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">Telegram</span>
                  </button>

                  <button
                    onClick={shareViaWhatsApp}
                    className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* QR kod tugmasi */}
              <button
                onClick={generateQRCode}
                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <QrCode size={20} />
                <span className="text-sm font-medium">QR kod yaratish</span>
              </button>
            </>
          ) : (
            /* QR kod ko'rinishi */
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">QR Kod</h3>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-100 flex justify-center">
                <QRCode
                  value={webAppURL}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  level="M"
                />
              </div>
              <p className="text-sm text-gray-600">
                QR kodni skanerlash orqali to'g'ridan-to'g'ri savdoga o'tish
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Orqaga qaytish
              </button>
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
                    <li>• Havola 24 soat davomida amal qiladi</li>
                    <li>• Kod foydalanilgandan keyin o'chadi</li>
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
