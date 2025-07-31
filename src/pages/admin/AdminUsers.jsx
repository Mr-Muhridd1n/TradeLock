// src/pages/admin/AdminUsers.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-react";
import api from "../../services/api";
import { FormatNumber } from "../../components/FormatNumber";
import { showToast } from "../../utils/toast";

export const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActions, setShowActions] = useState({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", currentPage],
    queryFn: () => api.getAdminUsers(currentPage),
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }) =>
      api.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      showToast.success("Foydalanuvchi holati yangilandi");
    },
    onError: () => {
      showToast.error("Xatolik yuz berdi");
    },
  });

  const filteredUsers = data?.users?.filter((user) => {
    const search = searchQuery.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(search) ||
      user.last_name?.toLowerCase().includes(search) ||
      user.username?.toLowerCase().includes(search) ||
      user.telegram_id?.toString().includes(search)
    );
  });

  const toggleUserStatus = (user) => {
    updateUserStatusMutation.mutate({
      userId: user.id,
      isActive: !user.is_active,
    });
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p className="text-gray-600">Barcha foydalanuvchilarni boshqarish</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter size={20} />
            <span>Filter</span>
          </button>
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
            placeholder="Ism, username yoki ID bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Savdolar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ro'yxatdan o'tgan
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
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.first_name?.charAt(0) || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name || ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username || "noname"} • ID:{" "}
                            {user.telegram_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.phone_number || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {FormatNumber(user.balance || 0)} UZS
                      </div>
                      <div className="text-sm text-gray-500">
                        Muzlatilgan: {FormatNumber(user.frozen_balance || 0)}{" "}
                        UZS
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Jami: {user.total_trades || 0}</div>
                      <div className="text-gray-500">
                        Faol: {user.active_trades || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActions({
                              ...showActions,
                              [user.id]: !showActions[user.id],
                            })
                          }
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {showActions[user.id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => viewUserDetails(user)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              >
                                <Eye size={16} />
                                Ko'rish
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              >
                                {user.is_active ? (
                                  <ShieldOff size={16} />
                                ) : (
                                  <Shield size={16} />
                                )}
                                {user.is_active ? "Bloklash" : "Faollashtirish"}
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
                <span className="font-medium">{data?.totalUsers || 0}</span>{" "}
                foydalanuvchi
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Foydalanuvchi ma'lumotlari
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">To'liq ismi</p>
                  <p className="text-base font-medium">
                    {selectedUser.first_name} {selectedUser.last_name || ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-base font-medium">
                    @{selectedUser.username || "noname"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telegram ID</p>
                  <p className="text-base font-medium">
                    {selectedUser.telegram_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="text-base font-medium">
                    {selectedUser.phone_number || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balans</p>
                  <p className="text-base font-medium">
                    {FormatNumber(selectedUser.balance || 0)} UZS
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Ro'yxatdan o'tgan sana
                  </p>
                  <p className="text-base font-medium">
                    {new Date(selectedUser.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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
