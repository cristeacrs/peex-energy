import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp, TrendingDown, DollarSign, Battery, LogOut, Sun, Moon, ShoppingCart, Store } from 'lucide-react';
import SellEnergyForm from './SellEnergyForm';
import EnergyListings from './EnergyListings';

interface DashboardProps {
  userType: 'buyer' | 'seller';
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userType, onLogout }) => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  // Sample data for charts
  const energyData = [
    { month: 'Jan', purchased: 240, sold: 140, price: 0.12 },
    { month: 'Feb', purchased: 300, sold: 180, price: 0.14 },
    { month: 'Mar', purchased: 280, sold: 220, price: 0.13 },
    { month: 'Apr', purchased: 390, sold: 290, price: 0.15 },
    { month: 'May', purchased: 320, sold: 250, price: 0.16 },
    { month: 'Jun', purchased: 450, sold: 380, price: 0.18 },
  ];

  const pieData = [
    { name: 'Solar', value: 35, color: '#f59e0b' },
    { name: 'Wind', value: 25, color: '#06b6d4' },
    { name: 'Hydro', value: 20, color: '#3b82f6' },
    { name: 'Grid', value: 20, color: '#6b7280' },
  ];

  const recentTransactions = [
    { id: 1, type: 'Purchase', amount: '45 kWh', price: '$7.20', time: '2 hours ago' },
    { id: 2, type: 'Sale', amount: '30 kWh', price: '$5.40', time: '4 hours ago' },
    { id: 3, type: 'Purchase', amount: '60 kWh', price: '$10.80', time: '1 day ago' },
  ];

  const stats = [
    {
      title: userType === 'buyer' ? 'Energy Purchased' : 'Energy Sold',
      value: userType === 'buyer' ? '1,245 kWh' : '986 kWh',
      change: '+12.5%',
      trend: 'up',
      icon: Battery
    },
    {
      title: 'Monthly Savings',
      value: '$142.30',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Average Price',
      value: '$0.15/kWh',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp
    },
    {
      title: 'Active Contracts',
      value: '8',
      change: '+3',
      trend: 'up',
      icon: Zap
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-marine-50 to-ocean-50 dark:from-marine-950 dark:to-ocean-950">
        {/* Header */}
        <header className="bg-white/80 dark:bg-marine-900/80 backdrop-blur-lg border-b border-marine-200 dark:border-marine-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-ocean-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-marine-900 dark:text-white">peex.ro</h1>
                <p className="text-sm text-marine-600 dark:text-marine-300 capitalize">{userType} Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="text-marine-600 hover:text-marine-900 dark:text-marine-300 dark:hover:text-white"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-marine-300 text-marine-700 hover:bg-marine-100 dark:border-marine-600 dark:text-marine-300 dark:hover:bg-marine-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass border-marine-200/50 dark:border-marine-700/50 hover:shadow-lg transition-all duration-300 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-marine-600 dark:text-marine-300">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-marine-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-marine-900 dark:text-white">{stat.value}</div>
                  <div className={`text-xs flex items-center mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-marine-800/50">
              <TabsTrigger value="dashboard" className="text-marine-700 data-[state=active]:bg-ocean-500 data-[state=active]:text-white dark:text-marine-300">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="text-marine-700 data-[state=active]:bg-ocean-500 data-[state=active]:text-white dark:text-marine-300">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="sell" className="text-marine-700 data-[state=active]:bg-ocean-500 data-[state=active]:text-white dark:text-marine-300">
                <Store className="h-4 w-4 mr-2" />
                Sell Energy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Energy Trends */}
                <Card className="glass border-marine-200/50 dark:border-marine-700/50">
                  <CardHeader>
                    <CardTitle className="text-marine-900 dark:text-white">Energy Trends</CardTitle>
                    <CardDescription className="text-marine-600 dark:text-marine-300">
                      Monthly energy trading activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0369a1" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#075985" />
                        <YAxis stroke="#075985" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)', 
                            border: '1px solid #0369a1',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey={userType === 'buyer' ? 'purchased' : 'sold'} 
                          stroke="#06b6d4" 
                          fill="#06b6d4" 
                          fillOpacity={0.3}
                          name={userType === 'buyer' ? 'Purchased (kWh)' : 'Sold (kWh)'}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Price Trends */}
                <Card className="glass border-marine-200/50 dark:border-marine-700/50">
                  <CardHeader>
                    <CardTitle className="text-marine-900 dark:text-white">Price Trends</CardTitle>
                    <CardDescription className="text-marine-600 dark:text-marine-300">
                      Average energy prices over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0369a1" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#075985" />
                        <YAxis stroke="#075985" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)', 
                            border: '1px solid #0369a1',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                          name="Price ($/kWh)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Energy Sources */}
                <Card className="glass border-marine-200/50 dark:border-marine-700/50">
                  <CardHeader>
                    <CardTitle className="text-marine-900 dark:text-white">Energy Sources</CardTitle>
                    <CardDescription className="text-marine-600 dark:text-marine-300">
                      Distribution of energy sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="lg:col-span-2 glass border-marine-200/50 dark:border-marine-700/50">
                  <CardHeader>
                    <CardTitle className="text-marine-900 dark:text-white">Recent Transactions</CardTitle>
                    <CardDescription className="text-marine-600 dark:text-marine-300">
                      Your latest energy trading activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-marine-800/50 rounded-lg border border-marine-200/30 dark:border-marine-700/30">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'Purchase' ? 'bg-ocean-100 dark:bg-ocean-900' : 'bg-green-100 dark:bg-green-900'
                            }`}>
                              {transaction.type === 'Purchase' ? 
                                <TrendingDown className="h-4 w-4 text-ocean-600 dark:text-ocean-400" /> : 
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-marine-900 dark:text-white">{transaction.type}</p>
                              <p className="text-sm text-marine-600 dark:text-marine-300">{transaction.amount}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-marine-900 dark:text-white">{transaction.price}</p>
                            <p className="text-sm text-marine-500 dark:text-marine-400">{transaction.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="marketplace">
              <EnergyListings />
            </TabsContent>

            <TabsContent value="sell">
              <SellEnergyForm />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
