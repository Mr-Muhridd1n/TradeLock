import { FormatNumber } from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";

export const Oluvchi = ({ data, setView }) => {
  const timeAgo = TimeAgo(data.time);
  const numberFormat = FormatNumber(data.value);
  const komissiya = FormatNumber(data.komissiyaValue);
  const savdoName = data.savdoName;
  return (
    <>
      {/* faol */}
      {data.holat == "faol" && !data.user_target && (
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
                Xaridor: Mavjut emas !
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
            <div className="progress-fill w-5/12"></div>
          </div>
          <div className="trade-actions flex gap-2.5 mt-3.5">
            <button
              className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
              onClick={() => setView(data.id)}
            >
              Tafsilotlar
            </button>
          </div>
        </li>
      )}
      {/* 
      <li className="trade-item bg-white mb-3.5 rounded-2xl p-5 shadow-md relative overflow-hidden active before:absolute before:top-0 before:left-0 before:right-0 before:h-1">
        <div className="trade-header flex justify-between items-center mb-3.5">
          <div className="trade-id font-semibold text-[#2c3e50]">
            #{data.id}
          </div>
          <div className="trade-status py-1.5 px-3 text-xs font-semibold rounded-2xl active">
            {data.status}
          </div>
        </div>
        <div className="trade-info flex justify-between mb-[10px]">
          <div className="trade-details flex-[1]">
            <div className="trade-product text-[#2c3e50] text-base font-semibold mb-1">
              {savdoName}
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
        <div className="progress-bar">
          <div className="progress-fill w-5/12"></div>
        </div>
        <div className="trade-actions flex gap-2.5 mt-3.5">
          <button className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
            Tafsilotlar
          </button>
          <a
            href={
              data.user_target
                ? data.user_target.charAt(0) == "@"
                  ? `https://t.me/${data.user_target.slice(1)}`
                  : `tg://user?id=${data.user_target}`
                : "Mavjut emas"
            }
            target="_blank"
            className="btn flex-1 py-2.5 px-4 border-none rounded-lg font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-red-500 to-red-700 text-white"
          >
            Aloqa
          </a>
        </div>
      </li> */}
    </>
  );
};
