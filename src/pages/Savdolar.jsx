import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { Sotuvchi } from "../components/Sotuvchi";
import { Oluvchi } from "../components/Oluvchi";
import { Header } from "../components/Header";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";
import { useState } from "react";
import { FormatNumber } from "../components/FormatNumber";
import { AlertTriangle, Copy } from "lucide-react";

export const Savdolar = () => {
  const { result, dispatch } = useMainGlobalContext();
  const { yangi_savdo } = useParams();
  const [type, setType] = useState("sotish");
  const [savdoSummasi, setSavdoSummasi] = useState("");
  const [savdoKomissiyasi, setsavdoKomissiyasi] = useState("men");
  const [savdoName, setSavdoName] = useState("");
  const [view, setView] = useState(null);
  const [_type, _setType] = useState("faol");
  const [showModal, setShowModal] = useState(false);
  const savdoHavola = "liughflka_jdsbc_li";
  const navigate = useNavigate();
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so +1
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const createSavdo = () => {
    dispatch({
      type: "NEWSAVDO",
      payload: {
        id: 4,
        status: type == "sotish" ? "sotuvchi" : "oluvchi",
        holat: "faol",
        user_target: null,
        navbat: type == "sotish" ? false : true,
        time: formatDate(new Date()),
        value: savdoSummasi,
        komissiya: savdoKomissiyasi,
        active: true,
        savdoName: savdoName ? savdoName : "Nomalum savdo",
      },
    });
    setShowModal(true);
  };

  if (view) {
    <div className="w-full h-screen flex bg-black/50 items-center justify-center fixed z-10 top-0 px-3">
      <div className="bg-white w-full mx-auto p-6 rounded-2xl shadow-lg flex mb-5 flex-col gap-4 ">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Savdo yaratish natijasi
        </h2>
        <div className="bg-gray-100 w-full flex flex-col rounded-xl p-4 gap-3 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Savdo nomi:</span>
            <span className="text-gray-800 font-semibold">
              {savdoName || "Nomalum"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Savdo summasi:</span>
            <span className="text-gray-800 font-semibold">
              {FormatNumber(savdoSummasi)} UZS
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Komissiya:</span>
            <span className="text-gray-800 font-semibold">
              {savdoKomissiyasi === "men"
                ? "Sizdan"
                : savdoKomissiyasi === "ortada"
                ? "Ortada"
                : type === "sotish"
                ? "Oluvchi tomonidan"
                : "Sotuvchi tomonidan"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              Komissiya summasi:
            </span>
            <span className="text-gray-800 font-semibold">
              {FormatNumber((savdoSummasi / 100) * 2)} UZS
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              {type === "sotish" ? "Siz qabul qilasiz" : "Siz sarflaysiz"}:
            </span>
            <span
              className={`${
                type === "sotish" ? `text-green-600` : `text-red-600`
              } font-bold`}
            >
              {FormatNumber(
                type === "sotish"
                  ? savdoKomissiyasi === "men"
                    ? Number(savdoSummasi) - (Number(savdoSummasi) / 100) * 2
                    : savdoKomissiyasi === "ortada"
                    ? Number(savdoSummasi) -
                      ((Number(savdoSummasi) / 100) * 2) / 2
                    : Number(savdoSummasi)
                  : savdoKomissiyasi === "men"
                  ? Number(savdoSummasi) + (Number(savdoSummasi) / 100) * 2
                  : savdoKomissiyasi === "ortada"
                  ? Number(savdoSummasi) -
                    ((Number(savdoSummasi) / 100) * 2) / 2
                  : Number(savdoSummasi)
              )}{" "}
              UZS
            </span>
          </div>
          <div
            className="flex justify-between items-center cursor-pointer mb-3"
            onClick={() =>
              navigator.clipboard.writeText(
                `https://t.me/Trade_Lock_bot/start_app/view?${savdoHavola}`
              )
            }
          >
            <span className="text-gray-600 font-medium">Savdo Havolasi:</span>
            <span className="text-gray-800 font-semibold flex items-center gap-3">
              {savdoHavola} <Copy className="w-4 h-4" />
            </span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                Nima qilishim kerak:
              </span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Savdo havolasini nusha oling</li>
              <li>• Savdo qilmoqchi bolgan dostingizga yuboring</li>
              <li>• Savdoni boshlashini so'rang</li>
            </ul>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/");
              }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Tushundim
            </button>
          </div>
        </div>
      </div>
    </div>;
  }

  if (yangi_savdo == "new") {
    return (
      <>
        <Header title={"new_savdolar"} />
        <main>
          <section>
            <div className="align-elements">
              <div className="w-full flex flex-col">
                <div className="flex my-5 flex-col w-full gap-3">
                  <p className="text-base font-semibold text-left text-gray-500 m-0 p-0">
                    Nima qilmoqchisiz ?
                  </p>
                  <div className="flex w-full bg-white rounded-2xl shadow-md p-1">
                    <button
                      className={
                        type == "sotish"
                          ? "flex-1/2 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                          : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                      }
                      onClick={() => {
                        setType("sotish");
                      }}
                    >
                      Sotmoqchi
                    </button>
                    <button
                      className={
                        type == "sotib_olish"
                          ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                          : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                      }
                      onClick={() => {
                        setType("sotib_olish");
                      }}
                    >
                      Sotib olmoqchi
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 mb-5">
                <div className="flex gap-3">
                  <p className="text-base font-semibold text-left text-gray-500 m-0 p-0">
                    Savdo summasini kiriting !
                  </p>
                  {savdoSummasi > 0 && (
                    <p className="text-base font-semibold text-left text-gray-500 m-0 p-0">
                      Savdo summasi: {FormatNumber(savdoSummasi)} uzs
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  required
                  minLength="4"
                  value={
                    savdoSummasi >= 1000
                      ? FormatNumber(savdoSummasi)
                      : savdoSummasi
                  }
                  placeholder="Savdo summasini kiriting!"
                  className="flex w-full bg-white rounded-2xl shadow-md p-3.5 text-gray-500 text-base font-semibold outline-0"
                  onInput={(e) => {
                    const filteredValue = e.target.value.replace(/[^0-9]/g, "");
                    setSavdoSummasi(filteredValue.replace(/^0+/, ""));
                  }}
                />
              </div>

              <div className="w-full flex flex-col gap-3 mb-5">
                <p className="text-base font-semibold text-left text-gray-500 m-0 p-0">
                  Savdo uchun komissiya kim tomonidan beriladi ? komissiya 2%
                </p>
                <div className="flex w-full bg-white rounded-2xl shadow-md p-1">
                  <button
                    className={
                      savdoKomissiyasi == "men"
                        ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                        : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                    }
                    onClick={() => {
                      setsavdoKomissiyasi("men");
                    }}
                  >
                    Men tomonimdan
                  </button>
                  <button
                    className={
                      savdoKomissiyasi == "ortada"
                        ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                        : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                    }
                    onClick={() => {
                      setsavdoKomissiyasi("ortada");
                    }}
                  >
                    O'rtada
                  </button>
                  <button
                    className={
                      savdoKomissiyasi == "undan"
                        ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                        : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                    }
                    onClick={() => {
                      setsavdoKomissiyasi("undan");
                    }}
                  >
                    {type == "sotish"
                      ? "Oluvchi tomonidan"
                      : "Sotuvchi tomonidan"}
                  </button>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 mb-5">
                <div className="flex gap-3">
                  <p className="text-base font-semibold text-left text-gray-500 m-0 p-0">
                    Savdo uchun nom bering ! (Maximal belgilar: 25ta)
                  </p>
                </div>

                <input
                  type="text"
                  required
                  minLength="3"
                  maxLength="25"
                  value={savdoName}
                  placeholder="Savdo uchun nom kiriting!"
                  className="flex w-full bg-white rounded-2xl shadow-md p-3.5 text-gray-500 text-base font-semibold outline-0"
                  onInput={(e) => {
                    const value = e.target.value || "";
                    const savdoSS = value.replace(/[\\"'`;]|--|\/*/g, "");
                    setSavdoName(savdoSS);
                  }}
                />
              </div>

              <div className="bg-white w-full mx-auto p-6 rounded-2xl shadow-lg flex mb-5 flex-col gap-4 ">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Savdo yaratish natijasi
                </h2>
                <div className="bg-gray-100 w-full flex flex-col rounded-xl p-4 gap-3 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Savdo nomi:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {savdoName || "Nomalum"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Savdo summasi:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {FormatNumber(savdoSummasi)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Komissiya:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {savdoKomissiyasi === "men"
                        ? "Sizdan"
                        : savdoKomissiyasi === "ortada"
                        ? "Ortada"
                        : type === "sotish"
                        ? "Oluvchi tomonidan"
                        : "Sotuvchi tomonidan"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Komissiya summasi:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {FormatNumber((savdoSummasi / 100) * 2)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      {type === "sotish"
                        ? "Siz qabul qilasiz"
                        : "Siz sarflaysiz"}
                      :
                    </span>
                    <span
                      className={`${
                        type === "sotish" ? `text-green-600` : `text-red-600`
                      } font-bold`}
                    >
                      {FormatNumber(
                        type === "sotish"
                          ? savdoKomissiyasi === "men"
                            ? Number(savdoSummasi) -
                              (Number(savdoSummasi) / 100) * 2
                            : savdoKomissiyasi === "ortada"
                            ? Number(savdoSummasi) -
                              ((Number(savdoSummasi) / 100) * 2) / 2
                            : Number(savdoSummasi)
                          : savdoKomissiyasi === "men"
                          ? Number(savdoSummasi) +
                            (Number(savdoSummasi) / 100) * 2
                          : savdoKomissiyasi === "ortada"
                          ? Number(savdoSummasi) -
                            ((Number(savdoSummasi) / 100) * 2) / 2
                          : Number(savdoSummasi)
                      )}{" "}
                      UZS
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-25 flex gap-4 w-full bg-white rounded-2xl shadow-md p-1">
                <button
                  className={`flex-1/2  p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe] ${
                    Number(savdoSummasi) >= 1000 ? "" : "hidden"
                  }`}
                  onClick={() => {
                    createSavdo();
                  }}
                >
                  Savdoni boshlash
                </button>
                <NavLink to="/savdolar" className="flex-1/2">
                  <button className="w-full p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#fe4f4f] to-[#fea900]">
                    Bekor qilish
                  </button>
                </NavLink>
              </div>
            </div>
          </section>
          {showModal && (
            <div className="w-full h-screen flex bg-black/50 items-center justify-center fixed z-10 top-0 px-3">
              <div className="bg-white w-full mx-auto p-6 rounded-2xl shadow-lg flex mb-5 flex-col gap-4 ">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Savdo yaratish natijasi
                </h2>
                <div className="bg-gray-100 w-full flex flex-col rounded-xl p-4 gap-3 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Savdo nomi:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {savdoName || "Nomalum"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Savdo summasi:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {FormatNumber(savdoSummasi)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Komissiya:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {savdoKomissiyasi === "men"
                        ? "Sizdan"
                        : savdoKomissiyasi === "ortada"
                        ? "Ortada"
                        : type === "sotish"
                        ? "Oluvchi tomonidan"
                        : "Sotuvchi tomonidan"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Komissiya summasi:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {FormatNumber((savdoSummasi / 100) * 2)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      {type === "sotish"
                        ? "Siz qabul qilasiz"
                        : "Siz sarflaysiz"}
                      :
                    </span>
                    <span
                      className={`${
                        type === "sotish" ? `text-green-600` : `text-red-600`
                      } font-bold`}
                    >
                      {FormatNumber(
                        type === "sotish"
                          ? savdoKomissiyasi === "men"
                            ? Number(savdoSummasi) -
                              (Number(savdoSummasi) / 100) * 2
                            : savdoKomissiyasi === "ortada"
                            ? Number(savdoSummasi) -
                              ((Number(savdoSummasi) / 100) * 2) / 2
                            : Number(savdoSummasi)
                          : savdoKomissiyasi === "men"
                          ? Number(savdoSummasi) +
                            (Number(savdoSummasi) / 100) * 2
                          : savdoKomissiyasi === "ortada"
                          ? Number(savdoSummasi) -
                            ((Number(savdoSummasi) / 100) * 2) / 2
                          : Number(savdoSummasi)
                      )}{" "}
                      UZS
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center cursor-pointer mb-3"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://t.me/Trade_Lock_bot/start_app/view?${savdoHavola}`
                      )
                    }
                  >
                    <span className="text-gray-600 font-medium">
                      Savdo Havolasi:
                    </span>
                    <span className="text-gray-800 font-semibold flex items-center gap-3">
                      {savdoHavola} <Copy className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Nima qilishim kerak:
                      </span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Savdo havolasini nusha oling</li>
                      <li>• Savdo qilmoqchi bolgan dostingizga yuboring</li>
                      <li>• Savdoni boshlashini so'rang</li>
                    </ul>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        navigate("/");
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Tushundim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </>
    );
  } else {
    const data = result.data.savdolar;
    let faol = data.filter((item) => item.holat == "faol").length;
    let bekorQilingan = data.filter(
      (item) => item.holat == "bekor qilingan"
    ).length;
    let yakunlangan = data.filter((item) => item.holat == "yakunlangan").length;
    return (
      <>
        <Header title={"savdolar"} />
        <main className="">
          <section>
            <div className="grid grid-cols-3 gap-3.5 my-5 align-elements">
              <div className="bg-white p-3.5 rounded-2xl text-center shadow-md">
                <div className="text-xl font-bold mb-1 text-[#2c3e50]">
                  {faol}
                </div>
                <div className="text-[#7f8c8d] text-xs">Faol</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl text-center shadow-md">
                <div className="text-xl font-bold mb-1 text-[#2c3e50]">
                  {yakunlangan}
                </div>
                <div className="text-[#7f8c8d] text-xs">Yakunlangan</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl text-center shadow-md">
                <div className="text-xl font-bold mb-1 text-[#2c3e50]">
                  {bekorQilingan}
                </div>
                <div className="text-[#7f8c8d] text-xs">Bekor qilingan</div>
              </div>
            </div>

            {/* faol / tarix / hammasi */}
            <div className="align-elements">
              <div className="flex my-5 bg-white rounded-2xl shadow-md p-1">
                <button
                  className={
                    _type == "faol"
                      ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                      : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                  }
                  onClick={() => {
                    _setType("faol");
                  }}
                >
                  Faol
                </button>
                <button
                  className={
                    _type == "tarix"
                      ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                      : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                  }
                  onClick={() => {
                    _setType("tarix");
                  }}
                >
                  Tarix
                </button>
                <button
                  className={
                    _type == "hammasi"
                      ? "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-white bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"
                      : "flex-1/3 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease bg-transparent text-[#7f8c8d]"
                  }
                  onClick={() => {
                    _setType("hammasi");
                  }}
                >
                  Hammasi
                </button>
              </div>
            </div>

            <ul className="trades-container align-elements pb-25">
              <li>
                <NavLink
                  to="/savdolar/new"
                  className="w-full bg-white text-xl text-gray-500 font-semibold flex items-center justify-center cursor-pointer p-3 mb-5 rounded-2xl shadow-md bg-gradient-to-br from-[#04ebd8] to-[#00ff8c]"
                >
                  Yangi savdo ochish
                </NavLink>
              </li>
              {_type == "faol" ? (
                data && data.length > 0 ? (
                  data.map((item) =>
                    item.holat === "faol" ? (
                      item.status === "oluvchi" ? (
                        <Sotuvchi key={item.id} data={item} setView={setView} />
                      ) : (
                        <Oluvchi key={item.id} data={item} setView={setView} />
                      )
                    ) : (
                      ""
                    )
                  )
                ) : (
                  <li className="text-2xl text-black trades-container:h-dvh">
                    hech narsa yo'q
                  </li>
                )
              ) : (
                ""
              )}

              {_type == "tarix" ? (
                data && data.length > 0 ? (
                  data.map((item) =>
                    item.holat == "bekor qilingan" ||
                    item.holat == "yakunlangan" ? (
                      item.status === "oluvchi" ? (
                        <Sotuvchi key={item.id} data={item} setView={setView} />
                      ) : (
                        <Oluvchi key={item.id} data={item} setView={setView} />
                      )
                    ) : (
                      ""
                    )
                  )
                ) : (
                  <li className="text-2xl text-black trades-container:h-dvh">
                    hech narsa yo'q
                  </li>
                )
              ) : (
                ""
              )}

              {_type == "hammasi" ? (
                data && data.length > 0 ? (
                  data.map((item) =>
                    item.status === "oluvchi" ? (
                      <Sotuvchi key={item.id} data={item} setView={setView} />
                    ) : (
                      <Oluvchi key={item.id} data={item} setView={setView} />
                    )
                  )
                ) : (
                  <li className="text-2xl text-black trades-container:h-dvh">
                    hech narsa yo'q
                  </li>
                )
              ) : (
                ""
              )}
            </ul>
          </section>
        </main>
      </>
    );
  }
};
