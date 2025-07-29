import { createContext, useEffect, useReducer } from "react";

export const GlobalContext = createContext();

const initalState = {
  result: {
    balance: 100000000,
    user: {
      userId: "",
      userImage: "",
      userName: "",
      email: "",
      phone: "",
      payments: {
        bank: [
          {
            id: 1,
            name: "Humo",
            img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=120&fit=crop&crop=center",
            color: "from-blue-500 to-blue-600",
            popular: true,
          },
          {
            id: 2,
            name: "Uzcard",
            img: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=200&h=120&fit=crop&crop=center",
            color: "from-green-500 to-green-600",
            popular: false,
          },
          {
            id: 3,
            name: "Visa",
            img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=200&h=120&fit=crop&crop=center",
            color: "from-purple-500 to-purple-600",
            popular: false,
          },
          {
            id: 4,
            name: "Mastercard",
            img: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=200&h=120&fit=crop&crop=center",
            color: "from-red-500 to-red-600",
            popular: false,
          },
        ],
        data: {
          amount: "",
          selectedBank: null,
          time: "",
        },
      },
      setting: {
        balance_hide: false,
        theme: false,
        notification: {
          app: true,
          email: false,
          sms: false,
        },
        card: [
          {
            id: 1,
            card_number: "",
            card_date: "",
            card_month: "",
            card_name: "",
          },
        ],
        password: {
          fa2: "",
          pinCode: "",
        },
      },
    },
    data: {
      operation: [
        {
          id: 1,
          status: "otkazma",
          user_target: "@user1",
          value: "2500000",
          time: "2025.07.07 05:12",
        },
        {
          id: 2,
          status: "hisobtoldirish",
          user_target: "@user1",
          value: "2500000",
          time: "2025.07.07 05:12",
        },
        {
          id: 3,
          status: "+savdo",
          user_target: "@user1",
          value: "2500000",
          time: "2025.07.07 05:12",
        },
        {
          id: 4,
          status: "-savdo",
          user_target: "@user1",
          value: "2500000",
          time: "2025.07.07 05:12",
        },
      ],
      savdolar: [
        {
          id: 1,
          status: "oluvchi",
          savdoName: "Savdo Nomi",
          holat: "faol",
          user_target: "@user1",
          navbat: true,
          time: "2025.07.07 07:11",
          value: "120000",
          komissiya: "men",
          komissiyaValue: "12000",
          active: true,
        },
        {
          id: 2,
          status: "yakunlangan",
          savdoName: "Savdo Nomi",
          holat: "yakunlangan",
          user_target: "@user1",
          navbat: true,
          time: "2025.07.07 07:11",
          value: "120000",
          komissiyaValue: "12000",
          komissiya: "ortada",
          active: true,
        },
        {
          id: 3,
          status: "oluvchi",
          savdoName: "Savdo Nomi",
          holat: "faol",
          user_target: "@user1",
          navbat: true,
          time: "2025.07.07 07:11",
          value: "120000",
          komissiyaValue: "12000",
          komissiya: "unda",
          active: false,
        },
      ],
    },
  },
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SETHIDE":
      return {
        ...state,
        result: {
          ...state.result,
          user: {
            ...state.result.user,
            setting: {
              ...state.result.user.setting,
              balance_hide: payload,
            },
          },
        },
      };
    case "NOTIFICATION":
      return {
        ...state,
        result: {
          ...state.result,
          user: {
            ...state.result.user,
            setting: {
              ...state.result.user.setting,
              notification: {
                ...state.result.user.setting.notification,
                ...payload,
              },
            },
          },
        },
      };
    case "THEME":
      return {
        ...state,
        result: {
          ...state.result,
          user: {
            ...state.result.user,
            setting: {
              ...state.result.user.setting,
              theme: payload,
            },
          },
        },
      };
    case "PAYMENTS":
      return {
        ...state,
        result: {
          ...state.result,
          user: {
            ...state.result.user,
            payments: {
              ...state.result.user.payments,
              data: {
                time: payload.time,
                amount: payload.amount,
                selectedBank: payload.selectedBank,
              },
            },
          },
        },
      };
    case "NEWSAVDO":
      return {
        ...state,
        result: {
          ...state.result,
          data: {
            ...state.result.data,
            savdolar: [...state.result.data.savdolar, payload],
          },
        },
      };

    default:
      return state;
  }
};

const MainGlobalContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);
  console.log(state);

  return (
    <GlobalContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { MainGlobalContext };
