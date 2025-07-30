import { useState } from "react";
import { Header } from "../components/Header";
import { Operation } from "../components/Operation";
import { FormatNumber } from "../components/FormatNumber";
import { Link, useParams } from "react-router-dom";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";
import { Toldirish } from "../components/Toldirish";
import { Chiqarish } from "../components/Chiqarish";
import { Eye, EyeOff } from "lucide-react";

export const Hamyon = () => {
  const { result, dispatch } = useMainGlobalContext();
  const hide = result.user.setting.balance_hide;
  const [operation, setOperation] = useState("min");
  const { status } = useParams();

  if (status == "toldirish") {
    return <Toldirish />;
  } else if (status == "chiqarish") {
    return <Chiqarish />;
  } else {
    return (
      <>
        <Header title={"hamyon"} />
        <main>
          <section className="align-elements">
            <div className="py-4">
              <div className="balance-card rounded-2xl p-6 text-white card-hover relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
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
                    <span className="text-sm opacity-80">Asosiy hisob</span>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg text-base cursor-pointer"
                    onClick={() =>
                      dispatch({
                        type: "SETHIDE",
                        payload: !hide,
                      })
                    }
                  >
                    {!hide ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-1">
                    {hide ? "••• •••" : FormatNumber(result.balance)}
                  </div>
                  <div className="text-sm opacity-80">UZS</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="opacity-80">Oxirgi o'zgarish</div>
                    <div
                      className={
                        (result &&
                          result.data.savdolar.length >= 1 &&
                          result.data.operation[0].status == "+savdo") ||
                        result.data.operation[0].status == "hisobtoldirish" ||
                        result.data.operation[0].status == "+otkazma"
                          ? "font-semibold text-green-300"
                          : "font-semibold text-red-400"
                      }
                    >
                      {hide
                        ? ""
                        : (result &&
                            result.data.savdolar.length >= 1 &&
                            result.data.operation[0].status == "+savdo") ||
                          result.data.operation[0].status == "hisobtoldirish" ||
                          result.data.operation[0].status == "+otkazma"
                        ? "+"
                        : "-"}
                      {result && result.data.operation.length >= 1 && hide
                        ? "••• •••"
                        : FormatNumber(result.data.operation[0].value)}{" "}
                      UZS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 ta menyu */}
            <div className="py-2">
              <div className="grid grid-cols-4 gap-3">
                <Link
                  to="/hamyon/toldirish"
                  className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer"
                >
                  <div className="w-10 h-10 gradient-blue rounded-full flex items-center justify-center mx-auto mb-2">
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
                  <span className="text-xs font-medium text-gray-700">
                    To'ldirish
                  </span>
                </Link>
                <Link
                  to={"/hamyon/chiqarish"}
                  className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer"
                >
                  <div className="w-10 h-10 gradient-green rounded-full flex items-center justify-center mx-auto mb-2">
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
                  <span className="text-xs font-medium text-gray-700">
                    Chiqarish
                  </span>
                </Link>
                <button className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer">
                  <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center mx-auto mb-2">
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
                  <span className="text-xs font-medium text-gray-700">
                    O'tkazma
                  </span>
                </button>
                <button className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer">
                  <div className="w-10 h-10 gradient-orange rounded-full flex items-center justify-center mx-auto mb-2">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Hisobot
                  </span>
                </button>
              </div>
            </div>

            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Oxirgi operatsiyalar
                </h2>
                <button
                  onClick={() => {
                    setOperation(operation == "min" ? "all" : "min");
                  }}
                  className="text-blue-500 text-sm font-medium cursor-pointer"
                >
                  {operation !== "min" ? "Yashirish" : "Barchasi"}
                </button>
              </div>

              <ul className="flex flex-col gap-3 pb-20">
                {operation == "min"
                  ? result &&
                    result.data.operation.slice(0, 3).map((data) => {
                      return (
                        <Operation key={data.id} data={data} hide={hide} />
                      );
                    })
                  : result &&
                    result.data.operation.map((data) => {
                      return (
                        <Operation key={data.id} data={data} hide={hide} />
                      );
                    })}
              </ul>
            </div>
          </section>
        </main>
      </>
    );
  }
};
