import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  BarChart,
  Activity,
  Package,
  DollarSign,
  Bell,
  Settings,
  User,
} from "lucide-react";
import Sales from "./sales";
import Inventory from "./inventory";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 p-2 rounded-lg"
          >
            <Package className="h-6 w-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            PS5 Reseller Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-200" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Settings className="h-5 w-5 text-slate-200" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <User className="h-5 w-5 text-slate-200" />
          </motion.button>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="mb-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="profits"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Profits
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Stats Cards */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Total Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-slate-50">24</div>
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <Package className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +2 since last week
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-slate-50">18</div>
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <Activity className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +5 since last week
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-slate-50">
                        $10,842
                      </div>
                      <div className="p-2 bg-purple-500/20 rounded-full">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                      </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +12% since last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Profit Margin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-slate-50">
                        24.8%
                      </div>
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <LineChart className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +2.4% since last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-50">
                      Price Trends
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Average PS5 selling price over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end space-x-2">
                      {/* Simulated chart bars */}
                      {[40, 30, 55, 25, 60, 45, 35, 50, 65, 40, 50, 60].map(
                        (height, i) => (
                          <motion.div
                            key={i}
                            className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full"
                            style={{ height: `${height}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                          />
                        ),
                      )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-50">
                      Sales Velocity
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Units sold per week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end space-x-2">
                      {/* Simulated chart bars */}
                      {[25, 40, 30, 50, 35, 60, 45, 55, 40, 50, 30, 45].map(
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
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>Week 1</span>
                      <span>Week 3</span>
                      <span>Week 5</span>
                      <span>Week 7</span>
                      <span>Week 9</span>
                      <span>Week 11</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Inventory */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-50">
                    Recent Inventory
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Your latest PS5 acquisitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Inventory Item Cards */}
                    {[
                      {
                        id: 1,
                        model: "PS5 Digital Edition",
                        condition: "New",
                        cost: "$399",
                        date: "2023-05-15",
                      },
                      {
                        id: 2,
                        model: "PS5 Disc Edition",
                        condition: "New",
                        cost: "$499",
                        date: "2023-05-12",
                      },
                      {
                        id: 3,
                        model: "PS5 Disc Edition",
                        condition: "Open Box",
                        cost: "$450",
                        date: "2023-05-10",
                      },
                    ].map((item) => (
                      <motion.div
                        key={item.id}
                        className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <h3 className="font-medium text-slate-200">
                          {item.model}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            {item.condition}
                          </span>
                          <span className="text-sm font-bold text-slate-200">
                            {item.cost}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          Added: {item.date}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="inventory">
            <Inventory />
          </TabsContent>

          <TabsContent value="sales">
            <Sales />
          </TabsContent>

          <TabsContent value="profits">
            <div className="text-center py-10">
              <h3 className="text-xl text-slate-400">Profit Tracking</h3>
              <p className="text-slate-500 mt-2">
                Switch to this tab to track your profits
              </p>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="text-center py-10">
              <h3 className="text-xl text-slate-400">Notifications Center</h3>
              <p className="text-slate-500 mt-2">
                Switch to this tab to view your notifications
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </nav>
    </div>
  );
}

export default Home;
