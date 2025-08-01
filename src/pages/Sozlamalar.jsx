// src/pages/Sozlamalar.jsx
import React, { useState } from "react";
import { Header } from "../components/Header";
import { useApi } from "../context/ApiContext";
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Palette,
  Globe,
  Share,
  MessageCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle,
  Phone,
  Mail,
  Edit,
  Key,
  HelpCircle,
  Info,
} from "lucide-react";

export const Sozlamalar = () => {
  const { user, logout } = useApi();
  const [notifications, setNotifications] = useState({
    app: true,
    email: false,
    sms: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Rostdan ham tizimdan chiqmoqchimisiz?")) {
      logout();
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <div
      className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
        enabled ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={onChange}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );

  const SettingCard = ({
    icon: Icon,
    title,
    description,
    action,
    color = "blue",
  }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div>
            <div className="font-semibold text-gray-800">{title}</div>
            <div className="text-sm text-gray-500">{description}</div>
          </div>
        </div>
        {action || <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );

  return (
    <>
      <Header title="sozlamalar" />
      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                {user?.first_name} {user?.last_name || ""}
              </h2>
              <p className="text-sm text-gray-600">
                @{user?.username || "username"}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">
                  Tasdiqlangan hisob
                </span>
              </div>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Tahrirlash
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-2">
            Hisob sozlamalari
          </h3>

          <SettingCard
            icon={User}
            title="Shaxsiy ma'lumotlar"
            description="Ism, telefon, email"
            color="blue"
          />

          <SettingCard
            icon={Shield}
            title="Xavfsizlik"
            description="Parol, 2FA, PIN kod"
            color="green"
          />

          <SettingCard
            icon={CreditCard}
            title="To'lov usullari"
            description="Kartalar, bank hisoblari"
            color="purple"
          />

          <SettingCard
            icon={Key}
            title="API kalitlari"
            description="Dasturlash uchun kalitlar"
            color="orange"
          />
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-2">
            Bildirishnomalar
          </h3>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
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
              <ToggleSwitch
                enabled={notifications.app}
                onChange={() => handleNotificationChange("app")}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
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
              <ToggleSwitch
                enabled={notifications.email}
                onChange={() => handleNotificationChange("email")}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-orange-600" />
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
              <ToggleSwitch
                enabled={notifications.sms}
                onChange={() => handleNotificationChange("sms")}
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-2">
            Umumiy sozlamalar
          </h3>

          <SettingCard
            icon={Globe}
            title="Til"
            description="O'zbek tili"
            color="green"
          />

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Tungi rejim</div>
                  <div className="text-sm text-gray-500">Qorong'u tema</div>
                </div>
              </div>
              <ToggleSwitch
                enabled={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {balanceHidden ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    Balansni yashirish
                  </div>
                  <div className="text-sm text-gray-500">
                    Balans raqamlarini yashirish
                  </div>
                </div>
              </div>
              <ToggleSwitch
                enabled={balanceHidden}
                onChange={() => setBalanceHidden(!balanceHidden)}
              />
            </div>
          </div>

          <SettingCard
            icon={Share}
            title="Do'stlarni taklif qilish"
            description="Bonus oling va ulashing"
            color="pink"
          />
        </div>

        {/* Privacy & Security */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-2">
            Maxfiylik va xavfsizlik
          </h3>

          <SettingCard
            icon={Shield}
            title="Maxfiylik sozlamalari"
            description="Ma'lumotlar va maxfiylik"
            color="red"
          />

          <SettingCard
            icon={Key}
            title="Faoliyat tarixi"
            description="Kirish va faoliyat jurnali"
            color="yellow"
          />

          <SettingCard
            icon={SettingsIcon}
            title="Hisobni boshqarish"
            description="Hisobni o'chirish, eksport"
            color="gray"
          />
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-2">
            Yordam va qo'llab-quvvatlash
          </h3>

          <SettingCard
            icon={HelpCircle}
            title="Yordam markazi"
            description="FAQ, qo'llanmalar"
            color="blue"
          />

          <SettingCard
            icon={MessageCircle}
            title="Qo'llab-quvvatlash"
            description="24/7 chat yordam"
            color="green"
          />

          <SettingCard
            icon={Info}
            title="Ilova haqida"
            description="Versiya, litsenziya"
            color="purple"
          />
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div className="font-semibold text-red-600">Hisobdan chiqish</div>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">TradeLock v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">
            © 2025 TradeLock. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </>
  );
};
