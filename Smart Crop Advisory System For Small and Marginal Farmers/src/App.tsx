import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  CloudSun, 
  FlaskConical, 
  Bug, 
  TrendingUp, 
  MessageSquare, 
  Bell, 
  Globe, 
  Menu, 
  X,
  Droplets,
  Thermometer,
  Wind,
  Search,
  Camera,
  Upload,
  Send,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  LogOut,
  Lock,
  User,
  Mic,
  RefreshCw,
  MapPin,
  CloudRain,
  Calendar,
  Cloud,
  Sun,
  BookOpen,
  Wallet,
  Package,
  Plus,
  Trash2,
  Edit2,
  Check,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  Wheat,
  Coins,
  Banknote,
  Tractor,
  Beef,
  Fish,
  Egg,
  Apple,
  Grape,
  Milk,
  Hammer,
  Wrench,
  Fuel
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Language, WeatherData, MarketPrice, SoilData, TRANSLATIONS } from './types';
import { 
  getCropRecommendation, 
  detectPlantDisease, 
  getChatbotResponse, 
  getIrrigationAdvice, 
  monitorCropGrowth,
  getSoilAnalysis,
  getRainProbability
} from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const LoginPage = ({ onLogin, lang }: { onLogin: () => void, lang: Language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-700 rounded-full translate-x-1/2 translate-y-1/2 opacity-20 blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 mb-4">
            <Sprout size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 font-medium">{t.farmerLogin}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">{t.email}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@krishisathi.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">{t.password}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.signIn}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <span className="text-emerald-600 font-bold cursor-pointer">Register here</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
      active 
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, unit, trend, trendValue }: { icon: any, label: string, value: string | number, unit?: string, trend?: 'up' | 'down' | 'stable', trendValue?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
        <Icon size={24} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
          trend === 'down' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : <Minus size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="text-slate-500 text-sm font-medium mb-1">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      {unit && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
    </div>
  </div>
);

const getItemImage = (itemName: string, customImage?: string) => {
  if (customImage) return customImage;
  const name = itemName.toLowerCase();
  let seed = 'agriculture';
  if (name.includes('wheat')) seed = 'wheat';
  else if (name.includes('rice') || name.includes('paddy')) seed = 'rice-field';
  else if (name.includes('corn') || name.includes('maize')) seed = 'corn';
  else if (name.includes('apple')) seed = 'apple';
  else if (name.includes('grape')) seed = 'grapes';
  else if (name.includes('milk') || name.includes('dairy')) seed = 'milk';
  else if (name.includes('meat') || name.includes('beef') || name.includes('chicken') || name.includes('mutton')) seed = 'meat';
  else if (name.includes('egg')) seed = 'eggs';
  else if (name.includes('fish')) seed = 'fish';
  else if (name.includes('money') || name.includes('cash') || name.includes('sale') || name.includes('income') || name.includes('profit') || name.includes('earning')) seed = 'money';
  else if (name.includes('fertilizer') || name.includes('urea') || name.includes('npk') || name.includes('manure')) seed = 'fertilizer';
  else if (name.includes('seed')) seed = 'seeds';
  else if (name.includes('expense') || name.includes('cost') || name.includes('payment') || name.includes('bill')) seed = 'wallet';
  else if (name.includes('crop') || name.includes('plant') || name.includes('sowing') || name.includes('harvest')) seed = 'sprout';
  else if (name.includes('tractor') || name.includes('machinery') || name.includes('labor') || name.includes('plough')) seed = 'tractor';
  else if (name.includes('pesticide') || name.includes('bug') || name.includes('insecticide')) seed = 'insect';
  else if (name.includes('water') || name.includes('irrigation') || name.includes('rain')) seed = 'water';
  else if (name.includes('fuel') || name.includes('diesel') || name.includes('petrol')) seed = 'fuel';
  else if (name.includes('tool') || name.includes('hammer') || name.includes('equipment')) seed = 'tools';
  else if (name.includes('repair') || name.includes('maintenance')) seed = 'repair';
  else if (name.includes('feed') || name.includes('fodder')) seed = 'hay';
  else if (name.includes('land') || name.includes('rent') || name.includes('lease')) seed = 'farm';
  
  return `https://picsum.photos/seed/${seed}/200/200`;
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(() => {
    const saved = localStorage.getItem('marketPrices');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [weatherSearch, setWeatherSearch] = useState('');

  // New features state
  const [journalEntries, setJournalEntries] = useState<{id: string, date: string, activity: string, notes: string, image?: string}[]>(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: '2026-03-24', activity: 'Sowing', notes: 'Sowed 50kg of IR64 rice seeds in North field.' },
      { id: '2', date: '2026-03-20', activity: 'Fertilizing', notes: 'Applied 20kg Urea to South field.' }
    ];
  });
  const [expenses, setExpenses] = useState<{id: string, date: string, category: string, amount: number, type: 'income' | 'expense', cropName?: string, image?: string}[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: '2026-03-22', category: 'Seeds', amount: 5000, type: 'expense', cropName: 'Rice' },
      { id: '2', date: '2026-03-15', category: 'Crop Sale', amount: 25000, type: 'income', cropName: 'Wheat' }
    ];
  });
  const [inventory, setInventory] = useState<{id: string, item: string, quantity: number, unit: string, year: string, image?: string}[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : [
      { id: '1', item: 'Urea Fertilizer', quantity: 150, unit: 'kg', year: '2025' },
      { id: '2', item: 'NPK 19-19-19', quantity: 45, unit: 'kg', year: '2025' },
      { id: '3', item: 'Rice Seeds', quantity: 10, unit: 'kg', year: '2026' }
    ];
  });

  // Form states
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [newJournal, setNewJournal] = useState({ activity: '', notes: '', image: '' });
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', type: 'expense' as 'income' | 'expense', date: new Date().toISOString().split('T')[0], cropName: '', image: '' });

  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [newInventory, setNewInventory] = useState({ item: '', quantity: '', unit: 'kg', year: new Date().getFullYear().toString(), image: '' });

  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, type: 'danger' | 'info' | 'warning', time: string}[]>([
    { id: '1', title: 'Pest Alert', message: 'High risk of Aphids detected in your region. Check your crops.', type: 'danger', time: '2h ago' },
    { id: '2', title: 'Weather Update', message: 'Heavy rain expected tomorrow. Secure your harvest.', type: 'warning', time: '5h ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showJournalInfo, setShowJournalInfo] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: 'Anushiya',
      farmerId: '#4291',
      avatarSeed: 'Anushiya',
      photo: null as string | null
    };
  });
  const [rainProb, setRainProb] = useState({ probability: 15, reasoning: '', advice: '' });
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('marketPrices', JSON.stringify(marketPrices));
  }, [marketPrices]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Derived Stats
  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const inventoryCount = inventory.length;
  const journalCount = journalEntries.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (img: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD Actions
  const addJournalEntry = () => {
    if (!newJournal.activity) return;
    const entry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...newJournal
    };
    setJournalEntries([entry, ...journalEntries]);
    setNewJournal({ activity: '', notes: '', image: '' });
    setShowJournalForm(false);
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(journalEntries.filter(e => e.id !== id));
  };

  const addExpenseEntry = () => {
    if (!newExpense.category || !newExpense.amount) return;
    const entry = {
      id: Math.random().toString(36).substr(2, 9),
      date: newExpense.date,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      type: newExpense.type,
      cropName: newExpense.cropName,
      image: newExpense.image
    };
    setExpenses([entry, ...expenses]);
    setNewExpense({ category: '', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0], cropName: '', image: '' });
    setShowExpenseForm(false);
  };

  const deleteExpenseEntry = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const addInventoryItem = () => {
    if (!newInventory.item || !newInventory.quantity) return;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      item: newInventory.item,
      quantity: parseFloat(newInventory.quantity),
      unit: newInventory.unit,
      year: newInventory.year,
      image: newInventory.image
    };
    setInventory([item, ...inventory]);
    setNewInventory({ item: '', quantity: '', unit: 'kg', year: new Date().getFullYear().toString(), image: '' });
    setShowInventoryForm(false);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const [editingPriceIdx, setEditingPriceIdx] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const handleEditPrice = (idx: number, currentPrice: number) => {
    setEditingPriceIdx(idx);
    setTempPrice(currentPrice.toString());
  };

  const handleSavePrice = (idx: number) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice)) {
      const updatedPrices = [...marketPrices];
      updatedPrices[idx] = { ...updatedPrices[idx], price: newPrice };
      setMarketPrices(updatedPrices);
    }
    setEditingPriceIdx(null);
  };

  const [showMarketPriceForm, setShowMarketPriceForm] = useState(false);
  const [newMarketPrice, setNewMarketPrice] = useState({ crop: '', price: '', unit: 'kg', image: '' });

  const addMarketPrice = () => {
    if (!newMarketPrice.crop || !newMarketPrice.price) return;
    const newItem: MarketPrice = {
      crop: newMarketPrice.crop,
      price: parseFloat(newMarketPrice.price),
      unit: newMarketPrice.unit,
      trend: 'stable',
      image: newMarketPrice.image
    };
    setMarketPrices([newItem, ...marketPrices]);
    setNewMarketPrice({ crop: '', price: '', unit: 'kg', image: '' });
    setShowMarketPriceForm(false);
  };

  const deleteMarketPrice = (idx: number) => {
    setMarketPrices(marketPrices.filter((_, i) => i !== idx));
  };

  const [soilData, setSoilData] = useState<SoilData>({ ph: '6.5', nitrogen: '40', phosphorus: '30', potassium: '20', type: 'Loamy', moisture: '25' });
  const [cropRecResult, setCropRecResult] = useState<string | null>(null);
  const [soilHealthResult, setSoilHealthResult] = useState<string | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [irrigationResult, setIrrigationResult] = useState<string | null>(null);
  const [monitoringResult, setMonitoringResult] = useState<string | null>(null);

  // Trigger notification on disease detection
  useEffect(() => {
    if (diseaseResult) {
      const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Disease Analysis Complete',
        message: 'Check the Disease Detection tab for the full report and treatment advice.',
        type: 'info' as const,
        time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [diseaseResult]);

  // Trigger notification on crop monitoring
  useEffect(() => {
    if (monitoringResult) {
      const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Crop Health Alert',
        message: 'A new monitoring report is available. Review the health status of your field.',
        type: 'warning' as const,
        time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [monitoringResult]);
  const [monitoringImage, setMonitoringImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [cityInput, setCityInput] = useState('Coimbatore');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    fetchWeather(cityInput);
    fetchMarketPrices();
  }, []);

  const fetchWeather = async (city: string, lat?: number, lon?: number) => {
    setIsWeatherLoading(true);
    try {
      let url = `/api/weather?city=${city}`;
      if (lat && lon) url = `/api/weather?lat=${lat}&lon=${lon}`;
      const res = await axios.get(url);
      setWeather(res.data);
      
      // Update rain probability based on new weather data
      const rainInfo = await getRainProbability(res.data.temp, res.data.humidity, res.data.city, lang);
      setRainProb(rainInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const updateRainProbability = async (temp: number, humidity: number, city: string) => {
    setIsWeatherLoading(true);
    try {
      const rainInfo = await getRainProbability(temp, humidity, city, lang);
      setRainProb(rainInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        fetchWeather('', latitude, longitude);
      });
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const res = await axios.get('/api/market-prices');
      setMarketPrices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCropRecommendation = async () => {
    setIsAiLoading(true);
    try {
      const result = await getCropRecommendation(soilData, weather, lang);
      setCropRecResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSoilAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const result = await getSoilAnalysis(soilData, lang);
      setSoilHealthResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDiseaseDetection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedImage(reader.result as string);
      setIsAiLoading(true);
      try {
        const result = await detectPlantDisease(base64, lang);
        setDiseaseResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAiLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleIrrigationAdvice = async () => {
    setIsAiLoading(true);
    try {
      const result = await getIrrigationAdvice(soilData, weather, lang);
      setIrrigationResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleCropMonitoring = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setMonitoringImage(reader.result as string);
      setIsAiLoading(true);
      try {
        const result = await monitorCropGrowth(base64, lang);
        setMonitoringResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAiLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userMsg = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setUserInput('');
    setIsAiLoading(true);
    try {
      const context = { weather, soilData, activeTab };
      const aiMsg = await getChatbotResponse(userMsg, context, lang);
      setChatMessages(prev => [...prev, { role: 'ai', text: aiMsg }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Mock data for charts
  const yieldData = [
    { month: 'Jan', yield: 400 },
    { month: 'Feb', yield: 300 },
    { month: 'Mar', yield: 600 },
    { month: 'Apr', yield: 800 },
    { month: 'May', yield: 500 },
    { month: 'Jun', yield: 700 },
  ];

  const soilNutrients = [
    { name: 'N', value: parseInt(soilData.nitrogen), fill: '#10b981' },
    { name: 'P', value: parseInt(soilData.phosphorus), fill: '#3b82f6' },
    { name: 'K', value: parseInt(soilData.potassium), fill: '#f59e0b' },
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} lang={lang} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Sprout size={24} />
          </div>
          <h1 className="text-xl font-bold text-emerald-800 tracking-tight">{t.title}</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Sprout} label={t.cropRec} active={activeTab === 'cropRec'} onClick={() => setActiveTab('cropRec')} />
          <SidebarItem icon={Droplets} label={t.irrigation} active={activeTab === 'irrigation'} onClick={() => setActiveTab('irrigation')} />
          <SidebarItem icon={Search} label={t.monitoring} active={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')} />
          <SidebarItem icon={CloudSun} label={t.weather} active={activeTab === 'weather'} onClick={() => setActiveTab('weather')} />
          <SidebarItem icon={FlaskConical} label={t.soilHealth} active={activeTab === 'soilHealth'} onClick={() => setActiveTab('soilHealth')} />
          <SidebarItem icon={Bug} label={t.diseaseDet} active={activeTab === 'diseaseDet'} onClick={() => setActiveTab('diseaseDet')} />
          <SidebarItem icon={TrendingUp} label={t.marketPrices} active={activeTab === 'marketPrices'} onClick={() => setActiveTab('marketPrices')} />
          <SidebarItem icon={BookOpen} label={t.farmJournal} active={activeTab === 'farmJournal'} onClick={() => setActiveTab('farmJournal')} />
          <SidebarItem icon={Wallet} label={t.expenseTracker} active={activeTab === 'expenseTracker'} onClick={() => setActiveTab('expenseTracker')} />
          <SidebarItem icon={Package} label={t.inventory} active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <SidebarItem icon={MessageSquare} label={t.chatbot} active={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} />
        </nav>

        <div className="px-4 pb-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>{t.logout}</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
              <Globe size={16} />
              <span className="text-sm">{t.language}</span>
            </div>
            <div className="flex gap-2">
              {(['en', 'hi', 'ta'] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "flex-1 py-1 text-xs font-bold rounded-lg transition-colors",
                    lang === l ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 hover:bg-emerald-100"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-slate-200 px-6 flex items-center justify-between z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search crops, pests..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 relative group">
              <Mic size={20} />
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Voice Assistant</span>
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 relative"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-slate-900">{t.notifications}</h3>
                      <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-emerald-600 uppercase hover:underline">Clear All</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">{t.noNotifications}</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              n.type === 'danger' ? "bg-rose-100 text-rose-600" : 
                              n.type === 'warning' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                            )}>
                              {n.type === 'danger' ? <Bell size={14} /> : n.type === 'warning' ? <Bell size={14} /> : <Bell size={14} />}
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-slate-900">{n.title}</div>
                              <div className="text-[11px] text-slate-500 leading-relaxed">{n.message}</div>
                              <div className="text-[10px] text-slate-400">{n.time}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <div 
              onClick={() => setShowProfileEditor(true)}
              className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors group"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{profile.name}</div>
                <div className="text-xs text-slate-500">{t.farmerId}: {profile.farmerId}</div>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:border-emerald-200 transition-colors">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed}`} alt="Avatar" referrerPolicy="no-referrer" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Profile Editor Modal */}
        <AnimatePresence>
          {showProfileEditor && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                  <h3 className="text-xl font-bold">{t.editProfile}</h3>
                  <button onClick={() => setShowProfileEditor(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="w-24 h-24 bg-slate-100 rounded-full overflow-hidden border-4 border-emerald-50 shadow-inner relative group">
                      {profile.photo ? (
                        <img src={profile.photo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed}`} alt="Preview" referrerPolicy="no-referrer" />
                      )}
                      <label className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white" size={24} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setProfile({...profile, avatarSeed: Math.random().toString(36).substring(7), photo: null})}
                        className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:underline"
                      >
                        {profile.photo ? 'Switch to Avatar' : 'Randomize Avatar'}
                      </button>
                      {profile.photo && (
                        <button 
                          onClick={() => setProfile({...profile, photo: null})}
                          className="text-xs font-bold text-rose-600 uppercase tracking-wider hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.farmerName}</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.farmerId}</label>
                      <input 
                        type="text" 
                        value={profile.farmerId}
                        onChange={(e) => setProfile({...profile, farmerId: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <button 
                      onClick={() => setShowProfileEditor(false)}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {t.saveProfile}
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear all your farm data? This cannot be undone.')) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="w-full text-rose-600 text-xs font-bold uppercase tracking-wider hover:underline py-2"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{t.dashboard}</h2>
                    <p className="text-slate-500">{t.welcomeBack}, {profile.name}! Here's what's happening on your farm.</p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm font-medium text-slate-400">{t.location}</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onBlur={() => fetchWeather(cityInput)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm font-bold text-emerald-700 w-32"
                      />
                      <button 
                        onClick={handleGetLocation}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                        title={t.useGps}
                      >
                        <Globe size={16} />
                      </button>
                      <button 
                        onClick={() => setActiveTab('chatbot')}
                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
                      >
                        <MessageSquare size={16} />
                        <span>{t.chatbot}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Wallet} label={t.totalExpenses} value={totalExpenses.toLocaleString()} unit="₹" trend="up" trendValue="Monthly" />
                  <StatCard icon={Banknote} label={t.totalIncome} value={totalIncome.toLocaleString()} unit="₹" trend="up" trendValue="Monthly" />
                  <StatCard icon={Package} label={t.inventoryItems} value={inventoryCount.toLocaleString()} unit="Items" trend="stable" trendValue="Current" />
                  <StatCard icon={BookOpen} label={t.journalEntries} value={journalCount.toLocaleString()} unit="Entries" trend="up" trendValue="Total" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatCard icon={Thermometer} label={t.temp} value={weather?.temp || 28} unit="°C" trend="up" trendValue="+2°" />
                  <StatCard icon={Droplets} label={t.humidity} value={weather?.humidity || 65} unit="%" trend="down" trendValue="-5%" />
                  <StatCard icon={CloudRain} label={t.rainProb} value={rainProb.probability} unit="%" trend={rainProb.probability > 50 ? "up" : "down"} trendValue={rainProb.probability > 50 ? "High" : "Low"} />
                  <StatCard icon={Bell} label={t.alerts} value={notifications.filter(n => n.type === 'danger').length} unit="Alerts" trend="up" trendValue="New" />
                  <StatCard icon={TrendingUp} label={t.yield} value="4.2" unit="Tons" trend="up" trendValue="+12%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Yield Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-800">{t.yield} Analysis</h3>
                      <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 font-medium text-slate-600">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={yieldData}>
                          <defs>
                            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Soil Nutrients */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">{t.soilHealth}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={soilNutrients} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600}} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {soilNutrients.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">pH Level</span>
                        <span className="font-bold text-emerald-600">{soilData.ph} (Optimal)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Satellite Monitoring & NDVI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative group">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Globe size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Satellite Field Monitoring (NDVI)</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live Satellite Feed
                      </div>
                    </div>
                    <div className="aspect-[21/9] bg-slate-900 rounded-2xl relative overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/farm-sat/1200/500" 
                        alt="Satellite view" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      
                      {/* Mock NDVI Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full grid grid-cols-8 grid-rows-4 opacity-40">
                          {Array.from({length: 32}).map((_, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "border border-white/10",
                                i % 5 === 0 ? "bg-emerald-500" : i % 3 === 0 ? "bg-yellow-500" : "bg-emerald-600"
                              )}
                            ></div>
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Current NDVI Index</div>
                          <div className="text-2xl font-bold text-white">0.78 <span className="text-emerald-400 text-sm">(Healthy)</span></div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/10">Thermal</button>
                          <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors">NDVI</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 mb-4">Field Health Summary</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500" size={18} />
                            <span className="text-sm font-medium text-slate-700">Vegetation Density</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">High</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Droplets className="text-blue-500" size={18} />
                            <span className="text-sm font-medium text-slate-700">Water Stress</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">Low</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Clock className="text-amber-500" size={18} />
                            <span className="text-sm font-medium text-slate-700">Last Scan</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">2h ago</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('monitoring')}
                      className="w-full py-3 mt-6 border-2 border-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      View Detailed Report
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Quick AI Tips */}
                <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-100 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
                      <MessageSquare size={48} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold tracking-tight">Ask KrishiSathi AI</h3>
                        <p className="text-emerald-100 text-lg opacity-90">Get instant expert advice on crop diseases, soil health, and market trends.</p>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {["Pest Control", "Fertilizer Advice", "Market Trends"].map((q, i) => (
                          <button 
                            key={i}
                            onClick={() => {
                              setUserInput(`Tell me about ${q}`);
                              setActiveTab('chatbot');
                            }}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors border border-white/10"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('chatbot')}
                      className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95"
                    >
                      Start Chatting
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Alerts Section */}
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 text-rose-700 font-bold mb-4">
                    <Bell size={20} />
                    <h3>Recent Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                          <CloudSun size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Heavy Rain Expected</div>
                          <div className="text-xs text-slate-500">Tomorrow, 2:00 PM • Coimbatore Area</div>
                        </div>
                      </div>
                      <button className="text-emerald-600 font-bold text-sm">View Details</button>
                    </div>
                    <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                          <Bug size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Pest Attack Warning</div>
                          <div className="text-xs text-slate-500">Reported in nearby Groundnut farms</div>
                        </div>
                      </div>
                      <button className="text-emerald-600 font-bold text-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'weather' && (
              <motion.div 
                key="weather"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">{t.weather}</h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={weatherSearch}
                        onChange={(e) => setWeatherSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchWeather(weatherSearch)}
                        placeholder="Search city..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-48"
                      />
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <button 
                      onClick={() => fetchWeather(weatherSearch)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
                    >
                      {t.search}
                    </button>
                    <button 
                      onClick={handleGetLocation}
                      className="p-2 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2 px-4 font-bold text-sm"
                    >
                      <MapPin size={18} />
                      <span className="hidden sm:inline">Use GPS</span>
                    </button>
                    <button 
                      onClick={() => weather && fetchWeather(weather.city)}
                      className="p-2 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Current Weather Card */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 opacity-80">
                          <MapPin size={16} />
                          <span className="font-medium">{weather?.city || 'Loading...'}</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-7xl font-bold tracking-tighter">{weather?.temp}°</span>
                          <span className="text-2xl font-medium mb-2 opacity-80">C</span>
                        </div>
                        <p className="text-xl font-medium opacity-90 capitalize">{weather?.description}</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-auto">
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-4">Edit Conditions</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase opacity-60">{t.temp}</label>
                            <input 
                              type="number" 
                              value={weather?.temp || 0}
                              onChange={(e) => weather && setWeather({...weather, temp: parseInt(e.target.value)})}
                              className="w-full bg-white/10 border-none rounded-lg px-3 py-1 text-sm font-bold focus:ring-0"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase opacity-60">{t.humidity}</label>
                            <input 
                              type="number" 
                              value={weather?.humidity || 0}
                              onChange={(e) => weather && setWeather({...weather, humidity: parseInt(e.target.value)})}
                              className="w-full bg-white/10 border-none rounded-lg px-3 py-1 text-sm font-bold focus:ring-0"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => weather && updateRainProbability(weather.temp, weather.humidity, weather.city)}
                          disabled={isWeatherLoading}
                          className="w-full py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          {isWeatherLoading ? t.analyzing : t.checkRainProb}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <CloudRain size={18} className="text-emerald-600" />
                      {t.rainProb}
                    </h3>
                    <div className="space-y-4 relative">
                      {isWeatherLoading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="text-emerald-600 animate-spin" size={24} />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Analyzing...</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Probability</span>
                        <span className="text-sm font-bold text-slate-900">{rainProb.probability}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-1000" 
                          style={{ width: `${rainProb.probability}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{rainProb.reasoning || 'Enter conditions to see rain probability.'}</p>
                      {rainProb.advice && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">{rainProb.advice}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-600" />
                    7-Day {t.forecast}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weather?.forecast.map((day, i) => (
                      <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                        <span className="text-xs font-bold text-slate-400 uppercase mb-2">{day.day}</span>
                        <div className="w-10 h-10 flex items-center justify-center mb-2">
                          {day.condition.includes('Rain') ? <CloudRain className="text-blue-500" /> : 
                           day.condition.includes('Cloud') ? <Cloud className="text-slate-400" /> : 
                           <Sun className="text-amber-500" />}
                        </div>
                        <span className="text-lg font-bold text-slate-800">{day.temp}°</span>
                        <span className="text-[10px] text-slate-400 text-center leading-tight mt-1">{day.condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'irrigation' && (
              <motion.div 
                key="irrigation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">{t.irrigation}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                        <Droplets size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-emerald-700 font-bold">Smart Irrigation System</div>
                        <div className="text-xs text-emerald-600">Based on soil moisture & weather forecast</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">{t.moisture}</span>
                        <span className="text-emerald-600 font-bold">{soilData.moisture}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${soilData.moisture}%` }}></div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Edit {t.moisture} (%)</label>
                        <input 
                          type="number" 
                          value={soilData.moisture}
                          onChange={(e) => setSoilData({...soilData, moisture: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleIrrigationAdvice}
                      disabled={isAiLoading}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      {isAiLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Droplets size={20} />}
                      {t.analyze} {t.irrigation}
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">AI Irrigation Advice</h3>
                    {irrigationResult ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown>{irrigationResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Droplets size={32} />
                        </div>
                        <p>Click analyze to get precise irrigation recommendations for your field.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'monitoring' && (
              <motion.div 
                key="monitoring"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">{t.monitoring}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800">Field Monitoring (Image Analysis)</h3>
                    <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                      {monitoringImage ? (
                        <>
                          <img src={monitoringImage} alt="Field" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                              <Camera size={20} /> Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleCropMonitoring} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-slate-700">Upload Field/Crop Image</div>
                            <div className="text-xs text-slate-400">Track growth and health status</div>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleCropMonitoring} />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">{t.monitoringResult}</h3>
                    {isAiLoading ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Analyzing field status...</p>
                      </div>
                    ) : monitoringResult ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown>{monitoringResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Search size={32} />
                        </div>
                        <p>Upload a field image to track crop growth stage and overall health status.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'soilHealth' && (
              <motion.div 
                key="soilHealth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">{t.soilAnalysis}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800">Soil Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t.soilType}</label>
                        <select 
                          value={soilData.type}
                          onChange={(e) => setSoilData({...soilData, type: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        >
                          <option>Loamy</option>
                          <option>Clay</option>
                          <option>Sandy</option>
                          <option>Black Soil</option>
                          <option>Red Soil</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t.ph}</label>
                        <input 
                          type="number" 
                          value={soilData.ph}
                          onChange={(e) => setSoilData({...soilData, ph: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">N</label>
                        <input 
                          type="number" 
                          value={soilData.nitrogen}
                          onChange={(e) => setSoilData({...soilData, nitrogen: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">P</label>
                        <input 
                          type="number" 
                          value={soilData.phosphorus}
                          onChange={(e) => setSoilData({...soilData, phosphorus: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">K</label>
                        <input 
                          type="number" 
                          value={soilData.potassium}
                          onChange={(e) => setSoilData({...soilData, potassium: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t.moisture} (%)</label>
                      <input 
                        type="number" 
                        value={soilData.moisture}
                        onChange={(e) => setSoilData({...soilData, moisture: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                      />
                    </div>
                    <button 
                      onClick={handleSoilAnalysis}
                      disabled={isAiLoading}
                      className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {isAiLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FlaskConical size={20} />}
                      {t.analyze}
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">{t.soilAnalysis} Report</h3>
                    {soilHealthResult ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown>{soilHealthResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <FlaskConical size={32} />
                        </div>
                        <p>Enter your soil parameters and click analyze to get a detailed health report.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'cropRec' && (
              <motion.div 
                key="cropRec"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">{t.cropRec}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800">Current Conditions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t.soilType}</label>
                        <select 
                          value={soilData.type}
                          onChange={(e) => setSoilData({...soilData, type: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        >
                          <option>Loamy</option>
                          <option>Clay</option>
                          <option>Sandy</option>
                          <option>Black Soil</option>
                          <option>Red Soil</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t.ph}</label>
                        <input 
                          type="number" 
                          value={soilData.ph}
                          onChange={(e) => setSoilData({...soilData, ph: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t.moisture} (%)</label>
                        <input 
                          type="number" 
                          value={soilData.moisture}
                          onChange={(e) => setSoilData({...soilData, moisture: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">N</label>
                        <input 
                          type="number" 
                          value={soilData.nitrogen}
                          onChange={(e) => setSoilData({...soilData, nitrogen: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">P</label>
                        <input 
                          type="number" 
                          value={soilData.phosphorus}
                          onChange={(e) => setSoilData({...soilData, phosphorus: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">K</label>
                        <input 
                          type="number" 
                          value={soilData.potassium}
                          onChange={(e) => setSoilData({...soilData, potassium: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleCropRecommendation}
                      disabled={isAiLoading}
                      className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {isAiLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Sprout size={20} />}
                      {t.recommend}
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">AI Recommendation</h3>
                    {cropRecResult ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown>{cropRecResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Sprout size={32} />
                        </div>
                        <p>Fill in your soil data and click recommend to get AI-powered crop advice.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'diseaseDet' && (
              <motion.div 
                key="diseaseDet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">{t.diseaseDet}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800">Upload Plant Image</h3>
                    <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                      {selectedImage ? (
                        <>
                          <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                              <Camera size={20} /> Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleDiseaseDetection} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-slate-700">Click to upload or drag & drop</div>
                            <div className="text-xs text-slate-400">PNG, JPG up to 10MB</div>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleDiseaseDetection} />
                        </label>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Camera size={20} /> Take Photo
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-4">Diagnosis Report</h3>
                    {isAiLoading ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Analyzing image with AI...</p>
                      </div>
                    ) : diseaseResult ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown>{diseaseResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Bug size={32} />
                        </div>
                        <p>Upload a clear photo of the affected plant part to detect diseases and get treatment advice.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'marketPrices' && (
              <motion.div 
                key="marketPrices"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">{t.marketPrices}</h2>
                  <button 
                    onClick={() => setShowMarketPriceForm(!showMarketPriceForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                  >
                    {showMarketPriceForm ? <X size={20} /> : <Plus size={20} />}
                    <span>{showMarketPriceForm ? 'Cancel' : 'Add Price'}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showMarketPriceForm && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Crop Name</label>
                          <input 
                            type="text" 
                            value={newMarketPrice.crop}
                            onChange={(e) => setNewMarketPrice({...newMarketPrice, crop: e.target.value})}
                            placeholder="e.g. Wheat, Rice"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Price (₹)</label>
                          <input 
                            type="number" 
                            value={newMarketPrice.price}
                            onChange={(e) => setNewMarketPrice({...newMarketPrice, price: e.target.value})}
                            placeholder="0.00"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Unit</label>
                          <input 
                            type="text" 
                            value={newMarketPrice.unit}
                            onChange={(e) => setNewMarketPrice({...newMarketPrice, unit: e.target.value})}
                            placeholder="kg, quintal, ton"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-3">
                          <label className="text-xs font-bold text-slate-400 uppercase">Crop Image (Optional)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-emerald-300 transition-colors">
                              <Upload size={18} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-500">Upload Image</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (img) => setNewMarketPrice({...newMarketPrice, image: img}))}
                                className="hidden"
                              />
                            </label>
                            {newMarketPrice.image && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-200">
                                <img src={newMarketPrice.image} className="w-full h-full object-cover" alt="Preview" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={addMarketPrice}
                        className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Add Market Price
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketPrices.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-emerald-200 transition-colors relative">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                          <img 
                            src={getItemImage(item.crop, item.image)} 
                            alt={item.crop}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{item.crop}</div>
                          <div className="flex items-baseline gap-1">
                          {editingPriceIdx === idx ? (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-900 font-bold">₹</span>
                              <input 
                                type="number" 
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-24 px-2 py-1 bg-slate-50 border border-emerald-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-slate-900">₹{item.price}</span>
                          )}
                          <span className="text-slate-400 text-sm">/ {item.unit}</span>
                        </div>
                      </div>
                    </div>
                      
                    <div className="flex items-center gap-3">
                        {editingPriceIdx === idx ? (
                          <button 
                            onClick={() => handleSavePrice(idx)}
                            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => handleEditPrice(idx, item.price)}
                              className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => deleteMarketPrice(idx)}
                              className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          item.trend === 'up' ? "bg-emerald-50 text-emerald-600" : 
                          item.trend === 'down' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                        )}>
                          {item.trend === 'up' ? <ArrowUpRight size={24} /> : item.trend === 'down' ? <ArrowDownRight size={24} /> : <Minus size={24} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">Price Trends (Last 30 Days)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: '1', price: 2100 },
                        { day: '5', price: 2150 },
                        { day: '10', price: 2300 },
                        { day: '15', price: 2250 },
                        { day: '20', price: 2400 },
                        { day: '25', price: 2380 },
                        { day: '30', price: 2450 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'farmJournal' && (
              <motion.div 
                key="farmJournal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">{t.farmJournal}</h2>
                    <button 
                      onClick={() => setShowJournalInfo(!showJournalInfo)}
                      className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <BookOpen size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowJournalForm(!showJournalForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                  >
                    {showJournalForm ? <X size={20} /> : <Plus size={20} />}
                    <span>{showJournalForm ? 'Cancel' : t.addActivity}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showJournalInfo && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 overflow-hidden"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                          <BookOpen size={20} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-emerald-800">{t.whatIsJournal}</h3>
                          <p className="text-sm text-emerald-700 leading-relaxed">{t.journalInfo}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showJournalForm && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Activity Name</label>
                          <input 
                            type="text" 
                            value={newJournal.activity}
                            onChange={(e) => setNewJournal({...newJournal, activity: e.target.value})}
                            placeholder="e.g. Sowing, Harvesting"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Notes</label>
                          <input 
                            type="text" 
                            value={newJournal.notes}
                            onChange={(e) => setNewJournal({...newJournal, notes: e.target.value})}
                            placeholder="Add some details..."
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Activity Image (Optional)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-emerald-300 transition-colors">
                              <Upload size={18} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-500">Upload Image</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (img) => setNewJournal({...newJournal, image: img}))}
                                className="hidden"
                              />
                            </label>
                            {newJournal.image && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-200">
                                <img src={newJournal.image} className="w-full h-full object-cover" alt="Preview" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={addJournalEntry}
                        className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Save Entry
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={getItemImage(entry.activity, entry.image)} 
                          alt={entry.activity}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800">{entry.activity}</h3>
                          <span className="text-xs font-bold text-slate-400">{entry.date}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{entry.notes}</p>
                      </div>
                      <button 
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'expenseTracker' && (
              <motion.div 
                key="expenseTracker"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">{t.expenseTracker}</h2>
                  <button 
                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                  >
                    {showExpenseForm ? <X size={20} /> : <Plus size={20} />}
                    <span>{showExpenseForm ? 'Cancel' : t.addExpense}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showExpenseForm && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t.date}</label>
                          <input 
                            type="date" 
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t.cropName}</label>
                          <input 
                            type="text" 
                            value={newExpense.cropName}
                            onChange={(e) => setNewExpense({...newExpense, cropName: e.target.value})}
                            placeholder="e.g. Rice, Wheat"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                          <input 
                            type="text" 
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                            placeholder="e.g. Seeds, Fertilizer"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Amount (₹)</label>
                          <input 
                            type="number" 
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            placeholder="0.00"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Type</label>
                          <select 
                            value={newExpense.type}
                            onChange={(e) => setNewExpense({...newExpense, type: e.target.value as 'income' | 'expense'})}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </div>
                        <div className="space-y-1 md:col-span-2 lg:col-span-5">
                          <label className="text-xs font-bold text-slate-400 uppercase">Receipt/Item Image (Optional)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-emerald-300 transition-colors">
                              <Upload size={18} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-500">Upload Image</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (img) => setNewExpense({...newExpense, image: img}))}
                                className="hidden"
                              />
                            </label>
                            {newExpense.image && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-200">
                                <img src={newExpense.image} className="w-full h-full object-cover" alt="Preview" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={addExpenseEntry}
                        className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Save Transaction
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">{t.income}</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      ₹{expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <div className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-1">{t.expense}</div>
                    <div className="text-2xl font-bold text-rose-700">
                      ₹{expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">{t.profit}</div>
                    <div className="text-2xl font-bold text-blue-700">
                      ₹{(
                        expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) -
                        expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.date}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cropName}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600">{exp.date}</td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                            <div className="flex items-center gap-2">
                              <img 
                                src={getItemImage(exp.cropName || '', exp.image)} 
                                alt={exp.cropName || ''}
                                className="w-6 h-6 rounded-md object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {exp.cropName || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">
                            <div className="flex items-center gap-2">
                              <img 
                                src={getItemImage(exp.category, exp.image)} 
                                alt={exp.category}
                                className="w-6 h-6 rounded-md object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {exp.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{exp.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold",
                              exp.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                            )}>
                              {exp.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => deleteExpenseEntry(exp.id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">{t.inventory}</h2>
                  <button 
                    onClick={() => setShowInventoryForm(!showInventoryForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                  >
                    {showInventoryForm ? <X size={20} /> : <Plus size={20} />}
                    <span>{showInventoryForm ? 'Cancel' : t.addStock}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showInventoryForm && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Item Name</label>
                          <input 
                            type="text" 
                            value={newInventory.item}
                            onChange={(e) => setNewInventory({...newInventory, item: e.target.value})}
                            placeholder="e.g. Urea, NPK"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Quantity</label>
                          <input 
                            type="number" 
                            value={newInventory.quantity}
                            onChange={(e) => setNewInventory({...newInventory, quantity: e.target.value})}
                            placeholder="0"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Unit</label>
                          <input 
                            type="text" 
                            value={newInventory.unit}
                            onChange={(e) => setNewInventory({...newInventory, unit: e.target.value})}
                            placeholder="kg, L, bags"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t.year}</label>
                          <input 
                            type="text" 
                            value={newInventory.year}
                            onChange={(e) => setNewInventory({...newInventory, year: e.target.value})}
                            placeholder="2026"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2 lg:col-span-4">
                          <label className="text-xs font-bold text-slate-400 uppercase">Item Image (Optional)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-emerald-300 transition-colors">
                              <Upload size={18} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-500">Upload Image</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (img) => setNewInventory({...newInventory, image: img}))}
                                className="hidden"
                              />
                            </label>
                            {newInventory.image && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-200">
                                <img src={newInventory.image} className="w-full h-full object-cover" alt="Preview" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={addInventoryItem}
                        className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Add to Inventory
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventory.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative group">
                      <button 
                        onClick={() => deleteInventoryItem(item.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                          <img 
                            src={getItemImage(item.item, item.image)} 
                            alt={item.item}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            item.quantity < 20 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                          )}>
                            {item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded">
                            {t.year}: {item.year}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{item.item}</h3>
                        <p className="text-slate-400 text-sm font-medium">{t.stockLevel}</p>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">{item.quantity}</span>
                        <span className="text-slate-400 font-bold mb-1">{item.unit}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            item.quantity < 20 ? "bg-rose-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${Math.min((item.quantity / 200) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'chatbot' && (
              <motion.div 
                key="chatbot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">KrishiSathi AI Expert</h2>
                      <p className="text-emerald-100 text-sm">Your 24/7 Agricultural Consultant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Online</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  {chatMessages.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                        <Sprout size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800">Welcome to KrishiSathi AI</h3>
                        <p className="text-slate-500">I'm here to help you with all your farming needs. Ask me about crop diseases, soil health, market trends, or weather impacts.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                        {[
                          "What are the best crops for clay soil?",
                          "How to identify bacterial blight?",
                          "Current market trends for wheat",
                          "Organic ways to improve soil NPK"
                        ].map((q, i) => (
                          <button 
                            key={i}
                            onClick={() => {
                              setUserInput(q);
                              // We can't easily trigger handleSendMessage from here without a ref or some other way
                              // but we can at least set the input.
                            }}
                            className="p-3 text-sm bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={cn(
                      "flex",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl shadow-sm",
                        msg.role === 'user' 
                          ? "bg-emerald-600 text-white rounded-tr-none" 
                          : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                      )}>
                        {msg.role === 'ai' ? (
                          <div className="prose prose-slate max-w-none prose-sm">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="font-medium">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                  <div className="max-w-4xl mx-auto flex gap-4">
                    <input 
                      type="text" 
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask KrishiSathi anything about your farm..." 
                      className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-base focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isAiLoading || !userInput.trim()}
                      className="px-8 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
                    >
                      <Send size={20} />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Chatbot Toggle */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-xl shadow-emerald-200 flex items-center justify-center hover:scale-110 transition-transform z-30"
      >
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-30 overflow-hidden"
          >
            <div className="p-4 bg-emerald-600 text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <div className="font-bold">KrishiSathi AI</div>
                <div className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span> Online
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.length === 0 && (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Sprout size={32} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Hello! I'm your AI farming assistant. Ask me anything about crops, pests, or weather.</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={() => setUserInput("Best fertilizer for Rice?")} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-colors">Best fertilizer for Rice?</button>
                    <button onClick={() => setUserInput("How to control pests?")} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-colors">How to control pests?</button>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-emerald-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.role === 'ai' ? (
                      <div className="prose prose-sm prose-slate">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..." 
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <button 
                onClick={handleSendMessage}
                className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
