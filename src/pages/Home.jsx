import React from "react";
import { Header } from "../components/Header";
import { FormatNumber } from "../components/FormatNumber";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";
import { Link, NavLink } from "react-router-dom";
import { FaShop, FaUserLock, FaWeixin, FaWpforms } from "react-icons/fa6";
import { FaChessBishop, FaRegListAlt } from "react-icons/fa";

export const Home = () => {
  const { result, dispatch } = useMainGlobalContext();

  console.log(result);

  const calculateSuccessPercentage = (dataArray) => {
    const totalItems = dataArray.length;
    const activeItems = dataArray.filter((item) => item.active === true).length;
    return totalItems > 0 ? (activeItems / totalItems) * 100 : 0;
  };
  const successPercentage = calculateSuccessPercentage(
    result.data.savdolar
  ).toFixed();
  let faol = result.data.savdolar.filter((item) => item.holat == "faol").length;

  return (
    <>
      <Header title={"home"} />
      <main>
        <section>
          <div className="bg-[#f8f9fa] py-5 align-elements mb-20">
            <div className="bg-white m-b-5 rounded-2xl p-6 shadow-md text-center relative overflow-hidden mb-5">
              <div className="absolute w-full left-0 right-0 top-1 h-1 bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"></div>
              <div className="text-[#7f8c8d] mb-4">Joriy Balans</div>
              <div className="text-3xl font-bold text-[#2c3e50] mt-2.5">
                {FormatNumber(result.balance)}
              </div>
              <div className="flex mt-5 gap-2.5">
                <NavLink
                  to="/hamyon/toldirish"
                  className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white flex-[1] p-3 border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 ease"
                >
                  To'ldirish
                </NavLink>
                <NavLink
                  to="/hamyon/chiqarish"
                  className="bg-[#f8f9fa] text-[#495057] border-2 border-[#e9ecef] flex-[1] p-3  rounded-xl font-semibold cursor-pointer transition-all duration-300 ease"
                >
                  Chiqarish
                </NavLink>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white p-5 rounded-2xl text-center shadow-md">
                <div className="text-2xl font-bold text-[#2c3e50] mb-1.5">
                  {FormatNumber(faol)}
                </div>
                <div className="text-[12px] text-[#7f8c8d]">Faol Savdolar</div>
              </div>
              <div className="bg-white p-5 rounded-2xl text-center shadow-md">
                <div className="text-2xl font-bold text-[#2c3e50] mb-1.5">
                  {successPercentage}%
                </div>
                <div className="text-[12px] text-[#7f8c8d]">Muvaffaqiyat</div>
              </div>
            </div>

            <div className="py-5">
              <NavLink
                className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 easy shadow-md hover:translate-y-0.5 hover:shadow-lg"
                to="/savdolar/new"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-linear-to-tr from-[#ff6b6b] to-[#ee5a52]">
                  <FaRegListAlt />
                </div>
                <div className="flex-[1]">
                  <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                    Yangi Savdo
                  </h4>
                  <div className="text-sm text-[#7f8c8d]">
                    Xavfsiz sotish/sotib olish
                  </div>
                </div>
                <div className="text-[#bdc3c7] text-lg">›</div>
              </NavLink>

              <NavLink
                className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 easy shadow-md hover:translate-y-0.5 hover:shadow-lg"
                to="/savdolar"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-linear-to-tr from-[#4ecdc4] to-[#44a08d]">
                  <FaWpforms />
                </div>
                <div className="flex-[1]">
                  <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                    Savdolar Tarixi
                  </h4>
                  <div className="text-sm text-[#7f8c8d]">
                    Barcha tranzaksiyalar
                  </div>
                </div>
                <div className="text-[#bdc3c7] text-lg">›</div>
              </NavLink>

              <NavLink
                className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 easy shadow-md hover:translate-y-0.5 hover:shadow-lg"
                to="/sozlamalar"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-linear-to-tr from-[#45b7d1] to-[#2980b9]">
                  <FaUserLock />
                </div>
                <div className="flex-[1]">
                  <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                    Xavfsizlik
                  </h4>
                  <div className="text-sm text-[#7f8c8d]">
                    Himoya sozlamalari
                  </div>
                </div>
                <div className="text-[#bdc3c7] text-lg">›</div>
              </NavLink>

              <a
                className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 easy shadow-md hover:translate-y-0.5 hover:shadow-lg"
                href="https://t.me/TradeLock_support"
                target="_blank"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-linear-to-tr from-[#f093fb] to-[#f5576c]">
                  <FaWeixin />
                </div>
                <div className="flex-[1]">
                  <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                    Yordam
                  </h4>
                  <div className="text-sm text-[#7f8c8d]">
                    24/7 qo'llab-quvvatlash
                  </div>
                </div>
                <div className="text-[#bdc3c7] text-lg">›</div>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
