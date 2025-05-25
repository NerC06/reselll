import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  BarChart,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Calendar,
  DollarSign,
  Tag,
  ShoppingBag,
  Truck,
  Info,
  ArrowUpRight,
  TrendingUp,
  Image,
  Package,
  Barcode,
  Check,
  ChevronRight,
  Save,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Receipt,
  CreditCard,
  Percent,
  Star,
  MessageCircle,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// Import inventory items to select from
import { defaultItems as inventoryItems } from "./inventory";

interface SaleItem {
  id: number;
  inventoryId: number;
  model: string;
  condition: string;
  purchasePrice: number;
  sellingPrice: number;
  platformFee: number;
  shippingCost: number;
  saleDate: string;
  platform: string;
  profit: number;
  profitMargin: number;
  buyerRating: number;
  notes: string;
  trackingNumber: string;
  imageUrl?: string;
}

const defaultSales: SaleItem[] = [
  {
    id: 1,
    inventoryId: 4,
    model: "PS5 Digital Edition",
    condition: "Used",
    purchasePrice: 350,
    sellingPrice: 450,
    platformFee: 22.5,
    shippingCost: 15,
    saleDate: "2023-06-10",
    platform: "eBay",
    profit: 62.5,
    profitMargin: 13.9,
    buyerRating: 5,
    notes: "Smooth transaction, buyer was very satisfied",
    trackingNumber: "1Z999AA10123456784",
    imageUrl:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&q=80",
  },
  {
    id: 2,
    inventoryId: 5,
    model: "PS5 Disc Edition",
    condition: "New",
    purchasePrice: 499,
    sellingPrice: 599,
    platformFee: 29.95,
    shippingCost: 20,
    saleDate: "2023-06-08",
    platform: "Amazon",
    profit: 50.05,
    profitMargin: 8.4,
    buyerRating: 4,
    notes: "Buyer complained about packaging but was happy with product",
    trackingNumber: "9405511899560001234567",
    imageUrl:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300&q=80",
  },
  {
    id: 3,
    inventoryId: 6,
    model: "PS5 Slim Disc",
    condition: "New",
    purchasePrice: 479,
    sellingPrice: 629,
    platformFee: 31.45,
    shippingCost: 18,
    saleDate: "2023-06-05",
    platform: "eBay",
    profit: 100.55,
    profitMargin: 16,
    buyerRating: 5,
    notes: "Fast payment, great communication",
    trackingNumber: "1Z999AA10123456785",
    imageUrl:
      "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300&q=80",
  },
];

const platformOptions = [
  "Amazon",
  "eBay",
  "Facebook Marketplace",
  "Kleinanzeigen",
  "StockX",
  "Direktverkauf",
  "Andere",
];

// Form Progress Component
const FormProgress = ({ newSale }) => {
  // Calculate completion percentage
  const calculateCompletion = () => {
    let total = 0;
    let completed = 0;

    // Required fields
    if (newSale.model) completed++;
    if (newSale.condition) completed++;
    if (newSale.sellingPrice) completed++;
    if (newSale.platformFee) completed++;
    if (newSale.shippingCost) completed++;
    if (newSale.saleDate) completed++;
    if (newSale.platform) completed++;
    total += 7;

    // Optional fields
    if (newSale.trackingNumber) completed++;
    if (newSale.imageUrl) completed++;
    if (newSale.notes && newSale.notes.length > 0) completed++;
    if (newSale.buyerRating > 0) completed++;
    total += 4;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">Formular-Fortschritt</span>
        <span className="text-xs font-medium text-slate-300">
          {completion}%
        </span>
      </div>
      <Progress value={completion} className="h-1.5" />
      <div className="flex justify-between items-center mt-2">
        {completion < 100 ? (
          <span className="text-xs text-slate-500">Fülle alle Felder aus</span>
        ) : (
          <span className="text-xs text-green-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Bereit zum Hinzufügen
          </span>
        )}
        {completion >= 80 && completion < 100 && (
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Fast fertig
          </span>
        )}
        {completion < 80 && (
          <span className="text-xs text-slate-500">Mehr Infos benötigt</span>
        )}
      </div>
    </div>
  );
};

export default function Sales() {
  const [sales, setSales] = useState<SaleItem[]>(defaultSales);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [newSale, setNewSale] = useState<Partial<SaleItem>>({
    model: "PS5 Disc Edition",
    condition: "New",
    purchasePrice: 499,
    sellingPrice: 599,
    platformFee: 30,
    shippingCost: 15,
    saleDate: new Date().toISOString().split("T")[0],
    platform: "eBay",
    buyerRating: 5,
    notes: "",
    trackingNumber: "",
    imageUrl: "",
  });

  const handleAddSale = () => {
    const profit =
      (newSale.sellingPrice || 0) -
      (newSale.purchasePrice || 0) -
      (newSale.platformFee || 0) -
      (newSale.shippingCost || 0);

    const profitMargin = newSale.sellingPrice
      ? (profit / newSale.sellingPrice) * 100
      : 0;

    const saleToAdd = {
      ...newSale,
      id: Math.max(0, ...sales.map((sale) => sale.id)) + 1,
      inventoryId: selectedInventoryItem
        ? selectedInventoryItem.id
        : Math.floor(Math.random() * 100) + 10,
      profit,
      profitMargin,
    } as SaleItem;

    setSales([saleToAdd, ...sales]);
    setIsAddModalOpen(false);
    resetNewSale();
    setSelectedInventoryItem(null);
    setActiveStep(1);
  };

  const resetNewSale = () => {
    setNewSale({
      model: "PS5 Disc Edition",
      condition: "New",
      purchasePrice: 499,
      sellingPrice: 599,
      platformFee: 30,
      shippingCost: 15,
      saleDate: new Date().toISOString().split("T")[0],
      platform: "eBay",
      buyerRating: 5,
      notes: "",
      trackingNumber: "",
      imageUrl: "",
    });
  };

  const handleDeleteSale = (id: number) => {
    setSales(sales.filter((sale) => sale.id !== id));
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter
      ? sale.platform === platformFilter
      : true;

    return matchesSearch && matchesPlatform;
  });

  const calculateProfit = () => {
    if (
      newSale.sellingPrice &&
      newSale.purchasePrice &&
      newSale.platformFee &&
      newSale.shippingCost
    ) {
      return (
        newSale.sellingPrice -
        newSale.purchasePrice -
        newSale.platformFee -
        newSale.shippingCost
      );
    }
    return 0;
  };

  const profit = calculateProfit();
  const profitMargin = newSale.sellingPrice
    ? (profit / newSale.sellingPrice) * 100
    : 0;

  // Calculate total stats
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const avgProfitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Get status color for badges
  const getStatusColor = (platform) => {
    switch (platform) {
      case "eBay":
        return "bg-blue-600/20 text-blue-400";
      case "Amazon":
        return "bg-amber-600/20 text-amber-400";
      case "StockX":
        return "bg-green-600/20 text-green-400";
      case "Facebook Marketplace":
        return "bg-indigo-600/20 text-indigo-400";
      case "Kleinanzeigen":
        return "bg-orange-600/20 text-orange-400";
      case "Direktverkauf":
        return "bg-purple-600/20 text-purple-400";
      default:
        return "bg-slate-600/20 text-slate-400";
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "eBay":
        return <ShoppingBag className="h-4 w-4" />;
      case "Amazon":
        return <ShoppingCart className="h-4 w-4" />;
      case "StockX":
        return <Tag className="h-4 w-4" />;
      case "Facebook Marketplace":
        return <MessageCircle className="h-4 w-4" />;
      case "Kleinanzeigen":
        return <FileText className="h-4 w-4" />;
      case "Direktverkauf":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  // Next step handler
  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-600 p-2 rounded-lg"
          >
            <BarChart className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Verkaufsübersicht
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-green-900/20"
        >
          <Plus className="h-5 w-5" />
          Verkauf hinzufügen
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-slate-900 border-slate-800 hover:border-green-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Verkäufe gesamt</p>
                  <h3 className="text-2xl font-bold text-slate-100">
                    {totalSales}
                  </h3>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <Tag className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-slate-900 border-slate-800 hover:border-green-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Umsatz gesamt</p>
                  <h3 className="text-2xl font-bold text-slate-100">
                    €{totalRevenue.toFixed(2)}
                  </h3>
                </div>
                <div className="p-2 bg-green-500/20 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-slate-900 border-slate-800 hover:border-green-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Gewinn gesamt</p>
                  <h3 className="text-2xl font-bold text-green-400">
                    €{totalProfit.toFixed(2)}
                  </h3>
                </div>
                <div className="p-2 bg-green-500/20 rounded-full">
                  <ArrowUpRight className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-slate-900 border-slate-800 hover:border-green-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Durchschn. Marge</p>
                  <h3 className="text-2xl font-bold text-blue-400">
                    {avgProfitMargin.toFixed(1)}%
                  </h3>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Verkäufe durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={platformFilter || "all"}
            onValueChange={(value) =>
              setPlatformFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Nach Plattform filtern" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">Alle Plattformen</SelectItem>
              {platformOptions.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sales Analysis Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="bg-slate-900 border border-slate-800 mb-4">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Verkaufsliste
          </TabsTrigger>
          <TabsTrigger
            value="chart"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Verkaufsdiagramm
          </TabsTrigger>
          <TabsTrigger
            value="platforms"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Plattformanalyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          {/* Sales Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredSales.map((sale) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-green-500/50 transition-colors">
                    <CardContent className="p-0">
                      {sale.imageUrl && (
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={sale.imageUrl}
                            alt={sale.model}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className={getStatusColor(sale.platform)}>
                              <span className="flex items-center gap-1">
                                {getPlatformIcon(sale.platform)}
                                {sale.platform}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-slate-200">
                            {sale.model}
                          </h3>
                          <Badge className="bg-green-500/20 text-green-400">
                            Verkauft
                          </Badge>
                        </div>

                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Zustand:</span>
                            <span className="text-slate-200">
                              {sale.condition}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              Verkaufsdatum:
                            </span>
                            <span className="text-slate-200">
                              {sale.saleDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Einkauf:</span>
                            <span className="text-slate-200">
                              €{sale.purchasePrice}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Verkauf:</span>
                            <span className="text-green-400">
                              €{sale.sellingPrice}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Gewinn:</span>
                            <span className="text-blue-400">
                              €{sale.profit.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Marge:</span>
                            <span className="text-blue-400">
                              {sale.profitMargin.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          >
                            <Edit className="h-4 w-4 mr-1" /> Bearbeiten
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => handleDeleteSale(sale.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Löschen
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="chart" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-4">
                Verkaufstrend
              </h3>
              <div className="h-[300px] flex items-end space-x-2">
                {/* Simulated chart bars */}
                {[40, 65, 35, 50, 70, 45, 60, 55, 75, 50, 65, 80].map(
                  (height, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-t from-green-600 to-green-400 rounded-t w-full"
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                    />
                  ),
                )}
              </div>
              <div className="flex justify-between mt-4 text-xs text-slate-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mär</span>
                <span>Apr</span>
                <span>Mai</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Okt</span>
                <span>Nov</span>
                <span>Dez</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">
                  Verkäufe nach Plattform
                </h3>
                <div className="space-y-4">
                  {platformOptions.map((platform, index) => {
                    const count = sales.filter(
                      (s) => s.platform === platform,
                    ).length;
                    const percentage =
                      sales.length > 0 ? (count / sales.length) * 100 : 0;
                    return (
                      <div key={platform} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-300 flex items-center gap-2">
                            {getPlatformIcon(platform)}
                            {platform}
                          </span>
                          <span className="text-slate-400">
                            {count} Verkäufe
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">
                  Gewinn nach Plattform
                </h3>
                <div className="space-y-4">
                  {platformOptions.map((platform, index) => {
                    const platformSales = sales.filter(
                      (s) => s.platform === platform,
                    );
                    const totalProfit = platformSales.reduce(
                      (sum, sale) => sum + sale.profit,
                      0,
                    );
                    const maxProfit = Math.max(
                      ...platformOptions.map((p) =>
                        sales
                          .filter((s) => s.platform === p)
                          .reduce((sum, sale) => sum + sale.profit, 0),
                      ),
                      1,
                    );
                    const percentage = (totalProfit / maxProfit) * 100;

                    return (
                      <div key={platform} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-300 flex items-center gap-2">
                            {getPlatformIcon(platform)}
                            {platform}
                          </span>
                          <span className="text-green-400">
                            €{totalProfit.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <BarChart className="h-12 w-12 mx-auto text-slate-700 mb-4" />
          <h3 className="text-xl text-slate-400">Keine Verkäufe gefunden</h3>
          <p className="text-slate-500 mt-2">
            Passe deine Suchkriterien an oder füge neue Verkäufe hinzu.
          </p>
        </div>
      )}

      {/* Add Sale Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[#1e293b] text-slate-50 max-w-5xl max-h-[90vh] overflow-hidden p-0 rounded-xl shadow-2xl sales-modal">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-[#0d1425] border-r border-[#1e293b] p-0">
              <div className="p-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-600 p-1.5 rounded">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    PS5 Verkaufsmanager
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Erfasse alle Details zu deinem PS5-Verkauf
                </p>
              </div>

              <div className="py-4">
                <div className="px-2 mb-4">
                  <h4 className="text-xs uppercase text-slate-500 font-semibold tracking-wider px-3 mb-2">
                    Verkaufsschritte
                  </h4>
                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeStep === 1 ? "bg-green-600/20 text-green-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => setActiveStep(1)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${activeStep === 1 ? "bg-green-600/30" : "bg-slate-700/50"} flex items-center justify-center text-xs font-medium`}
                      >
                        1
                      </div>
                      <span>Artikel auswählen</span>
                      {activeStep === 1 && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeStep === 2 ? "bg-green-600/20 text-green-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => activeStep >= 2 && setActiveStep(2)}
                      disabled={activeStep < 2}
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${activeStep === 2 ? "bg-green-600/30" : activeStep > 2 ? "bg-green-600/20" : "bg-slate-700/50"} flex items-center justify-center text-xs font-medium`}
                      >
                        2
                      </div>
                      <span>Verkaufsdetails</span>
                      {activeStep === 2 && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeStep === 3 ? "bg-green-600/20 text-green-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => activeStep >= 3 && setActiveStep(3)}
                      disabled={activeStep < 3}
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${activeStep === 3 ? "bg-green-600/30" : "bg-slate-700/50"} flex items-center justify-center text-xs font-medium`}
                      >
                        3
                      </div>
                      <span>Versand & Abschluss</span>
                      {activeStep === 3 && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="px-2 mb-4">
                  <h4 className="text-xs uppercase text-slate-500 font-semibold tracking-wider px-3 mb-2">
                    Verkaufsplattform
                  </h4>
                  <div className="space-y-1">
                    {platformOptions.slice(0, 5).map((platform) => (
                      <button
                        key={platform}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newSale.platform === platform ? "bg-green-600/20 text-green-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                        onClick={() => setNewSale({ ...newSale, platform })}
                      >
                        <div
                          className={`p-1 rounded ${getStatusColor(platform)}`}
                        >
                          {getPlatformIcon(platform)}
                        </div>
                        <span>{platform}</span>
                        {newSale.platform === platform && (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-[#1e293b]">
                <FormProgress newSale={newSale} />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto max-h-[80vh]">
              {/* Step 1: Select Inventory Item */}
              {activeStep === 1 && (
                <div className="p-6">
                  <DialogHeader className="mb-6">
                    <div className="flex justify-between items-center">
                      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        PS5 aus Inventar auswählen
                      </DialogTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full h-8 w-8 bg-slate-800/50"
                            >
                              <HelpCircle className="h-4 w-4 text-slate-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Wähle eine PS5 aus deinem Lagerbestand</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-slate-400 mt-2">
                      Wähle eine PS5 aus deinem Lagerbestand oder füge einen
                      neuen Verkauf hinzu
                    </p>
                  </DialogHeader>

                  {/* Inventory Item Selection */}
                  <div className="bg-slate-800/30 p-4 rounded-lg mb-6">
                    <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-400" />
                      PS5 aus Inventar auswählen
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Wähle eine PS5 aus deinem Lagerbestand aus
                    </p>

                    <Select
                      value={
                        selectedInventoryItem
                          ? String(selectedInventoryItem.id)
                          : ""
                      }
                      onValueChange={(value) => {
                        const item = inventoryItems.find(
                          (item) => item.id === parseInt(value),
                        );
                        if (item) {
                          setSelectedInventoryItem(item);
                          setNewSale({
                            ...newSale,
                            inventoryId: item.id,
                            model: item.model,
                            condition: item.condition,
                            purchasePrice: item.purchasePrice,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500">
                        <SelectValue placeholder="PS5 aus Inventar auswählen" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {inventoryItems
                          .filter((item) => item.status !== "Sold")
                          .map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.model} - {item.condition} (€
                              {item.purchasePrice})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {selectedInventoryItem && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Package className="h-8 w-8 text-blue-400" />
                          </div>
                          <div>
                            <h5 className="font-medium text-slate-200">
                              {selectedInventoryItem.model}
                            </h5>
                            <p className="text-sm text-slate-400">
                              {selectedInventoryItem.condition} - Einkaufspreis:
                              €{selectedInventoryItem.purchasePrice}
                            </p>
                          </div>
                          <Badge className="ml-auto bg-blue-500/20 text-blue-400">
                            Ausgewählt
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                          <div>
                            <p className="text-xs text-slate-500">
                              Seriennummer
                            </p>
                            <p className="text-sm text-slate-300">
                              {selectedInventoryItem.serialNumber || "--"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">
                              Einkaufsdatum
                            </p>
                            <p className="text-sm text-slate-300">
                              {selectedInventoryItem.purchaseDate || "--"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Garantie</p>
                            <p className="text-sm text-slate-300">
                              {selectedInventoryItem.hasWarranty
                                ? "Ja"
                                : "Nein"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Controller</p>
                            <p className="text-sm text-slate-300">
                              {selectedInventoryItem.controllerCount || 0}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Manual Entry Option */}
                  <div className="bg-slate-800/30 p-4 rounded-lg mb-6">
                    <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <Edit className="h-4 w-4 text-green-400" />
                      Manuelle Eingabe
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Wenn die PS5 nicht im Inventar ist, kannst du die Details
                      manuell eingeben
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Model */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="model"
                          className="text-slate-300 flex items-center"
                        >
                          <span>Modell</span>
                        </Label>
                        <Select
                          value={newSale.model}
                          onValueChange={(value) =>
                            setNewSale({ ...newSale, model: value })
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500">
                            <SelectValue placeholder="Modell auswählen" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="PS5 Digital Edition">
                              PS5 Digital Edition
                            </SelectItem>
                            <SelectItem value="PS5 Disc Edition">
                              PS5 Disc Edition
                            </SelectItem>
                            <SelectItem value="PS5 Slim Digital">
                              PS5 Slim Digital
                            </SelectItem>
                            <SelectItem value="PS5 Slim Disc">
                              PS5 Slim Disc
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Condition */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="condition"
                          className="text-slate-300 flex items-center"
                        >
                          <span>Zustand</span>
                        </Label>
                        <Select
                          value={newSale.condition}
                          onValueChange={(value) =>
                            setNewSale({ ...newSale, condition: value })
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500">
                            <SelectValue placeholder="Zustand auswählen" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="New">Neu</SelectItem>
                            <SelectItem value="Open Box">Geöffnet</SelectItem>
                            <SelectItem value="Used">Gebraucht</SelectItem>
                            <SelectItem value="Refurbished">
                              Generalüberholt
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Purchase Price */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="purchasePrice"
                          className="text-slate-300 flex items-center"
                        >
                          <span>Einkaufspreis (€)</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="purchasePrice"
                            type="number"
                            value={newSale.purchasePrice}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                purchasePrice: parseFloat(e.target.value),
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        resetNewSale();
                        setSelectedInventoryItem(null);
                        setActiveStep(1);
                      }}
                      className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      <X className="h-4 w-4 mr-2" /> Abbrechen
                    </Button>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleNextStep}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 shadow-lg shadow-green-900/20"
                        disabled={
                          !newSale.model ||
                          !newSale.condition ||
                          !newSale.purchasePrice
                        }
                      >
                        Weiter <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Step 2: Sales Details */}
              {activeStep === 2 && (
                <div className="p-6">
                  <DialogHeader className="mb-6">
                    <div className="flex justify-between items-center">
                      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        Verkaufsdetails
                      </DialogTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full h-8 w-8 bg-slate-800/50"
                            >
                              <HelpCircle className="h-4 w-4 text-slate-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Gib die Details zum Verkauf ein</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-slate-400 mt-2">
                      Erfasse alle Details zu deinem PS5-Verkauf
                    </p>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Selling Price */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="sellingPrice"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Verkaufspreis (€)</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1"
                                  >
                                    <HelpCircle className="h-3 w-3 text-slate-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Der Verkaufspreis der PS5</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">
                            Erforderlich
                          </Badge>
                        </div>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="sellingPrice"
                            type="number"
                            value={newSale.sellingPrice}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                sellingPrice: parseFloat(e.target.value),
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      {/* Platform Fee */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="platformFee"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Plattformgebühr (€)</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1"
                                  >
                                    <HelpCircle className="h-3 w-3 text-slate-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Gebühren der Verkaufsplattform</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <div className="relative">
                          <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="platformFee"
                            type="number"
                            value={newSale.platformFee}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                platformFee: parseFloat(e.target.value),
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      {/* Shipping Cost */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="shippingCost"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Versandkosten (€)</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1"
                                  >
                                    <HelpCircle className="h-3 w-3 text-slate-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Kosten für den Versand</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <div className="relative">
                          <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="shippingCost"
                            type="number"
                            value={newSale.shippingCost}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                shippingCost: parseFloat(e.target.value),
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      {/* Sale Date */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="saleDate"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Verkaufsdatum</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1"
                                  >
                                    <HelpCircle className="h-3 w-3 text-slate-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Datum des Verkaufs</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="saleDate"
                            type="date"
                            value={newSale.saleDate}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                saleDate: e.target.value,
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Profit Calculation */}
                    <div className="space-y-4">
                      {/* Profit Calculation */}
                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="text-slate-300 font-medium">
                              Gewinnberechnung
                            </h4>
                            <p className="text-slate-400 text-sm">
                              Basierend auf deinen Eingaben
                            </p>
                          </div>
                          <div className="p-2 bg-green-500/20 rounded-full">
                            <Percent className="h-5 w-5 text-green-400" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Verkaufspreis:
                            </span>
                            <span className="text-green-400 font-medium">
                              €{newSale.sellingPrice}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Einkaufspreis:
                            </span>
                            <span className="text-slate-200">
                              €{newSale.purchasePrice}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Plattformgebühr:
                            </span>
                            <span className="text-slate-200">
                              €{newSale.platformFee}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Versandkosten:
                            </span>
                            <span className="text-slate-200">
                              €{newSale.shippingCost}
                            </span>
                          </div>
                          <Separator className="bg-slate-700/50" />
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium">
                              Gewinn:
                            </span>
                            <span
                              className={`text-lg font-bold ${profit > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              €{profit.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Marge:</span>
                            <span
                              className={
                                profit > 0 ? "text-green-400" : "text-red-400"
                              }
                            >
                              {profitMargin.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Image URL */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="imageUrl"
                          className="text-slate-300 flex items-center"
                        >
                          <span>Bild URL</span>
                        </Label>
                        <div className="relative">
                          <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="imageUrl"
                            placeholder="https://example.com/image.jpg"
                            value={newSale.imageUrl}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                imageUrl: e.target.value,
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        {newSale.imageUrl && (
                          <div className="mt-2 p-2 bg-slate-800/50 rounded-lg">
                            <img
                              src={newSale.imageUrl}
                              alt="Produktbild Vorschau"
                              className="w-full h-32 object-cover rounded-md"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 mt-6 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 rotate-180" />{" "}
                      Zurück
                    </Button>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleNextStep}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 shadow-lg shadow-green-900/20"
                        disabled={
                          !newSale.sellingPrice ||
                          !newSale.platformFee ||
                          !newSale.shippingCost ||
                          !newSale.saleDate
                        }
                      >
                        Weiter <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Step 3: Shipping & Completion */}
              {activeStep === 3 && (
                <div className="p-6">
                  <DialogHeader className="mb-6">
                    <div className="flex justify-between items-center">
                      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        Versand & Abschluss
                      </DialogTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full h-8 w-8 bg-slate-800/50"
                            >
                              <HelpCircle className="h-4 w-4 text-slate-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Letzte Details zum Verkauf</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-slate-400 mt-2">
                      Füge Versandinformationen und abschließende Details hinzu
                    </p>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Tracking Number */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="trackingNumber"
                          className="text-slate-300 flex items-center"
                        >
                          <span>Sendungsnummer</span>
                        </Label>
                        <div className="relative">
                          <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="trackingNumber"
                            placeholder="Sendungsnummer eingeben"
                            value={newSale.trackingNumber}
                            onChange={(e) =>
                              setNewSale({
                                ...newSale,
                                trackingNumber: e.target.value,
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>

                      {/* Buyer Rating */}
                      <div className="space-y-2">
                        <Label className="text-slate-300">
                          Käuferbewertung
                        </Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <motion.div
                              key={rating}
                              className="flex-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  newSale.buyerRating === rating
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  newSale.buyerRating === rating
                                    ? "bg-green-600 w-full border-2 border-green-500 shadow-md shadow-green-900/20"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-green-500/50 hover:bg-slate-800"
                                }
                                onClick={() =>
                                  setNewSale({
                                    ...newSale,
                                    buyerRating: rating,
                                  })
                                }
                              >
                                <span className="flex items-center">
                                  {rating}{" "}
                                  <Star className="h-3 w-3 ml-1 text-amber-400" />
                                </span>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="notes"
                          className="text-slate-300 flex items-center"
                        >
                          <span>Notizen</span>
                        </Label>
                        <div className="relative">
                          <Info className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Textarea
                            id="notes"
                            placeholder="Füge weitere Details zu diesem Verkauf hinzu..."
                            value={newSale.notes}
                            onChange={(e) =>
                              setNewSale({ ...newSale, notes: e.target.value })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 min-h-[150px] focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Sale Summary */}
                    <div className="space-y-4">
                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="text-slate-300 font-medium">
                              Verkaufsübersicht
                            </h4>
                            <p className="text-slate-400 text-sm">
                              Zusammenfassung aller Details
                            </p>
                          </div>
                          <div className="p-2 bg-green-500/20 rounded-full">
                            <Receipt className="h-5 w-5 text-green-400" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Modell:</span>
                            <span className="text-slate-200">
                              {newSale.model}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Zustand:</span>
                            <span className="text-slate-200">
                              {newSale.condition}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Plattform:</span>
                            <span className="text-slate-200 flex items-center gap-1">
                              {getPlatformIcon(newSale.platform)}
                              {newSale.platform}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Verkaufsdatum:
                            </span>
                            <span className="text-slate-200">
                              {newSale.saleDate}
                            </span>
                          </div>
                          <Separator className="bg-slate-700/50" />
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Einkaufspreis:
                            </span>
                            <span className="text-slate-200">
                              €{newSale.purchasePrice}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Verkaufspreis:
                            </span>
                            <span className="text-green-400">
                              €{newSale.sellingPrice}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                              Gebühren & Versand:
                            </span>
                            <span className="text-slate-200">
                              €
                              {(newSale.platformFee || 0) +
                                (newSale.shippingCost || 0)}
                            </span>
                          </div>
                          <Separator className="bg-slate-700/50" />
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium">
                              Gewinn:
                            </span>
                            <span
                              className={`text-lg font-bold ${profit > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              €{profit.toFixed(2)} ({profitMargin.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Success Animation */}
                      <motion.div
                        className="bg-green-600/10 border border-green-500/30 rounded-lg p-6 flex flex-col items-center justify-center text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            delay: 0.5,
                          }}
                        >
                          <Sparkles className="h-8 w-8 text-green-400" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-green-400 mb-1">
                          Bereit zum Hinzufügen!
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Alle erforderlichen Informationen wurden erfasst.
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 mt-6 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 rotate-180" />{" "}
                      Zurück
                    </Button>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleAddSale}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 shadow-lg shadow-green-900/20"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Verkauf hinzufügen
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
