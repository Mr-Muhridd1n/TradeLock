import { useState } from "react";
import { FormatNumber } from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import { SavdoDetails } from "./SavdoDetails";
import { SavdoShare } from "./SavdoShare";

export const Oluvchi = ({ data, setView }) => {
  const timeAgo = TimeAgo(data.time);
  const numberFormat = FormatNumber(data.value);
  const komissiya = FormatNumber(data.komissiyaValue);
  const savdoName = data.savdoName;
  const [showDetails, setShowDetails] = useState(false);
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      {/* Faol - user_target yo'q */}
      {data.holat === "faol" && !data.user_target && (
        <li className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden active before:absolute before:top-0 before:left-0 before:right-0 before:h-1">
          <div className="trade-header flex justify-between items-center mb-3.5">
            <div className="trade-id font-semibold text-[#2c3e50]">
              #{data.id}
            </div>
            <div className="trade-status py-1.5 px-3 text-xs font-semibold rounded-2xl active">
              Faol
            </div>
          </div>
          <div className="trade-info flex justify-between mb-[10px]">
            <div className="trade-details flex-[1]">
              <div className="trade-product text-[#2c3e50] text-base font-semibold mb-1">
                {savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Sotuvchi: Kutilmoqda...
              </div>
              <div className="trade-time text-xs text-[#95a5a6]">{timeAgo}</div>
            </div>
            <div className="trade-amount text-right">
              <div className="trade-price text-lg font-bold text-[#2c3e50] mb-1">
                {numberFormat} UZS
              </div>
              <div className="trade-commission text-xs text-[#7f8c8d]">
                Komissiya: {komissiya}
              </div>
            </div>
          </div>
          <div className="progress-bar bg-gray-200 rounded-full h-2 mb-3.5">
            <div className="progress-fill bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-1/4"></div>
          </div>
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
              onClick={() => setShowDetails(true)}
            >
              Tafsilotlar
            </button>
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-orange-500 to-orange-600 text-white"
              onClick={() => setShowShare(true)}
            >
              Ulashish
            </button>
          </div>
        </li>
      )}

      {/* Faol - user_target bor */}
      {data.holat === "faol" && data.user_target && (
        <li className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden active before:absolute before:top-0 before:left-0 before:right-0 before:h-1">
          <div className="trade-header flex justify-between items-center mb-3.5">
            <div className="trade-id font-semibold text-[#2c3e50]">
              #{data.id}
            </div>
            <div className="trade-status py-1.5 px-3 text-xs font-semibold rounded-2xl active">
              Faol
            </div>
          </div>
          <div className="trade-info flex justify-between mb-[10px]">
            <div className="trade-details flex-[1]">
              <div className="trade-product text-[#2c3e50] text-base font-semibold mb-1">
                {savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Sotuvchi: {data.user_target}
              </div>
              <div className="trade-time text-xs text-[#95a5a6]">{timeAgo}</div>
            </div>
            <div className="trade-amount text-right">
              <div className="trade-price text-lg font-bold text-[#2c3e50] mb-1">
                {numberFormat} UZS
              </div>
              <div className="trade-commission text-xs text-[#7f8c8d]">
                Komissiya: {komissiya}
              </div>
            </div>
          </div>
          <div className="progress-bar bg-gray-200 rounded-full h-2 mb-3.5">
            <div className="progress-fill bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-3/4"></div>
          </div>
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
              onClick={() => setShowDetails(true)}
            >
              Tafsilotlar
            </button>
            <a
              href={
                data.user_target
                  ? data.user_target.charAt(0) === "@"
                    ? `https://t.me/${data.user_target.slice(1)}`
                    : `tg://user?id=${data.user_target}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-green-500 to-green-600 text-white text-center"
            >
              Aloqa
            </a>
          </div>
        </li>
      )}

      {/* Yakunlangan */}
      {data.holat === "yakunlangan" && (
        <li className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden completed before:absolute before:top-0 before:left-0 before:right-0 before:h-1">
          <div className="trade-header flex justify-between items-center mb-3.5">
            <div className="trade-id font-semibold text-[#2c3e50]">
              #{data.id}
            </div>
            <div className="trade-status py-1.5 px-3 text-xs font-semibold rounded-2xl completed">
              Yakunlangan
            </div>
          </div>
          <div className="trade-info flex justify-between mb-[10px]">
            <div className="trade-details flex-[1]">
              <div className="trade-product text-[#2c3e50] text-base font-semibold mb-1">
                {savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Sotuvchi: {data.user_target}
              </div>
              <div className="trade-time text-xs text-[#95a5a6]">{timeAgo}</div>
            </div>
            <div className="trade-amount text-right">
              <div className="trade-price text-lg font-bold text-[#2c3e50] mb-1">
                {numberFormat} UZS
              </div>
              <div className="trade-commission text-xs text-[#7f8c8d]">
                Komissiya: {komissiya}
              </div>
            </div>
          </div>
          <div className="progress-bar bg-gray-200 rounded-full h-2 mb-3.5">
            <div className="progress-fill bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-full"></div>
          </div>
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
              onClick={() => setShowDetails(true)}
            >
              Tafsilotlar
            </button>
            <button className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              Baholash
            </button>
          </div>
        </li>
      )}

      {/* Bekor qilingan */}
      {data.holat === "bekor qilingan" && (
        <li className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden cancelled before:absolute before:top-0 before:left-0 before:right-0 before:h-1">
          <div className="trade-header flex justify-between items-center mb-3.5">
            <div className="trade-id font-semibold text-[#2c3e50]">
              #{data.id}
            </div>
            <div className="trade-status py-1.5 px-3 text-xs font-semibold rounded-2xl cancelled">
              Bekor qilingan
            </div>
          </div>
          <div className="trade-info flex justify-between mb-[10px]">
            <div className="trade-details flex-[1]">
              <div className="trade-product text-[#2c3e50] text-base font-semibold mb-1">
                {savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Sotuvchi: {data.user_target || "Topilmagan"}
              </div>
              <div className="trade-time text-xs text-[#95a5a6]">{timeAgo}</div>
            </div>
            <div className="trade-amount text-right">
              <div className="trade-price text-lg font-bold text-[#2c3e50] mb-1">
                {numberFormat} UZS
              </div>
              <div className="trade-commission text-xs text-[#7f8c8d]">
                Komissiya: {komissiya}
              </div>
            </div>
          </div>
          <div className="progress-bar bg-gray-200 rounded-full h-2 mb-3.5">
            <div className="progress-fill bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full w-1/4"></div>
          </div>
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
              onClick={() => setShowDetails(true)}
            >
              Tafsilotlar
            </button>
          </div>
        </li>
      )}

      {/* Tafsilotlar modali */}
      {showDetails && <SavdoDetails setView={setShowDetails} data={data} />}

      {/* Ulashish modali */}
      {showShare && <SavdoShare setShowShare={setShowShare} data={data} />}
    </>
  );
};
