# Trade Lock - Xavfsiz Savdo Platformasi

Trade Lock - bu Telegram Mini App sifatida ishlaydigan xavfsiz savdo platformasi. Foydalanuvchilar xavfsiz tarzda sotish va sotib olish operatsiyalarini amalga oshirishlari mumkin.

## 🚀 Xususiyatlar

### 💰 Moliya boshqaruvi

- **Balans boshqaruvi**: Real vaqtda balansni kuzatish
- **To'lov tizimlari**: Humo, Uzcard, Visa, Mastercard qo'llab-quvvatlash
- **Xavfsiz to'lovlar**: SSL shifrlash bilan himoyalangan
- **Balansni yashirish**: Maxfiylik uchun balans raqamlarini yashirish

### 🛍️ Savdo tizimi

- **Yangi savdo yaratish**: Sotish/sotib olish uchun savdo yaratish
- **Komissiya tizimi**: Moslashuvchan komissiya to'lash imkoniyati
- **Savdo holati**: Real vaqtda savdo holatini kuzatish
- **Xavfsiz tranzaksiyalar**: Ikki tomonlama tasdiqlash tizimi

### 🔐 Xavfsizlik

- **Ikki bosqichli autentifikatsiya**: Qo'shimcha xavfsizlik darajasi
- **Shifrlangan ma'lumotlar**: Barcha ma'lumotlar shifrlangan
- **Maxfiylik sozlamalari**: Foydalanuvchi maxfiyligini himoya qilish

### 📱 Telegram integratsiyasi

- **Mini App**: To'liq Telegram Mini App funksionalligi
- **Haptic Feedback**: Tabiiy foydalanuvchi tajribasi
- **Push bildirishnomalar**: Muhim hodisalar haqida xabar berish
- **Inline ulashish**: Savdo havolalarini osongina ulashish

## 🛠️ Texnologiyalar

- **Frontend**: React 19, Vite 7
- **Styling**: TailwindCSS 4, DaisyUI
- **State Management**: React Context API, useReducer
- **HTTP Client**: Native Fetch API
- **Icons**: Lucide React, React Icons
- **Routing**: React Router DOM 7

## 📁 Loyiha tuzilishi

```
src/
├── components/          # Qayta foydalaniladigan komponentlar
│   ├── BekorQilish.jsx     # Savdoni bekor qilish modali
│   ├── Chiqarish.jsx       # Mablag' chiqarish komponenti
│   ├── ErrorBoundary.jsx   # Xatoliklarni boshqarish
│   ├── FormatNumber.js     # Raqamlarni formatlash
│   ├── Header.jsx          # Sahifa boshi
│   ├── LoadingScreen.jsx   # Yuklash ekrani
│   ├── Menu.jsx            # Asosiy menyu
│   ├── NotificationContainer.jsx # Bildirishnomalar
│   ├── Operation.jsx       # Operatsiyalar ro'yxati
│   ├── PaymentCard.jsx     # To'lov kartasi komponenti
│   ├── Sotuvchi.jsx        # Sotuvchi savdo kartasi
│   ├── Tasdiqlash.jsx      # Tasdiqlash modali
│   ├── TimeAgo.jsx         # Vaqt formatlash
│   ├── Toldirish.jsx       # Hisob to'ldirish
│   └── TradeCard.jsx       # Savdo kartasi
├── context/             # Global state boshqaruvi
│   ├── AppContext.jsx      # Asosiy app context
│   └── MainGlobalContext.jsx # Qo'shimcha global context
├── hooks/               # Custom React hooks
│   ├── useApi.js           # API bilan ishlash
│   ├── useFetch.js         # Ma'lumot olish
│   ├── useMainGlobalContext.jsx # Global context hook
│   ├── usePayments.js      # To'lovlar boshqaruvi
│   ├── useTelegram.js      # Telegram Web App API
│   ├── useTrades.js        # Savdolar boshqaruvi
│   └── useUser.js          # Foydalanuvchi ma'lumotlari
├── layouts/             # Sahifa tartib-qoidalari
│   └── MainLayout.jsx      # Asosiy layout
├── pages/               # Sahifa komponentlari
│   ├── Hamyon.jsx          # Hamyon sahifasi
│   ├── Home.jsx            # Bosh sahifa
│   ├── JoinTrade.jsx       # Savdoga qo'shilish
│   ├── Savdolar.jsx        # Savdolar sahifasi
│   └── Sozlamalar.jsx      # Sozlamalar sahifasi
├── utils/               # Yordam funksiyalari
│   ├── formatters.js       # Ma'lumotlarni formatlash
│   ├── telegram.js         # Telegram integratsiyasi
│   └── validation.js       # Ma'lumotlarni tekshirish
├── App.jsx              # Asosiy app komponenti
├── main.jsx             # App kirish nuqtasi
└── index.css            # Global stillar
```

## 🚀 O'rnatish va ishga tushirish

### Talablar

- Node.js 18+
- npm yoki yarn

### 1. Loyihani klonlash

```bash
git clone <repository-url>
cd trade-lock
```

### 2. Bog'liqliklarni o'rnatish

```bash
npm install
```

### 3. Development serverini ishga tushirish

```bash
npm run dev
```

### 4. Production uchun build qilish

```bash
npm run build
```

### 5. Preview serverini ishga tushirish

```bash
npm run preview
```

## 🔧 Konfiguratsiya

### Environment o'zgaruvchilari

`.env` faylini yarating va quyidagi o'zgaruvchilarni sozlang:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_BOT_USERNAME=Trade_Lock_bot
VITE_SUPPORT_URL=https://t.me/TradeLock_support
```

### Telegram Bot sozlamalari

1. BotFather orqali bot yarating
2. Bot tokenini oling
3. Mini App URL ni sozlang
4. Domain whitelist qo'shing

## 📡 API Endpointlari

### Autentifikatsiya

- `POST /auth` - Foydalanuvchini autentifikatsiya qilish

### Foydalanuvchi

- `GET /user` - Profil ma'lumotlarini olish
- `PUT /user` - Profilni yangilash
- `PUT /user/settings` - Sozlamalarni yangilash

### Savdolar

- `GET /trade` - Savdolar ro'yxati
- `POST /trade` - Yangi savdo yaratish
- `GET /trade/:id` - Savdo tafsilotlari
- `PUT /trade/:id` - Savdoni yangilash

### To'lovlar

- `GET /payment` - To'lovlar tarixi
- `POST /payment` - Yangi to'lov yaratish

## 🔐 Xavfsizlik

### Ma'lumotlar himoyasi

- Barcha API so'rovlari JWT token bilan himoyalangan
- Shifrlangan ma'lumotlar saqlash
- HTTPS majburiy foydalanish

### Foydalanuvchi maxfiyлigi

- Balansni yashirish imkoniyati
- Maxfiy ma'lumotlarni shifrlash
- Xavfsiz autentifikatsiya

## 🌍 Til va lokalizatsiya

Hozirda qo'llab-quvvatlanadigan tillar:

- 🇺🇿 O'zbek tili (asosiy)

## 🤝 Hissa qo'shish

1. Loyihani fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Branch ga push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request yarating

## 📄 Litsenziya

Ushbu loyiha MIT litsenziyasi ostida tarqatiladi. Tafsilotlar uchun `LICENSE` faylini ko'ring.

## 📞 Qo'llab-quvvatlash

- 📧 Email: support@tradelock.uz
- 💬 Telegram: [@TradeLock_support](https://t.me/TradeLock_support)
- 📢 Yangiliklar: [@TradeLock_news](https://t.me/TradeLock_news)

## 🏗️ Development

### Kodlash standartlari

- ESLint konfiguratsiyasiga amal qiling
- Commit xabarlarida conventional commits formatini ishlating
- Code review jarayonini bajaring

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

---

**Trade Lock** - Xavfsiz savdo, ishonchli hamkorlik! 🚀
