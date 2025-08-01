// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
} from "lucide-react";
import api from "../../services/api";
import { FormatNumber } from "../../components/FormatNumber";

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.getAdminStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Jami foydalanuvchilar",
      value: stats?.totalUsers || 0,
      change: stats?.userGrowth || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: "Faol savdolar",
      value: stats?.activeTrades || 0,
      change: stats?.tradeGrowth || 0,
      icon: ShoppingBag,
      color: "green",
    },
    {
      title: "Umumiy aylanma",
      value: FormatNumber(stats?.totalVolume || 0),
      suffix: " UZS",
      change: stats?.volumeGrowth || 0,
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Komissiya daromadi",
      value: FormatNumber(stats?.totalCommission || 0),
      suffix: " UZS",
      change: stats?.commissionGrowth || 0,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const pieChartData = [
    {
      name: "Yakunlangan",
      value: stats?.completedTrades || 0,
      color: "#10B981",
    },
    { name: "Faol", value: stats?.activeTrades || 0, color: "#3B82F6" },
    {
      name: "Bekor qilingan",
      value: stats?.cancelledTrades || 0,
      color: "#EF4444",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tizim statistikasi va tahlil</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stat.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change >= 0 ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.suffix}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Savdo holatlari
          </h3>
          <div className="space-y-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                  <div className="text-xs text-gray-500">
                    {stats?.activeTrades +
                      stats?.completedTrades +
                      stats?.cancelledTrades >
                    0
                      ? Math.round(
                          (item.value /
                            (stats.activeTrades +
                              stats.completedTrades +
                              stats.cancelledTrades)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tezkor statistika
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Muvaffaqiyat ko'rsatkichi
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.completedTrades &&
                stats?.completedTrades + stats?.cancelledTrades > 0
                  ? Math.round(
                      (stats.completedTrades /
                        (stats.completedTrades + stats.cancelledTrades)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">O'rtacha savdo</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.totalVolume &&
                stats?.completedTrades + stats?.activeTrades > 0
                  ? FormatNumber(
                      Math.round(
                        stats.totalVolume /
                          (stats.completedTrades + stats.activeTrades)
                      )
                    )
                  : 0}{" "}
                UZS
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Percent className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Komissiya stavkasi
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.commissionRate || 2}%
              </span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tizim holati
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Server</span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                Ishlayapti
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Database</span>
              </div>
              <span className="text-sm font-semibold text-green-600">Faol</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Monitoring</span>
              </div>
              <span className="text-sm font-semibold text-yellow-600">
                Kuzatuvda
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Oxirgi yangilanish
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleTimeString("uz-UZ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              So'nggi savdolar
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Barchasini ko'rish
            </button>
          </div>
          <div className="space-y-4">
            {stats?.recentTrades?.slice(0, 5).map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trade.status === "active"
                        ? "bg-blue-100"
                        : trade.status === "completed"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {trade.status === "active" ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : trade.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {trade.creator_name || "Noma'lum"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {FormatNumber(trade.amount)} UZS
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(trade.created_at).toLocaleTimeString("uz-UZ")}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      trade.status === "active"
                        ? "text-blue-600"
                        : trade.status === "completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trade.status === "active"
                      ? "Faol"
                      : trade.status === "completed"
                      ? "Yakunlangan"
                      : "Bekor qilingan"}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Hozircha savdolar yo'q</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Yangi foydalanuvchilar
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Barchasini ko'rish
            </button>
          </div>
          <div className="space-y-4">
            {stats?.recentUsers?.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.first_name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.first_name} {user.last_name || ""}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{user.username || "noname"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString("uz-UZ")}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      user.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.is_active ? "Faol" : "Nofaol"}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Hozircha foydalanuvchilar yo'q</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Ishlash ko'rsatkichlari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">99.9%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalUsers || 0}
            </p>
            <p className="text-sm text-gray-600">Faol foydalanuvchilar</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {FormatNumber(stats?.totalVolume || 0)}
            </p>
            <p className="text-sm text-gray-600">UZS aylanma</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.3s</p>
            <p className="text-sm text-gray-600">O'rtacha javob vaqti</p>
          </div>
        </div>
      </div>
    </div>
  );
};
