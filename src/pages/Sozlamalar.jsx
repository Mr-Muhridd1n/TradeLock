// src/pages/Sozlamalar.jsx
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  hapticFeedback,
  showConfirm,
  openExternalLink,
} from "../utils/telegram";
import {
  Eye,
  EyeOff,
  Moon,
  Sun,
  Bell,
  BellOff,
  Shield,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
  User,
  Mail,
  Phone,
  Save,
  Edit,
  X,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

export const Sozlamalar = () => {
  const { user, handleError, showSuccess } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user.user?.first_name || "",
    last_name: user.user?.last_name || "",
    email: user.user?.email || "",
    phone: user.user?.phone || "",
  });

  const settings = user.user?.settings || {};

  const handleToggleSetting = async (key, value) => {
    try {
      await user.updateSettings({ [key]: value });
      hapticFeedback("light");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await user.updateProfile(profileData);
      setIsEditing(false);
      showSuccess("Profil muvaffaqiyatli yangilandi");
      hapticFeedback("success");
    } catch (error) {
      handleError(error);
      hapticFeedback("error");
    }
  };

  const handleLogout = () => {
    showConfirm("Hisobdan chiqishni xohlaysizmi?", (confirmed) => {
      if (confirmed) {
        localStorage.clear();
        window.location.reload();
        hapticFeedback("medium");
      }
    });
  };

  if (!user.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white">
        <div className="flex flex-col text-center py-6">
          <h1 className="text-2xl font-bold">Sozlamalar</h1>
          <p className="opacity-90">Sizning maxfiy sozlamalaringiz</p>
        </div>
      </div>

      <main className="bg-[#f8f9fa] min-h-screen">
        <section className="max-w-7xl px-4 mx-auto py-5 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Profil Ma'lumotlari
                    </h2>
                    <p className="text-blue-700 text-sm">
                      Shaxsiy ma'lumotlaringiz
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-blue-200 rounded-full transition-colors"
                >
                  {isEditing ? (
                    <X className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Edit className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ism
                      </label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            first_name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ismingiz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Familiya
                      </label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            last_name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Familiyangiz"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+998901234567"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Saqlash</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">
                        {user.user.first_name} {user.user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{user.user.username || "username"}
                      </p>
                    </div>
                  </div>
                  {user.user.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <p className="text-gray-700">{user.user.email}</p>
                    </div>
                  )}
                  {user.user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <p className="text-gray-700">{user.user.phone}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-l-4 border-purple-500">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Maxfiylik</h2>
                  <p className="text-purple-700 text-sm">
                    Xavfsizlik sozlamalari
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.balance_hide ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      Balansni yashirish
                    </p>
                    <p className="text-sm text-gray-500">
                      Balans raqamlarini yashirish
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleSetting("balance_hide", !settings.balance_hide)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.balance_hide ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.balance_hide ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.theme === "dark" ? (
                    <Moon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      Qorong'u rejim
                    </p>
                    <p className="text-sm text-gray-500">
                      Interfeys rangini o'zgartirish
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleSetting(
                      "theme",
                      settings.theme === "dark" ? "light" : "dark"
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.theme === "dark" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.theme === "dark"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-l-4 border-green-500">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Bildirishnomalar
                  </h2>
                  <p className="text-green-700 text-sm">
                    Xabar olish sozlamalari
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Push bildirishnomalar
                    </p>
                    <p className="text-sm text-gray-500">
                      Muhim xabarlar uchun
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleSetting(
                      "push_notifications",
                      !settings.push_notifications
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.push_notifications !== false
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.push_notifications !== false
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Email bildirishnomalar
                    </p>
                    <p className="text-sm text-gray-500">
                      Savdo va to'lov uchun
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleSetting(
                      "email_notifications",
                      !settings.email_notifications
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.email_notifications ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email_notifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-l-4 border-red-500">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Xavfsizlik
                  </h2>
                  <p className="text-red-700 text-sm">
                    Hisobingizni himoya qiling
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => hapticFeedback("light")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      Parolni o'zgartirish
                    </p>
                    <p className="text-sm text-gray-500">
                      Yangi parol o'rnatish
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => hapticFeedback("light")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      Karta ma'lumotlari
                    </p>
                    <p className="text-sm text-gray-500">Saqlangan kartalar</p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-l-4 border-orange-500">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Yordam</h2>
                  <p className="text-orange-700 text-sm">
                    Qo'llab-quvvatlash xizmati
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => {
                  openExternalLink("https://t.me/TradeLock_support");
                  hapticFeedback("light");
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      Yordam markazi
                    </p>
                    <p className="text-sm text-gray-500">
                      24/7 qo'llab-quvvatlash
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => {
                  openExternalLink("https://t.me/TradeLock_news");
                  hapticFeedback("light");
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      Yangiliklar kanali
                    </p>
                    <p className="text-sm text-gray-500">
                      So'nggi yangiliklarni bilib oling
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="pb-20">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Hisobdan chiqish</span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
};
