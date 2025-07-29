// src/utils/apiMock.js - Mock API data for development
export const mockUserData = {
  id: 12345,
  telegram_id: "123456789",
  username: "test_user",
  first_name: "Test",
  last_name: "User",
  email: "test@example.com",
  phone: "+998901234567",
  balance: 1250000,
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-12-20T15:45:00Z",
  settings: {
    balance_hide: false,
    theme: "light",
    language: "uz",
    push_notifications: true,
    email_notifications: false,
    sms_notifications: false,
    two_factor_enabled: false,
    privacy_mode: false
  },
  stats: {
    total_trades: 45,
    active_trades: 3,
    completed_trades: 40,
    cancelled_trades: 2,
    success_rate: 95.5,
    total_volume: 15750000,
    commission_paid: 315000,
    commission_earned: 278000
  },
  verification: {
    email_verified: true,
    phone_verified: true,
    identity_verified: false,
    level: 1
  }
};

export const mockTradesData = [
  {
    id: 1001,
    creator_id: 12345,
    participant_id: 67890,
    trade_type: "sell",
    trade_name: "iPhone 15 Pro Max 256GB",
    amount: 18500000,
    commission_type: "creator",
    commission_amount: 370000,
    status: "active",
    creator_confirmed: false,
    participant_confirmed: false,
    secret_link: "abc123def456",
    share_url: "https://t.me/Trade_Lock_bot?start=trade_abc123def456",
    creator_name: "Test User",
    creator_username: "test_user",
    participant_name: null,
    participant_username: null,
    created_at: "2024-12-20T10:30:00Z",
    updated_at: "2024-12-20T10:30:00Z",
    expires_at: "2024-12-27T10:30:00Z"
  },
  {
    id: 1002,
    creator_id: 67890,
    participant_id: 12345,
    trade_type: "buy",
    trade_name: "MacBook Air M2",
    amount: 22000000,
    commission_type: "split",
    commission_amount: 440000,
    status: "in_progress",
    creator_confirmed: true,
    participant_confirmed: false,
    secret_link: "xyz789abc123",
    share_url: null,
    creator_name: "Seller User",
    creator_username: "seller_user",
    participant_name: "Test User",
    participant_username: "test_user",
    created_at: "2024-12-19T14:20:00Z",
    updated_at: "2024-12-20T09:15:00Z",
    expires_at: "2024-12-26T14:20:00Z"
  },
  {
    id: 1003,
    creator_id: 12345,
    participant_id: 11111,
    trade_type: "sell",
    trade_name: "Samsung Galaxy S24 Ultra",
    amount: 16800000,
    commission_type: "participant",
    commission_amount: 336000,
    status: "completed",
    creator_confirmed: true,
    participant_confirmed: true,
    secret_link: "completed123",
    share_url: null,
    creator_name: "Test User",
    creator_username: "test_user",
    participant_name: "Buyer User",
    participant_username: "buyer_user",
    created_at: "2024-12-18T11:00:00Z",
    updated_at: "2024-12-18T16:30:00Z",
    completed_at: "2024-12-18T16:30:00Z",
    expires_at: "2024-12-25T11:00:00Z"
  },
  {
    id: 1004,
    creator_id: 22222,
    participant_id: 12345,
    trade_type: "buy",
    trade_name: "PlayStation 5",
    amount: 9500000,
    commission_type: "creator",
    commission_amount: 190000,
    status: "cancelled",
    creator_confirmed: false,
    participant_confirmed: false,
    secret_link: "cancelled456",
    share_url: null,
    creator_name: "Console Seller",
    creator_username: "console_seller",
    participant_name: "Test User",
    participant_username: "test_user",
    created_at: "2024-12-17T09:45:00Z",
    updated_at: "2024-12-17T12:20:00Z",
    cancelled_at: "2024-12-17T12:20:00Z",
    cancel_reason: "Changed mind"
  }
];

export const mockPaymentsData = [
  {
    id: 2001,
    user_id: 12345,
    type: "deposit",
    amount: 500000,
    status: "completed",
    payment_method: "humo",
    card_number: "9860****1234",
    reference: "DEP001",
    description: "Hisob to'ldirish",
    created_at: "2024-12-20T08:30:00Z",
    completed_at: "2024-12-20T08:35:00Z"
  },
  {
    id: 2002,
    user_id: 12345,
    type: "trade_earn",
    amount: 336000,
    status: "completed",
    trade_id: 1003,
    reference: "TRADE1003",
    description: "Savdo #1003 dan daromad",
    created_at: "2024-12-18T16:30:00Z",
    completed_at: "2024-12-18T16:30:00Z"
  },
  {
    id: 2003,
    user_id: 12345,
    type: "commission",
    amount: 220000,
    status: "completed",
    trade_id: 1002,
    reference: "COM1002",
    description: "Savdo #1002 komissiyasi",
    created_at: "2024-12-19T14:20:00Z",
    completed_at: "2024-12-19T14:20:00Z"
  },
  {
    id: 2004,
    user_id: 12345,
    type: "withdraw",
    amount: 750000,
    status: "pending",
    payment_method: "uzcard",
    card_number: "8600****5678",
    reference: "WTH004",
    description: "Mablag' chiqarish",
    created_at: "2024-12-20T15:00:00Z"
  },
  {
    id: 2005,
    user_id: 12345,
    type: "transfer",
    amount: 100000,
    status: "completed",
    recipient: "@friend_user",
    reference: "TRF005",
    description: "Do'stga o'tkazma",
    created_at: "2024-12-19T20:15:00Z",
    completed_at: "2024-12-19T20:16:00Z"
  }
];

export const mockNotificationsData = [
  {
    id: 3001,
    user_id: 12345,
    type: "trade_update",
    title: "Savdo yangilandi",
    message: "Savdo #1002 uchun ishtirokchi tasdiqlash kutilmoqda",
    data: {
      trade_id: 1002
    },
    read: false,
    created_at: "2024-12-20T15:30:00Z"
  },
  {
    id: 3002,
    user_id: 12345,
    type: "payment_completed",
    title: "To'lov yakunlandi",
    message: "Hisob to'ldirish muvaffaqiyatli amalga oshirildi",
    data: {
      payment_id: 2001,
      amount: 500000
    },
    read: true,
    created_at: "2024-12-20T08:35:00Z"
  }
];

// Mock API functions
export const mockApiCall = (endpoint, options = {}) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        const result = handleMockRequest(endpoint, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 1000 + 500); // 500-1500ms delay
  });
};

const handleMockRequest = (endpoint, options) => {
  const { method = 'GET', body } = options;
  const [baseEndpoint, ...pathParts] = endpoint.split('/');

  switch (baseEndpoint) {
    case 'auth':
      if (method === 'POST') {
        return {
          success: true,
          token: 'mock_jwt_token_' + Date.now(),
          user: mockUserData
        };
      }
      break;

    case 'user':
      if (method === 'GET') {
        return mockUserData;
      } else if (method === 'PUT') {
        const updates = JSON.parse(body);
        return { ...mockUserData, ...updates };
      }
      break;

    case 'trade':
      if (method === 'GET') {
        const status = new URLSearchParams(endpoint.split('?')[1]).get('status');
        if (status === 'all') {
          return mockTradesData;
        }
        return mockTradesData.filter(trade => {
          if (status === 'active') return ['active', 'in_progress'].includes(trade.status);
          if (status === 'completed') return trade.status === 'completed';
          if (status === 'cancelled') return trade.status === 'cancelled';
          return true;
        });
      } else if (method === 'POST') {
        const tradeData = JSON.parse(body);
        const newTrade = {
          id: Date.now(),
          creator_id: mockUserData.id,
          participant_id: null,
          ...tradeData,
          status: 'active',
          creator_confirmed: false,
          participant_confirmed: false,
          secret_link: generateSecretLink(),
          creator_name: mockUserData.first_name + ' ' + mockUserData.last_name,
          creator_username: mockUserData.username,
          participant_name: null,
          participant_username: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        newTrade.share_url = `https://t.me/Trade_Lock_bot?start=trade_${newTrade.secret_link}`;
        return newTrade;
      } else if (method === 'PUT' && pathParts.length > 0) {
        const tradeId = parseInt(pathParts[0]);
        const actionData = JSON.parse(body);
        
        const trade = mockTradesData.find(t => t.id === tradeId);
        if (!trade) {
          throw new Error('Savdo topilmadi');
        }
        
        if (actionData.action === 'confirm') {
          if (trade.creator_id === mockUserData.id) {
            trade.creator_confirmed = true;
          } else {
            trade.participant_confirmed = true;
          }
          
          if (trade.creator_confirmed && trade.participant_confirmed) {
            trade.status = 'completed';
            trade.completed_at = new Date().toISOString();
          }
        } else if (actionData.action === 'cancel') {
          trade.status = 'cancelled';
          trade.cancelled_at = new Date().toISOString();
        }
        
        trade.updated_at = new Date().toISOString();
        return trade;
      }
      break;

    case 'payment':
      if (method === 'GET') {
        return mockPaymentsData.filter(payment => payment.user_id === mockUserData.id);
      } else if (method === 'POST') {
        const paymentData = JSON.parse(body);
        const newPayment = {
          id: Date.now(),
          user_id: mockUserData.id,
          ...paymentData,
          status: 'pending',
          reference: generateReference(paymentData.type),
          created_at: new Date().toISOString()
        };
        
        // Simulate immediate completion for deposits
        if (paymentData.type === 'deposit') {
          setTimeout(() => {
            newPayment.status = 'completed';
            newPayment.completed_at = new Date().toISOString();
          }, 2000);
        }
        
        return newPayment;
      }
      break;

    case 'notifications':
      if (method === 'GET') {
        return mockNotificationsData.filter(notif => notif.user_id === mockUserData.id);
      }
      break;

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }

  throw new Error(`Method ${method} not supported for ${endpoint}`);
};

// Helper functions
const generateSecretLink = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const generateReference = (type) => {
  const prefixes = {
    deposit: 'DEP',
    withdraw: 'WTH',
    transfer: 'TRF',
    commission: 'COM',
    trade_earn: 'TRADE',
    trade_pay: 'TRADE'
  };
  
  const prefix = prefixes[type] || 'TXN';
  const number = String(Date.now()).slice(-6);
  return `${prefix}${number}`;
};