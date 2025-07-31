// src/pages/admin/AdminTrades.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import api from "../../services/api";
import { FormatNumber } from "../../components/FormatNumber";
import { showToast } from "../../utils/toast";

export const AdminTrades = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showActions, setShowActions] = useState({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminTrades", currentPage, statusFilter],
    queryFn: () => api.getAdminTrades(currentPage, 20, statusFilter),
  });

  const updateTradeStatusMutation = useMutation({
    mutationFn: ({ tradeId, status }) => api.updateTradeStatus(tradeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminTrades"]);
      showToast.success("Savdo holati yangilandi");
      setShowTradeModal(false);
    },
    onError: () => {
      showToast.error("Xatolik yuz berdi");
    },
  });

  const filteredTrades = data?.trades?.filter((trade) => {
    const search = searchQuery.toLowerCase();
    return (
      trade.secret_code?.toLowerCase().includes(search) ||
      trade.creator_name?.toLowerCase().includes(search) ||
      trade.partner_name?.toLowerCase().includes(search) ||
      trade.id?.toString().includes(search)
    );
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Faol";
      case "completed":
        return "Yakunlangan";
      case "cancelled":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  const viewTradeDetails = (trade) => {
    setSelectedTrade(trade);
    setShowTradeModal(true);
  };

  const handleStatusUpdate = (status) => {
    if (selectedTrade) {
      updateTradeStatusMutation.mutate({
        tradeId: selectedTrade.id,
        status: status,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savdolar</h1>
          <p className="text-gray-600">Barcha savdolarni boshqarish</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="completed">Yakunlangan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Kod, ID yoki foydalanuvchi bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ishtirokchilar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miqdor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komissiya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Amallar</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredTrades?.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Savdolar topilmadi
                  </td>
                </tr>
              ) : (
                filteredTrades?.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{trade.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {trade.secret_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Yaratuvchi: {trade.creator_name}</div>
                        <div className="text-gray-500">
                          Hamkor: {trade.partner_name || "Kutilmoqda..."}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {FormatNumber(trade.amount)} UZS
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {FormatNumber(trade.commission_amount || 0)} UZS
                      </div>
                      <div className="text-xs text-gray-500">
                        {trade.commission_rate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trade.status)}
                        <span
                          className={`text-sm font-medium ${
                            trade.status === "active"
                              ? "text-blue-600"
                              : trade.status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {getStatusText(trade.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(trade.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs">
                        {new Date(trade.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActions({
                              ...showActions,
                              [trade.id]: !showActions[trade.id],
                            })
                          }
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {showActions[trade.id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  viewTradeDetails(trade);
                                  setShowActions({});
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              >
                                <Eye size={16} />
                                Batafsil ko'rish
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Oldingi
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === data?.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Keyingi
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Jami{" "}
                <span className="font-medium">{data?.totalTrades || 0}</span>{" "}
                savdo
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Oldingi
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {currentPage} / {data?.totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === data?.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Keyingi
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Details Modal */}
      {showTradeModal && selectedTrade && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Savdo ma'lumotlari
                </h3>
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Savdo ID</p>
                    <p className="text-base font-medium">#{selectedTrade.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maxfiy kod</p>
                    <p className="text-base font-medium">
                      {selectedTrade.secret_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Miqdor</p>
                    <p className="text-base font-medium">
                      {FormatNumber(selectedTrade.amount)} UZS
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Komissiya</p>
                    <p className="text-base font-medium">
                      {FormatNumber(selectedTrade.commission_amount || 0)} UZS (
                      {selectedTrade.commission_rate}%)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Yaratuvchi</p>
                    <p className="text-base font-medium">
                      {selectedTrade.creator_name} (ID:{" "}
                      {selectedTrade.creator_id})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hamkor</p>
                    <p className="text-base font-medium">
                      {selectedTrade.partner_name || "Kutilmoqda"}
                      {selectedTrade.partner_id &&
                        ` (ID: ${selectedTrade.partner_id})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Holat</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedTrade.status)}
                      <span
                        className={`text-base font-medium ${
                          selectedTrade.status === "active"
                            ? "text-blue-600"
                            : selectedTrade.status === "completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getStatusText(selectedTrade.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Yaratilgan sana</p>
                    <p className="text-base font-medium">
                      {new Date(selectedTrade.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedTrade.status === "active" && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="font-medium text-yellow-800">
                      Savdo holatini o'zgartirish
                    </p>
                  </div>
                  <p className="text-sm text-yellow-700 mb-4">
                    Diqqat! Savdo holatini o'zgartirishdan oldin barcha
                    ma'lumotlarni tekshiring.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate("completed")}
                      disabled={updateTradeStatusMutation.isPending}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Yakunlash
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("cancelled")}
                      disabled={updateTradeStatusMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
