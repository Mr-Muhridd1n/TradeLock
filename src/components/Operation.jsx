import React from "react";
import { TimeAgo } from "./TimeAgo";
import { FormatNumber } from "./FormatNumber";

export const Operation = ({ data, hide }) => {
  const timeAgo = TimeAgo(data.time);
  const numberFormat = FormatNumber(data.value);
  return (
    <>
      {/* Savdo da maxsulot sotsa */}
      {data.status == "+savdo" && (
        <li
          key={data.id}
          className="transaction-item rounded-xl p-4 shadow-sm card-hover"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-green rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Savdo #{data.id}
                </div>
                <div className="text-sm text-gray-500">{timeAgo}</div>
              </div>
            </div>
            <div className="text-right">
              {hide ? (
                <div className="font-bold text-green-600">••• •••</div>
              ) : (
                <div className="font-bold text-green-600">+{numberFormat}</div>
              )}
              <div className="text-sm text-gray-500">UZS</div>
            </div>
          </div>
        </li>
      )}

      {/* Savdoda maxsulot olsa */}
      {data.status == "-savdo" && (
        <li
          key={data.id}
          className="transaction-item rounded-xl p-4 shadow-sm card-hover"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-red rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 12h12"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Savdo #{data.id}
                </div>
                <div className="text-sm text-gray-500">{timeAgo}</div>
              </div>
            </div>
            <div className="text-right">
              {hide ? (
                <div className="font-bold text-red-600">••• •••</div>
              ) : (
                <div className="font-bold text-red-600">-{numberFormat}</div>
              )}

              <div className="text-sm text-gray-500">UZS</div>
            </div>
          </div>
        </li>
      )}

      {/* Savdodagi maxsulot uchun komissiya */}
      {data.status == "komissiya" && (
        <li
          key={data.id}
          className="transaction-item rounded-xl p-4 shadow-sm card-hover"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-orange rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Komissiya to'lovi
                </div>
                <div className="text-sm text-gray-500">{timeAgo}</div>
              </div>
            </div>
            <div className="text-right">
              {hide ? (
                <div className="font-bold text-red-600">••• •••</div>
              ) : (
                <div className="font-bold text-red-600">-{numberFormat}</div>
              )}
              <div className="text-sm text-gray-500">UZS</div>
            </div>
          </div>
        </li>
      )}

      {/* Hisob to'ldirgandagi malumot */}
      {data.status == "hisobtoldirish" && (
        <li
          key={data.id}
          className="transaction-item rounded-xl p-4 shadow-sm card-hover"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-blue rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Hisob to'ldirish
                </div>
                <div className="text-sm text-gray-500">{timeAgo}</div>
              </div>
            </div>
            <div className="text-right">
              {hide ? (
                <div className="font-bold text-green-600">••• •••</div>
              ) : (
                <div className="font-bold text-green-600">+{numberFormat}</div>
              )}

              <div className="text-sm text-gray-500">UZS</div>
            </div>
          </div>
        </li>
      )}

      {/* o'tkazma dostiga yoki biron kimsaga */}
      {data.status == "otkazma" && (
        <li
          key={data.id}
          className="transaction-item rounded-xl p-4 shadow-sm card-hover"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  O'tkazma {data.user}
                </div>
                <div className="text-sm text-gray-500">{timeAgo}</div>
              </div>
            </div>
            <div className="text-right">
              {hide ? (
                <div className="font-bold text-red-600">••• •••</div>
              ) : (
                <div className="font-bold text-red-600">-{numberFormat}</div>
              )}

              <div className="text-sm text-gray-500">UZS</div>
            </div>
          </div>
        </li>
      )}
    </>
  );
};
