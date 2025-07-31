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
} from "lucide-react";
import api from "../../services/api";
import { FormatNumber } from "../../components/FormatNumber";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tizim statistikasi va tahlil</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daromad statistikasi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="commission"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Savdo holatlari
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            So'nggi savdolar
          </h3>
          <div className="space-y-3">
            {stats?.recentTrades?.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
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
                      {trade.creator_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {FormatNumber(trade.amount)} UZS
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(trade.created_at).toLocaleTimeString()}
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
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yangi foydalanuvchilar
          </h3>
          <div className="space-y-3">
            {stats?.recentUsers?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
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
                    {new Date(user.created_at).toLocaleDateString()}
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
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tizim holati
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Server holati</p>
              <p className="font-medium text-gray-900">Ishlayapti</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Oxirgi yangilanish</p>
              <p className="font-medium text-gray-900">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Komissiya stavkasi</p>
              <p className="font-medium text-gray-900">
                {stats?.commissionRate || 2}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
