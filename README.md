# SkillBridge Frontend

একটি আধুনিক টিউটর বুকিং প্ল্যাটফর্মের ফ্রন্টএন্ড — ছাত্র, টিউটর এবং অ্যাডমিনের জন্য আলাদা ড্যাশবোর্ড সহ।

---

## 🔗 লাইভ লিংকসমূহ

| রিসোর্স | লিংক |
|---|---|
| 🎬 ডেমো ভিডিও | [Loom-এ দেখুন](https://www.loom.com/share/c41bc7f3e9244eb185fb7cced385debc) |
| 🌐 ফ্রন্টএন্ড লাইভ | [skillbridge-frontend-rho-nine.vercel.app](https://skillbridge-frontend-rho-nine.vercel.app) |
| 🖥️ ব্যাকএন্ড লাইভ | [skrill-bridge-backend.vercel.app](https://skrill-bridge-backend.vercel.app) |
| 💻 ফ্রন্টএন্ড রিপো | [SkrillBridge-Fontend](https://github.com/kankon12/SkrillBridge-Fontend) |
| ⚙️ ব্যাকএন্ড রিপো | [SkillBridge-Backend](https://github.com/kankon12/SkillBridge-Backend) |

---

## 🛠 টেক স্ট্যাক

| টুল | ভার্সন |
|---|---|
| [Next.js](https://nextjs.org/) | 15.x (App Router) |
| [React](https://react.dev/) | 19.x |
| [TypeScript](https://www.typescriptlang.org/) | 5.x |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x |
| [Better Auth](https://better-auth.com/) | Authentication |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Axios](https://axios-http.com/) | HTTP client |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form validation |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/Light mode |

---

## 📁 প্রজেক্ট স্ট্রাকচার

```
src/
├── app/
│   ├── page.tsx                        # হোমপেজ
│   ├── login/                          # লগইন পেজ
│   ├── register/                       # রেজিস্ট্রেশন পেজ
│   ├── tutors/                         # টিউটর লিস্ট ও প্রোফাইল
│   ├── bookings/                       # বুকিং পেজ
│   └── dashboard/
│       ├── admin/                      # অ্যাডমিন ড্যাশবোর্ড
│       │   ├── bookings/
│       │   ├── categories/
│       │   ├── tutors/
│       │   └── users/
│       ├── student/                    # ছাত্র ড্যাশবোর্ড
│       │   └── bookings/
│       └── tutor/                      # টিউটর ড্যাশবোর্ড
│           ├── availability/
│           ├── profile/
│           └── sessions/
├── components/
│   ├── shared/                         # Navbar, Sidebar, StatCard ইত্যাদি
│   └── ui/                             # Reusable UI components (Button, Card, Input…)
├── hooks/                              # Custom React hooks
├── lib/
│   ├── api.ts                          # Axios instance
│   ├── auth-client.ts                  # Better Auth client config
│   └── utils.ts                        # Helper utilities
├── middleware.ts                       # Route protection
└── types/
    └── index.ts                        # Global TypeScript types
```

---

## 🚀 শুরু করার নির্দেশনা

### ১. রিপোজিটরি ক্লোন করুন

```bash
git clone https://github.com/kankon12/SkrillBridge-Fontend.git
cd SkrillBridge-Fontend
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন

```bash
npm install
```

### ৩. Environment Variables সেট করুন

`.env.local.example` ফাইলটি কপি করে `.env.local` নাম দিন এবং মান পূরণ করুন:

```bash
cp .env.local.example .env.local
```

```env
# ব্যাকএন্ড বেস URL (Better Auth-এর জন্য — /api ছাড়া)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# ব্যাকএন্ড API URL (বাকি সব API কলের জন্য)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# অ্যাপ URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন

```bash
npm run dev
```

ব্রাউজারে খুলুন: [http://localhost:3000](http://localhost:3000)

---

## 📜 উপলব্ধ স্ক্রিপ্টস

```bash
npm run dev      # ডেভেলপমেন্ট সার্ভার চালু করুন
npm run build    # প্রোডাকশন বিল্ড তৈরি করুন
npm run start    # প্রোডাকশন সার্ভার চালু করুন
npm run lint     # ESLint চালান
```

---

## 🔐 অথেনটিকেশন

প্রজেক্টে [Better Auth](https://better-auth.com/) ব্যবহার করা হয়েছে। অথেনটিকেশন সম্পর্কিত কনফিগারেশন `src/lib/auth-client.ts`-এ পাওয়া যাবে।

রুট প্রোটেকশনের জন্য `src/middleware.ts` ব্যবহার করা হয়েছে — লগইন ছাড়া ড্যাশবোর্ডে প্রবেশ করা যাবে না।

---

## 🌐 ব্যাকএন্ড

এই ফ্রন্টএন্ড SkillBridge ব্যাকএন্ড API-এর সাথে কাজ করে।

- **ব্যাকএন্ড রিপো:** [SkillBridge-Backend](https://github.com/kankon12/SkillBridge-Backend)
- **ব্যাকএন্ড লাইভ URL:** [skrill-bridge-backend.vercel.app](https://skrill-bridge-backend.vercel.app)

---

## 🤝 কন্ট্রিবিউশন

Pull Request স্বাগত! বড় পরিবর্তনের আগে একটি Issue খুলে আলোচনা করুন।

---

## 📄 লাইসেন্স

[MIT](LICENSE)