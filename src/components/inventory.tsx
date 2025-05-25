import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Package,
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
  Check,
  ChevronRight,
  Save,
  Layers,
  Box,
  Warehouse,
  Home,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
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
import { Checkbox } from "@/components/ui/checkbox";
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

interface PS5Item {
  id: number;
  model: string;
  condition: string;
  color: string;
  purchasePrice: number;
  purchaseDate: string;
  purchasePlatform: string;
  controllerCount: number;
  accessories: string[];
  serialNumber: string;
  hasWarranty: boolean;
  hasReceipt: boolean;
  notes: string;
  status: "In Stock" | "Listed" | "Sold";
  storageLocation: "Hauptlager" | "Heimlager" | "Extern";
}

export const defaultItems: PS5Item[] = [
  {
    id: 1,
    model: "PS5 Digital Edition",
    condition: "New",
    color: "Standard White",
    purchasePrice: 399,
    purchaseDate: "2023-05-15",
    purchasePlatform: "Best Buy",
    controllerCount: 1,
    accessories: ["HDMI Cable", "Power Cable"],
    serialNumber: "PS5-1234-5678-90AB",
    hasWarranty: true,
    hasReceipt: true,
    notes: "Sealed in box",
    status: "In Stock",
    storageLocation: "Hauptlager",
  },
  {
    id: 2,
    model: "PS5 Disc Edition",
    condition: "New",
    color: "Standard White",
    purchasePrice: 499,
    purchaseDate: "2023-05-12",
    purchasePlatform: "GameStop",
    controllerCount: 2,
    accessories: ["HDMI Cable", "Power Cable", "Charging Station"],
    serialNumber: "PS5-2345-6789-01BC",
    hasWarranty: true,
    hasReceipt: true,
    notes: "Bundle with extra controller",
    status: "Listed",
    storageLocation: "Hauptlager",
  },
  {
    id: 3,
    model: "PS5 Disc Edition",
    condition: "Open Box",
    color: "Standard White",
    purchasePrice: 450,
    purchaseDate: "2023-05-10",
    purchasePlatform: "Amazon",
    controllerCount: 1,
    accessories: ["HDMI Cable", "Power Cable"],
    serialNumber: "PS5-3456-7890-12CD",
    hasWarranty: true,
    hasReceipt: false,
    notes: "Box opened but never used",
    status: "In Stock",
    storageLocation: "Hauptlager",
  },
  {
    id: 4,
    model: "PS5 Digital Edition",
    condition: "Used",
    color: "Standard White",
    purchasePrice: 350,
    purchaseDate: "2023-05-08",
    purchasePlatform: "Facebook Marketplace",
    controllerCount: 1,
    accessories: ["HDMI Cable", "Power Cable"],
    serialNumber: "PS5-4567-8901-23DE",
    hasWarranty: false,
    hasReceipt: false,
    notes: "Light use, excellent condition",
    status: "Sold",
    storageLocation: "Hauptlager",
  },
];

const accessoryOptions = [
  "HDMI Cable",
  "Power Cable",
  "Charging Station",
  "Media Remote",
  "HD Camera",
  "Pulse 3D Headset",
  "DualSense Controller",
  "Console Cover",
];

const platformOptions = [
  "Amazon",
  "eBay",
  "Best Buy",
  "GameStop",
  "Walmart",
  "Target",
  "Facebook Marketplace",
  "Craigslist",
  "StockX",
  "Other",
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-blue-500/20 text-blue-400";
    case "Listed":
      return "bg-amber-500/20 text-amber-400";
    case "Sold":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

// Form Progress Component with enhanced visualization
interface FormProgressProps {
  newItem: Partial<PS5Item>;
}

const FormProgress: React.FC<FormProgressProps> = ({ newItem }) => {
  // Calculate completion percentage
  const calculateCompletion = () => {
    let total = 0;
    let completed = 0;

    // Required fields
    if (newItem.model) completed++;
    if (newItem.condition) completed++;
    if (newItem.purchasePrice) completed++;
    if (newItem.purchaseDate) completed++;
    if (newItem.purchasePlatform) completed++;
    total += 5;

    // Optional fields
    if (newItem.serialNumber) completed++;
    if (newItem.notes && newItem.notes.length > 0) completed++;
    if (newItem.accessories && newItem.accessories.length > 0) completed++;
    total += 3;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();
  const progressColor =
    completion < 50
      ? "bg-red-500"
      : completion < 80
        ? "bg-amber-500"
        : "bg-green-500";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">Formular-Fortschritt</span>
        <span className="text-xs font-medium text-slate-300">
          {completion}%
        </span>
      </div>
      <Progress value={completion} className={`h-1.5 ${progressColor}`} />
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

export default function Inventory() {
  const [items, setItems] = useState<PS5Item[]>(defaultItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<PS5Item>>({
    model: "PS5 Disc Edition",
    condition: "New",
    color: "Standard White",
    purchasePrice: 499,
    purchaseDate: new Date().toISOString().split("T")[0],
    purchasePlatform: "Best Buy",
    controllerCount: 1,
    accessories: ["HDMI Cable", "Power Cable"],
    serialNumber: "",
    hasWarranty: true,
    hasReceipt: true,
    notes: "",
    status: "In Stock",
    storageLocation: "Hauptlager",
  });

  const handleAddItem = () => {
    const itemToAdd = {
      ...newItem,
      id: Math.max(0, ...items.map((item) => item.id)) + 1,
    } as PS5Item;

    setItems([itemToAdd, ...items]);
    setIsAddModalOpen(false);
    resetNewItem();
  };

  const resetNewItem = () => {
    setNewItem({
      model: "PS5 Disc Edition",
      condition: "New",
      color: "Standard White",
      purchasePrice: 499,
      purchaseDate: new Date().toISOString().split("T")[0],
      purchasePlatform: "Best Buy",
      controllerCount: 1,
      accessories: ["HDMI Cable", "Power Cable"],
      serialNumber: "",
      hasWarranty: true,
      hasReceipt: true,
      notes: "",
      status: "In Stock",
      storageLocation: "Hauptlager",
    });
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purchasePlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const toggleAccessory = (accessory: string) => {
    const currentAccessories = newItem.accessories || [];
    if (currentAccessories.includes(accessory)) {
      setNewItem({
        ...newItem,
        accessories: currentAccessories.filter((a) => a !== accessory),
      });
    } else {
      setNewItem({
        ...newItem,
        accessories: [...currentAccessories, accessory],
      });
    }
  };

  const handleWarrantyChange = (hasWarranty: boolean) => {
    setNewItem({
      ...newItem,
      hasWarranty,
    });
  };

  const handleReceiptChange = (hasReceipt: boolean) => {
    setNewItem({
      ...newItem,
      hasReceipt,
    });
  };

  const handleStorageLocationChange = (location: string) => {
    setNewItem({
      ...newItem,
      storageLocation: location,
    });
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
            className="bg-blue-600 p-2 rounded-lg"
          >
            <Package className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Lagerbestand verwalten
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          PS5 hinzufügen
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Lagerbestand durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="In Stock">Auf Lager</SelectItem>
              <SelectItem value="Listed">Inseriert</SelectItem>
              <SelectItem value="Sold">Verkauft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-blue-500 transition-colors">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-slate-200">
                        {item.model}
                      </h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Condition:</span>
                        <span className="text-slate-200">{item.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Color:</span>
                        <span className="text-slate-200">{item.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Controllers:</span>
                        <span className="text-slate-200">
                          {item.controllerCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Purchase:</span>
                        <span className="text-slate-200">
                          ${item.purchasePrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Seriennummer:</span>
                        <span className="text-slate-200">
                          {item.serialNumber || "--"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Garantie:</span>
                        <span
                          className={
                            item.hasWarranty ? "text-green-400" : "text-red-400"
                          }
                        >
                          {item.hasWarranty ? "Ja" : "Nein"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-slate-700 mb-4" />
          <h3 className="text-xl text-slate-400">No items found</h3>
          <p className="text-slate-500 mt-2">
            Try adjusting your search or filter criteria, or add new inventory
            items.
          </p>
        </div>
      )}

      {/* Add PS5 Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[#1e293b] text-slate-50 max-w-5xl max-h-[90vh] overflow-hidden p-0 rounded-xl shadow-2xl inventory-modal">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-[#0d1425] border-r border-[#1e293b] p-0">
              <div className="p-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 p-1.5 rounded">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    PS5 Inventory Manager
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Erfasse alle Details für deine neue PS5
                </p>
              </div>

              <div className="py-4">
                <div className="px-2 mb-4">
                  <h4 className="text-xs uppercase text-slate-500 font-semibold tracking-wider px-3 mb-2">
                    Status
                  </h4>
                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newItem.status === "In Stock" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() =>
                        setNewItem({ ...newItem, status: "In Stock" })
                      }
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Auf Lager</span>
                      {newItem.status === "In Stock" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newItem.status === "Listed" ? "bg-amber-600/20 text-amber-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() =>
                        setNewItem({ ...newItem, status: "Listed" })
                      }
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span>Inseriert</span>
                      {newItem.status === "Listed" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newItem.status === "Sold" ? "bg-green-600/20 text-green-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => setNewItem({ ...newItem, status: "Sold" })}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Verkauft</span>
                      {newItem.status === "Sold" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="px-2 mb-4">
                  <h4 className="text-xs uppercase text-slate-500 font-semibold tracking-wider px-3 mb-2">
                    Lagerort
                  </h4>
                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newItem.storageLocation === "Hauptlager" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => handleStorageLocationChange("Hauptlager")}
                    >
                      <Warehouse className="h-4 w-4" />
                      <span>Hauptlager</span>
                      {newItem.storageLocation === "Hauptlager" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newItem.storageLocation === "Heimlager" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => handleStorageLocationChange("Heimlager")}
                    >
                      <Home className="h-4 w-4" />
                      <span>Heimlager</span>
                      {newItem.storageLocation === "Heimlager" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${newItem.storageLocation === "Extern" ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800/50"}`}
                      onClick={() => handleStorageLocationChange("Extern")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Extern</span>
                      {newItem.storageLocation === "Extern" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-[#1e293b]">
                <FormProgress newItem={newItem} />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto max-h-[80vh] p-6">
              <DialogHeader className="mb-6">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Neue PS5 zum Lagerbestand hinzufügen
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
                        <p>Hilfe zu diesem Formular</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-slate-400 mt-2">
                  Erfasse alle Einkaufsdetails für deine neue PS5
                </p>
              </DialogHeader>

              <Tabs defaultValue="details" className="mb-6">
                <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 mb-6">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-blue-600"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Produktdetails
                  </TabsTrigger>
                  <TabsTrigger
                    value="purchase"
                    className="data-[state=active]:bg-blue-600"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Einkaufsinformationen
                  </TabsTrigger>
                  <TabsTrigger
                    value="accessories"
                    className="data-[state=active]:bg-blue-600"
                  >
                    <Box className="h-4 w-4 mr-2" />
                    Zubehör & Notizen
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Model */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="model"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Modell</span>
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
                                  <p>Wähle das PS5 Modell aus</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                            Erforderlich
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.model === "PS5 Digital Edition"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.model === "PS5 Digital Edition"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  model: "PS5 Digital Edition",
                                })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.model === "PS5 Digital Edition" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                PS5 Digital Edition
                              </span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.model === "PS5 Disc Edition"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.model === "PS5 Disc Edition"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  model: "PS5 Disc Edition",
                                })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.model === "PS5 Disc Edition" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                PS5 Disc Edition
                              </span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.model === "PS5 Slim Digital"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.model === "PS5 Slim Digital"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  model: "PS5 Slim Digital",
                                })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.model === "PS5 Slim Digital" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                PS5 Slim Digital
                              </span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.model === "PS5 Slim Disc"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.model === "PS5 Slim Disc"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  model: "PS5 Slim Disc",
                                })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.model === "PS5 Slim Disc" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                PS5 Slim Disc
                              </span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      {/* Condition */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="condition"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Zustand</span>
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
                                  <p>Wähle den Zustand der PS5</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                            Erforderlich
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.condition === "New"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.condition === "New"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({ ...newItem, condition: "New" })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.condition === "New" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Neu
                              </span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.condition === "Open Box"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.condition === "Open Box"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  condition: "Open Box",
                                })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.condition === "Open Box" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Geöffnet
                              </span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.condition === "Used"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.condition === "Used"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({ ...newItem, condition: "Used" })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.condition === "Used" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Gebraucht
                              </span>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              variant={
                                newItem.condition === "Refurbished"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                newItem.condition === "Refurbished"
                                  ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                              }
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  condition: "Refurbished",
                                })
                              }
                            >
                              <span className="flex items-center">
                                {newItem.condition === "Refurbished" && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Generalüberholt
                              </span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      {/* Color/Edition */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="color"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Farbe/Edition</span>
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
                                  <p>Wähle die Farbe oder Edition der PS5</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <Select
                          value={newItem.color}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, color: value })
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Farbe/Edition auswählen" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="Standard White">
                              Standard White
                            </SelectItem>
                            <SelectItem value="Digital Edition White">
                              Digital Edition White
                            </SelectItem>
                            <SelectItem value="Spider-Man Edition">
                              Spider-Man Edition
                            </SelectItem>
                            <SelectItem value="God of War Edition">
                              God of War Edition
                            </SelectItem>
                            <SelectItem value="30th Anniversary Edition">
                              30th Anniversary Edition
                            </SelectItem>
                            <SelectItem value="Black Cover">
                              Black Cover
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Controller Count */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="controllerCount"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Anzahl Controller</span>
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
                                  <p>Wie viele Controller sind dabei?</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4].map((count) => (
                            <motion.div
                              key={count}
                              className="flex-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  newItem.controllerCount === count
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  newItem.controllerCount === count
                                    ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                                }
                                onClick={() =>
                                  setNewItem({
                                    ...newItem,
                                    controllerCount: count,
                                  })
                                }
                              >
                                {count}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Purchase Platform */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="purchasePlatform"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Einkaufsplattform</span>
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
                                  <p>Wo wurde die PS5 gekauft?</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <Select
                          value={newItem.purchasePlatform}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, purchasePlatform: value })
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Plattform auswählen" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {platformOptions.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Serial Number */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="serialNumber"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Seriennummer</span>
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
                                  <p>Die Seriennummer der PS5</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="serialNumber"
                            placeholder="PS5-XXXX-XXXX-XXXX"
                            value={newItem.serialNumber}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                serialNumber: e.target.value,
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Warranty & Receipt */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Warranty */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="warranty"
                              className="text-slate-300 flex items-center"
                            >
                              <span>Garantie</span>
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
                                    <p>Hat die PS5 noch Garantie?</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                          </div>
                          <div className="flex gap-2">
                            <motion.div
                              className="flex-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  newItem.hasWarranty ? "default" : "outline"
                                }
                                className={
                                  newItem.hasWarranty
                                    ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                                }
                                onClick={() => handleWarrantyChange(true)}
                              >
                                <span className="flex items-center">
                                  {newItem.hasWarranty && (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Ja
                                </span>
                              </Button>
                            </motion.div>
                            <motion.div
                              className="flex-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  !newItem.hasWarranty ? "default" : "outline"
                                }
                                className={
                                  !newItem.hasWarranty
                                    ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                                }
                                onClick={() => handleWarrantyChange(false)}
                              >
                                <span className="flex items-center">
                                  {!newItem.hasWarranty && (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Nein
                                </span>
                              </Button>
                            </motion.div>
                          </div>
                        </div>

                        {/* Receipt */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="receipt"
                              className="text-slate-300 flex items-center"
                            >
                              <span>Kaufbeleg</span>
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
                                    <p>Ist ein Kaufbeleg vorhanden?</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                          </div>
                          <div className="flex gap-2">
                            <motion.div
                              className="flex-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  newItem.hasReceipt ? "default" : "outline"
                                }
                                className={
                                  newItem.hasReceipt
                                    ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                                }
                                onClick={() => handleReceiptChange(true)}
                              >
                                <span className="flex items-center">
                                  {newItem.hasReceipt && (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Ja
                                </span>
                              </Button>
                            </motion.div>
                            <motion.div
                              className="flex-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  !newItem.hasReceipt ? "default" : "outline"
                                }
                                className={
                                  !newItem.hasReceipt
                                    ? "bg-blue-600 w-full border-2 border-blue-500 shadow-md shadow-blue-900/20"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-200 w-full hover:border-blue-500/50 hover:bg-slate-800"
                                }
                                onClick={() => handleReceiptChange(false)}
                              >
                                <span className="flex items-center">
                                  {!newItem.hasReceipt && (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Nein
                                </span>
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Status Preview */}
                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mt-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${getStatusColor(newItem.status)}`}
                          >
                            {newItem.status === "In Stock" && (
                              <Package className="h-4 w-4" />
                            )}
                            {newItem.status === "Listed" && (
                              <Tag className="h-4 w-4" />
                            )}
                            {newItem.status === "Sold" && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-200">
                              {newItem.model}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {newItem.condition} • {newItem.controllerCount}{" "}
                              Controller
                            </p>
                          </div>
                          <Badge
                            className={`ml-auto ${getStatusColor(newItem.status)}`}
                          >
                            {newItem.status === "In Stock" && "Auf Lager"}
                            {newItem.status === "Listed" && "Inseriert"}
                            {newItem.status === "Sold" && "Verkauft"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="purchase" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Purchase Price */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="purchasePrice"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Einkaufspreis (€)</span>
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
                                  <p>Der Einkaufspreis der PS5</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                            Erforderlich
                          </Badge>
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="purchasePrice"
                            type="number"
                            value={newItem.purchasePrice}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                purchasePrice: parseFloat(e.target.value),
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Purchase Date */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="purchaseDate"
                            className="text-slate-300 flex items-center"
                          >
                            <span>Einkaufsdatum</span>
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
                                  <p>Wann wurde die PS5 gekauft?</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="purchaseDate"
                            type="date"
                            value={newItem.purchaseDate}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                purchaseDate: e.target.value,
                              })
                            }
                            className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Purchase Summary */}
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-slate-300 mb-3">
                        Einkaufsübersicht
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Modell:</span>
                          <span className="text-slate-200">
                            {newItem.model}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Einkaufspreis:</span>
                          <span className="text-blue-400 font-medium">
                            €{newItem.purchasePrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Einkaufsdatum:</span>
                          <span className="text-slate-200">
                            {newItem.purchaseDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Plattform:</span>
                          <span className="text-slate-200">
                            {newItem.purchasePlatform}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Garantie:</span>
                          <span
                            className={
                              newItem.hasWarranty
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {newItem.hasWarranty
                              ? "Vorhanden"
                              : "Nicht vorhanden"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Kaufbeleg:</span>
                          <span
                            className={
                              newItem.hasReceipt
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {newItem.hasReceipt
                              ? "Vorhanden"
                              : "Nicht vorhanden"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-medium">
                            Geschätzter Verkaufswert:
                          </span>
                          <span className="text-green-400 font-bold">
                            €{Math.round(newItem.purchasePrice * 1.25)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-slate-400 text-sm">
                            Potentieller Gewinn:
                          </span>
                          <span className="text-green-400 text-sm">
                            €{Math.round(newItem.purchasePrice * 0.25)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="accessories" className="mt-0 space-y-6">
                  {/* Accessories */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 flex items-center">
                        <span>Zubehör</span>
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
                              <p>Welches Zubehör ist dabei?</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {accessoryOptions.map((accessory) => (
                        <motion.div
                          key={accessory}
                          className={`flex items-center space-x-2 p-2 rounded-lg border ${(newItem.accessories || []).includes(accessory) ? "border-blue-500 bg-blue-500/10" : "border-slate-700/50 bg-slate-800/30"}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAccessory(accessory)}
                        >
                          <Checkbox
                            id={`accessory-${accessory}`}
                            checked={(newItem.accessories || []).includes(
                              accessory,
                            )}
                            onCheckedChange={() => toggleAccessory(accessory)}
                            className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <label
                            htmlFor={`accessory-${accessory}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 cursor-pointer"
                          >
                            {accessory}
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="notes"
                        className="text-slate-300 flex items-center"
                      >
                        <span>Notizen</span>
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
                              <p>Zusätzliche Informationen zur PS5</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                    <div className="relative">
                      <Info className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Textarea
                        id="notes"
                        placeholder="Füge weitere Details zu diesem Artikel hinzu..."
                        value={newItem.notes}
                        onChange={(e) =>
                          setNewItem({ ...newItem, notes: e.target.value })
                        }
                        className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetNewItem();
                      }}
                      className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      <X className="h-4 w-4 mr-2" /> Abbrechen
                    </Button>
                  </DialogClose>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                        >
                          <Save className="h-4 w-4 mr-2" /> Als Entwurf
                          speichern
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Speichert den aktuellen Stand als Entwurf</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleAddItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-lg shadow-blue-900/20"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Zum Lagerbestand
                    hinzufügen
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
