export const appPaths = {
  owner: {
    dashboard: '/dashboard',
    properties: '/properties',
    propertyDetails: (id: string) => `/properties/${id}`,
    rooms: '/rooms',
    residents: '/residents',
    finance: '/finance',
    invoices: '/tagihan',
    payments: '/pembayaran',
    expenses: '/pengeluaran',
    inventory: '/inventaris',
    reports: '/laporan',
    settings: '/pengaturan',
    billing: '/billing',
    maintenance: '/maintenance',
    whatsapp: '/whatsapp',
  },
  resident: {
    home: '/resident',
    maintenance: '/resident/maintenance',
    invoices: '/resident/invoices',
    profile: '/resident/profile',
  },
  auth: {
    ownerLogin: '/login',
    ownerRegister: '/register',
    residentLogin: '/resident/login',
  },
} as const;

export const publicPaths = new Set<string>([
  appPaths.auth.ownerLogin,
  appPaths.auth.ownerRegister,
  appPaths.auth.residentLogin,
]);
