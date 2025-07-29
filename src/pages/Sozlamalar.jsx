import React from "react";
import { Header } from "../components/Header";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";

export const Sozlamalar = () => {
  const { result, dispatch } = useMainGlobalContext();
  return (
    <>
      <Header title={"sozlamalar"} />
      {/* <!-- Profile Card --> */}
      <div className="py-4 align-elements">
        <div className="profile-card rounded-2xl p-6 text-black card-hover relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              {result.user.userImage ? (
                <img src={result.user.userImage} alt={result.user.userName} />
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              )}
            </div>
            <div className="flex-1 text-black">
              <h2 className="text-xl font-bold">Sayfuddinov Muhriddin</h2>
              <p className="text-sm opacity-80">@Sayfuddinov_M</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm opacity-80">Tasdiqlangan</span>
              </div>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 px-4 py-2 rounded-xl text-sm cursor-pointer">
              Tahrirlash
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Settings Content --> */}
      <div className="px-5 pb-20 align-elements">
        {/* <!-- Account Settings --> */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Hisob sozlamalari
          </h3>
          <div className="space-y-3">
            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Shaxsiy ma'lumotlar
                    </div>
                    <div className="text-sm text-gray-500">
                      Ism, telefon, email
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Xavfsizlik
                    </div>
                    <div className="text-sm text-gray-500">Parol, 2FA, PIN</div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      To'lov usullari
                    </div>
                    <div className="text-sm text-gray-500">
                      Kartalar, bank hisoblari
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Notifications --> */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Bildirishnomalar
          </h3>
          <div className="space-y-3">
            <div className="setting-item rounded-xl p-4 shadow-sm">
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
                        d="M15 17h5l-5 5v-5z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 15v-3a4 4 0 014-4h9"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Push bildirishnomalar
                    </div>
                    <div className="text-sm text-gray-500">
                      Yangi savdolar, xabarlar
                    </div>
                  </div>
                </div>

                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    result.user.setting.notification.app
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "NOTIFICATION",
                      payload: {
                        app: result.user.setting.notification.app
                          ? false
                          : true,
                      },
                    });
                  }}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                      result.user.setting.notification.app
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm">
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Email bildirishnomalar
                    </div>
                    <div className="text-sm text-gray-500">
                      Haftalik hisobotlar
                    </div>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    result.user.setting.notification.email
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "NOTIFICATION",
                      payload: {
                        email: result.user.setting.notification.email
                          ? false
                          : true,
                      },
                    });
                  }}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                      result.user.setting.notification.email
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm">
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
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      SMS bildirishnomalar
                    </div>
                    <div className="text-sm text-gray-500">
                      Muhim xavfsizlik xabarlari
                    </div>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    result.user.setting.notification.sms
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "NOTIFICATION",
                      payload: {
                        sms: result.user.setting.notification.sms
                          ? false
                          : true,
                      },
                    });
                  }}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                      result.user.setting.notification.sms
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- General Settings --> */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Umumiy sozlamalar
          </h3>
          <div className="space-y-3">
            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Til</div>
                    <div className="text-sm text-gray-500">O'zbek tili</div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm">
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
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Tungi rejim
                    </div>
                    <div className="text-sm text-gray-500">Avto rejimda</div>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    result.user.setting.theme ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "THEME",
                      payload: result.user.setting.theme ? false : true,
                    });
                  }}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                      result.user.setting.theme
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Do'stlarni taklif qilish
                    </div>
                    <div className="text-sm text-gray-500">Bonus oling</div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Support --> */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Yordam va qo'llab-quvvatlash
          </h3>
          <div className="space-y-3">
            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Yordam markazi
                    </div>
                    <div className="text-sm text-gray-500">
                      FAQ, qo'llanmalar
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Qo'llab-quvvatlash
                    </div>
                    <div className="text-sm text-gray-500">
                      24/7 chat yordam
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="setting-item rounded-xl p-4 shadow-sm card-hover cursor-pointer">
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Chiqish</div>
                    <div className="text-sm text-gray-500">
                      Hisobdan chiqish
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};
