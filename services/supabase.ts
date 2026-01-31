import { createClient } from '@supabase/supabase-js';
import { Reservation, MenuItem, Announcement } from '../types';

// ATENÇÃO: Em um projeto real, use variáveis de ambiente (.env).
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qjommaufbqszimakesfr.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb21tYXVmYnFzemltYWtlc2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDgyNzYsImV4cCI6MjA4NTEyNDI3Nn0.wDifnH7REU7CwjT5rZDeXM-ZXWKrWmRAWzddMeyJBtE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEY = 'fuego_reservations';
const ANNOUNCEMENT_KEY = 'fuego_announcements';
const MENU_KEY = 'fuego_menu_v3'; // Version bump to clear any bad cache

// Connection Status Flag
export let isSystemOffline = false;

// --- DEFAULT DATA (Exported for initial state) ---
export const DEFAULT_MENU_ITEMS: any[] = [
  {
    id: '1',
    name: "Prime Tomahawk Gold",
    description: "Corte nobre de 800g com osso, finalizado na manteiga de ervas e flor de sal.",
    price: 189.90,
    category: "carnes",
    highlight: true,
    image: "https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '2',
    name: "Bife de Chorizo Angus",
    description: "Suculência extrema, grelhado ao ponto do chef. Acompanha batatas rústicas.",
    price: 89.90,
    category: "carnes",
    highlight: true,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '3',
    name: "Costela Defumada BBQ",
    description: "Assada lentamente por 12 horas, desmancha no garfo. Molho barbecue artesanal.",
    price: 75.00,
    category: "carnes",
    highlight: false,
    image: "https://img.freepik.com/fotos-premium/costelinha-de-porco-estilo-americano-deliciosas-costelinhas-de-porco-defumadas-com-cobertura-de-molho-barbecue-vista-de-cima_946881-13.jpg"
  },
  {
    id: '4',
    name: "Ancho Premium",
    description: "Corte dianteiro do contrafilé, marmoreio intenso e sabor inigualável.",
    price: 92.00,
    category: "carnes",
    highlight: false,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800"
  },
  // Massas
  {
    id: '5',
    name: "Gnocchi ao Funghi Trufado",
    description: "Massa fresca de batata, molho cremoso de cogumelos selvagens e azeite trufado.",
    price: 68.00,
    category: "massas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '6',
    name: "Carbonara Autêntica",
    description: "Sem creme de leite. Gema caipira, pecorino romano, guanciale e pimenta negra.",
    price: 62.00,
    category: "massas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '7',
    name: "Risoto de Camarão",
    description: "Arroz arbóreo, camarões rosa grandes, limão siciliano e parmesão.",
    price: 79.00,
    category: "massas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '8',
    name: "Lasagna Bolognese",
    description: "Camadas finas de massa, ragu de carne cozido por 6h e molho bechamel.",
    price: 58.00,
    category: "massas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&q=80&w=800"
  },
  // Entradas
  {
    id: '9',
    name: "Burrata Caprese",
    description: "Burrata cremosa, tomates confit, pesto de manjericão fresco e torradas.",
    price: 55.00,
    category: "entradas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '10',
    name: "Carpaccio Clássico",
    description: "Lâminas finíssimas de carne crua, alcaparras, parmesão e mostarda.",
    price: 48.00,
    category: "entradas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '11',
    name: "Bruschetta Pomodoro",
    description: "Pão italiano tostado, tomates frescos, alho e manjericão.",
    price: 32.00,
    category: "entradas",
    highlight: false,
    image: "https://trattorialapasta.com/cms-data/blog/menu/bruschetta-al-pomodoro/image/bruschetta-al-pomodoro.jpg"
  },
  {
    id: '12',
    name: "Dadinhos de Queijo Coalho",
    description: "Crocantes por fora, macios por dentro. Acompanha geleia de pimenta.",
    price: 35.00,
    category: "entradas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&q=80&w=800"
  },
  // Sobremesas
  {
    id: '13',
    name: "Volcán de Dulce de Leche",
    description: "Petit gateau de doce de leite argentino com sorvete de baunilha.",
    price: 32.00,
    category: "sobremesas",
    highlight: true,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '14',
    name: "Tiramisu Fuego",
    description: "A clássica receita italiana com um toque de conhaque.",
    price: 28.00,
    category: "sobremesas",
    highlight: false,
    image: "https://desxestal.com/wp-content/uploads/2021/04/desxestal_tiramisu-scaled.jpg"
  },
  {
    id: '15',
    name: "Cheesecake de Frutas Vermelhas",
    description: "Base crocante, creme suave e calda rústica de frutas.",
    price: 29.00,
    category: "sobremesas",
    highlight: false,
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&q=80&w=800"
  },
  // Vinhos
  {
    id: '16',
    name: "Malbec Reserva",
    description: "Vinho tinto encorpado, notas de ameixa e baunilha. Safra especial.",
    price: 140.00,
    category: "vinhos",
    highlight: false,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '17',
    name: "Fuego Signature Drink",
    description: "Gin, infusão de hibisco, tônica e defumação de alecrim.",
    price: 38.00,
    category: "vinhos",
    highlight: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800"
  }
];

// Fallback: LocalStorage Helpers (Garante funcionamento offline/demo)
const getLocalData = (): Reservation[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const setLocalData = (data: Reservation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getLocalAnnouncements = (): Announcement[] => {
  try {
    const saved = localStorage.getItem(ANNOUNCEMENT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const setLocalAnnouncements = (data: Announcement[]) => {
  localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify(data));
};

// IMPROVED: Validate data integrity
const getLocalMenu = (): any[] => {
  try {
    const saved = localStorage.getItem(MENU_KEY);
    // If nothing saved, return DEFAULT immediately
    if (!saved) return DEFAULT_MENU_ITEMS;
    
    const parsed = JSON.parse(saved);
    // CRITICAL: Validate that it is an array AND has items. If empty, fallback to default.
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
      return parsed;
    }
    // If validation failed, return default
    return DEFAULT_MENU_ITEMS;
  } catch (e) {
    return DEFAULT_MENU_ITEMS;
  }
};

const setLocalMenu = (data: any[]) => {
  localStorage.setItem(MENU_KEY, JSON.stringify(data));
};

/**
 * Checks if the connection to Supabase is truly working (Table exists + RLS allows access)
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error, count } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.warn("Supabase Connection Check Failed:", error.message);
      isSystemOffline = true;
      return false;
    }
    isSystemOffline = false;
    return true;
  } catch (e) {
    isSystemOffline = true;
    return false;
  }
};

/**
 * --- RESERVATION SERVICES ---
 */

export const fetchReservations = async (): Promise<Reservation[]> => {
  const localData = getLocalData();
  let serverData: Reservation[] = [];

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      isSystemOffline = false;
      serverData = data.map((item: any) => ({
        id: item.id,
        clientName: item.client_name,
        phone: item.phone || '',
        pax: typeof item.pax === 'number' ? `${item.pax} Pessoas` : (item.pax || '2 Pessoas'),
        time: item.time,
        date: item.date,
        tableType: item.table_type || 'Salão Principal',
        status: item.status,
        createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now()
      }));
    } else {
      isSystemOffline = true;
    }
  } catch (error) {
    console.warn('Supabase unreachable. Using LocalStorage only.');
    isSystemOffline = true;
  }

  const allReservations = [...serverData, ...localData];
  const uniqueMap = new Map();
  allReservations.forEach(item => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) => b.createdAt - a.createdAt);
};

export const createReservation = async (res: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<Reservation | null> => {
  try {
    const paxString = res.pax || '2';
    const paxInt = parseInt(paxString.replace(/\D/g, '')) || 2;

    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        client_name: res.clientName,
        phone: res.phone,
        pax: paxInt,
        date: res.date,
        time: res.time,
        table_type: res.tableType,
        status: 'confirmed'
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      clientName: data.client_name,
      phone: data.phone,
      pax: `${data.pax} Pessoas`,
      time: data.time,
      date: data.date,
      tableType: data.table_type,
      status: data.status,
      createdAt: new Date(data.created_at).getTime()
    };

  } catch (error) {
    console.warn('Supabase insert failed. Using LocalStorage fallback.', error);
    isSystemOffline = true;
    
    const newReservation: Reservation = {
      id: 'local_' + Math.random().toString(36).substr(2, 9), 
      clientName: res.clientName,
      phone: res.phone,
      pax: res.pax,
      time: res.time,
      date: res.date,
      tableType: res.tableType,
      status: 'confirmed',
      createdAt: Date.now()
    };

    const currentData = getLocalData();
    setLocalData([newReservation, ...currentData]);
    
    return newReservation;
  }
};

export const updateReservationStatusService = async (id: string, status: 'confirmed' | 'cancelled') => {
  if (id.startsWith('local_')) {
    const currentData = getLocalData();
    const updatedData = currentData.map(r => 
      r.id === id ? { ...r, status } : r
    );
    setLocalData(updatedData);
    return;
  }

  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    const currentData = getLocalData();
    const updatedData = currentData.map(r => 
      r.id === id ? { ...r, status } : r
    );
    setLocalData(updatedData);
  }
};

/**
 * --- ANNOUNCEMENT SERVICES ---
 */

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const localData = getLocalAnnouncements();
  let serverData: Announcement[] = [];

  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      serverData = data.map((item: any) => ({
        id: item.id,
        message: item.message,
        isActive: item.is_active,
        createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now()
      }));
    }
  } catch (e) {
    console.warn('Supabase announcements unreachable');
  }

  const all = [...serverData, ...localData];
  const uniqueMap = new Map();
  all.forEach(item => {
    if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
  });

  return Array.from(uniqueMap.values()).sort((a, b) => b.createdAt - a.createdAt);
};

export const createAnnouncement = async (message: string): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert([{ message, is_active: true }])
      .select()
      .single();
    
    if(error) throw error;

    return {
      id: data.id,
      message: data.message,
      isActive: data.is_active,
      createdAt: new Date(data.created_at).getTime()
    };
  } catch (e) {
    const prev = getLocalAnnouncements();
    const newAnn: Announcement = {
      id: 'local_' + Date.now(),
      message,
      isActive: true,
      createdAt: Date.now()
    };
    setLocalAnnouncements([newAnn, ...prev]);
    return newAnn;
  }
};

export const toggleAnnouncement = async (id: string, isActive: boolean) => {
  if (id.startsWith('local_')) {
    const data = getLocalAnnouncements().map(a => a.id === id ? { ...a, isActive } : a);
    setLocalAnnouncements(data);
    return;
  }

  try {
    await supabase.from('announcements').update({ is_active: isActive }).eq('id', id);
  } catch (e) {
    const data = getLocalAnnouncements().map(a => a.id === id ? { ...a, isActive } : a);
    setLocalAnnouncements(data);
  }
};

/**
 * --- MENU SERVICES ---
 */

export const fetchMenu = async (): Promise<any[]> => {
  // 1. Always start with what we have locally or Defaults.
  // Using getLocalMenu() guarantees we get EITHER stored valid data OR Default Items.
  // It NEVER returns empty array.
  const local = getLocalMenu();
  
  // 2. Try Supabase (DB)
  try {
    const { data, error } = await supabase.from('menu_items').select('*');
    
    // Only use DB data if it's NOT empty.
    // If user created table via SQL but hasn't inserted data, 'data' is [].
    // We ignore empty DB and return 'local' (which contains Defaults).
    if (!error && data && data.length > 0) {
      // Ensure numeric types are actually numbers (Supabase numeric sometimes comes as string)
      return data.map((item: any) => ({
        ...item,
        price: Number(item.price)
      }));
    }
  } catch (e) {
    console.warn("Error fetching menu from DB, using local/default", e);
  }

  return local;
};

export const updateMenuItemPrice = async (id: string, newPrice: number) => {
  // Update Local
  const currentMenu = getLocalMenu(); // Guaranteed to have items
  const updatedMenu = currentMenu.map(item => 
    item.id === id ? { ...item, price: newPrice } : item
  );
  setLocalMenu(updatedMenu);

  // Try Update Supabase
  // Note: This will only work if the row exists in Supabase.
  // If we are running on Defaults (because DB is empty), this update might fail on DB side
  // but persist locally, which is acceptable for "Offline First" feel.
  try {
    // Upsert ensures that if we are editing a "Default" item that isn't in DB yet, it gets created.
    // We need to send the whole object for upsert, or just try update.
    // Since defaults have IDs, let's try update first.
    const { error } = await supabase.from('menu_items').update({ price: newPrice }).eq('id', id);
    
    // If update affected 0 rows (item doesn't exist), we might need to insert it.
    // For simplicity in this demo, we rely on local storage if DB sync fails/is empty.
  } catch (e) {
    console.warn("Could not update menu on Supabase, updated locally only.");
  }
  
  return updatedMenu;
};