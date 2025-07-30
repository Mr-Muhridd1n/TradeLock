import { useState } from "react";
import { FormatNumber } from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import {
  CheckCircle,
  AlertTriangle,
  X,
  DollarSign,
  User,
  Percent,
  Receipt,
} from "lucide-react";
import { Tasdiqlash } from "./Tasdiqlash";
import { BekorQilish } from "./BekorQilish";

export const Sotuvchi = ({ data }) => {
  const timeAgo = TimeAgo(data.time);
  const numberFormat = FormatNumber(data.value);
  const komissiya = FormatNumber(data.komissiyaValue);
  const [view, setView] = useState(null);
  const [view_b, setView_b] = useState(null);

  return (
    <>
      {/* Faol  */}
      {data.holat == "faol" && (
        <li
          key={data.id}
          className="trade-item active bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1"
        >
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
                {data.savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Sotuvchi: {data.user}
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
          <div className="progress-bar">
            <div className="progress-fill w-2/3"></div>
          </div>
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-green-600 to-green-400 text-white"
              onClick={() => {
                setView(data.id);
              }}
            >
              Tasdiqlash
            </button>
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-red-500 to-red-700 text-white"
              onClick={() => {
                setView_b(data.id);
              }}
            >
              Bekor qilish
            </button>
          </div>
        </li>
      )}

      {/* Yakunlangan */}
      {data.holat == "yakunlangan" && (
        <li
          key={data.id}
          className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden completed before:absolute before:top-0 before:left-0 before:right-0 before:h-1"
        >
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
                {data.savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Sotuvchi: {data.user}
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
          <div className="trade-actions flex gap-2.5 mt-3.5">
            {baho ? (
              ""
            ) : (
              <button className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                Baho berish
              </button>
            )}
          </div>
        </li>
      )}

      {/* Bekor qilingan */}
      {data.holat == "bekor qilingan" && (
        <li
          key={data.id}
          className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden cancelled before:absolute before:top-0 before:left-0 before:right-0 before:h-1"
        >
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
                {data.savdoName}
              </div>
              <div className="trade-participants text-xs text-[#7f8c8d] mb-1">
                Xaridor: {data.user}
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
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-red-500 to-red-700 text-white">
              Tafsilotlar
            </button>
          </div>
        </li>
      )}

      {view && <Tasdiqlash setView={setView} data={data} />}
      {view_b && <BekorQilish setView_b={setView_b} data={data} />}
    </>
  );
};
