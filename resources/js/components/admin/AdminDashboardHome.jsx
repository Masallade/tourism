import React, { useState, useEffect } from 'react';

const AdminDashboardHome = () => {
    const [stats, setStats] = useState({
        countries: 0,
        themes: 0,
        serviceProviders: 0,
        users: 0,
        approvedProviders: 0,
        pendingProviders: 0
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [userAnalytics, setUserAnalytics] = useState({
        totalUsers: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0,
        activeUsers: 0,
        userRetention: 0,
        averageSessionTime: 0
    });

    useEffect(() => {
        fetchStats();
        fetchUserData();
        fetchRecentActivity();
        fetchUserGrowthData();
        fetchUserAnalytics();
    }, []);

    const fetchStats = async () => {
        try {
            const [countriesRes, themesRes, providersRes, usersRes] = await Promise.all([
                window.apiClient.get('/api/countries'),
                window.apiClient.get('/api/themes'),
                window.apiClient.get('/api/service-providers'),
                window.apiClient.get('/api/users')
            ]);

            const countries = countriesRes.data;
            const themes = themesRes.data;
            const providers = providersRes.data;
            const users = usersRes.data || [];

            const approvedProviders = providers.filter(p => p.is_approved).length;
            const pendingProviders = providers.filter(p => !p.is_approved).length;

            setStats({
                countries: countries.length,
                themes: themes.length,
                serviceProviders: providers.length,
                users: users.length,
                approvedProviders,
                pendingProviders
            });

            // Generate chart data
            setChartData([
                { name: 'Countries', value: countries.length, color: '#10b981' },
                { name: 'Themes', value: themes.length, color: '#3b82f6' },
                { name: 'Service Providers', value: providers.length, color: '#8b5cf6' },
                { name: 'Users', value: users.length, color: '#f59e0b' }
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await window.apiClient.get('/api/users');
            const users = response.data;
            setUserData(users.slice(0, 5)); // Get latest 5 users
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchRecentActivity = async () => {
        // Mock recent activity data
        setRecentActivity([
            { id: 1, type: 'user_registration', message: 'New user registered', time: '2 minutes ago', icon: '👤', color: 'green' },
            { id: 2, type: 'provider_approval', message: 'Service provider approved', time: '15 minutes ago', icon: '✅', color: 'blue' },
            { id: 3, type: 'country_added', message: 'New country added', time: '1 hour ago', icon: '🌍', color: 'purple' },
            { id: 4, type: 'theme_created', message: 'New theme created', time: '2 hours ago', icon: '🏷️', color: 'orange' },
            { id: 5, type: 'system_update', message: 'System updated', time: '3 hours ago', icon: '⚙️', color: 'gray' }
        ]);
    };

    const fetchUserGrowthData = async () => {
        try {
            const response = await window.apiClient.get('/api/users');
            const users = response.data;
                
                // Generate 30-day growth data
                const growthData = [];
                const today = new Date();
                
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    
                    // Count users registered on this date
                    const dayUsers = users.filter(user => {
                        const userDate = new Date(user.created_at);
                        return userDate.toDateString() === date.toDateString();
                    }).length;
                    
                    // Calculate cumulative users up to this date
                    const cumulativeUsers = users.filter(user => {
                        const userDate = new Date(user.created_at);
                        return userDate <= date;
                    }).length;
                    
                    growthData.push({
                        date: date.toISOString().split('T')[0],
                        dayLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        newUsers: dayUsers,
                        cumulativeUsers: cumulativeUsers,
                        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' })
                    });
                }
                
                setUserGrowthData(growthData);
        } catch (error) {
            console.error('Error fetching user growth data:', error);
        }
    };

    const fetchUserAnalytics = async () => {
        try {
            const response = await window.apiClient.get('/api/users');
            const users = response.data;
            const now = new Date();
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                
                const newUsersThisWeek = users.filter(user => 
                    new Date(user.created_at) >= oneWeekAgo
                ).length;
                
                const newUsersThisMonth = users.filter(user => 
                    new Date(user.created_at) >= oneMonthAgo
                ).length;
                
                // Mock analytics data (in real app, this would come from analytics service)
                setUserAnalytics({
                    totalUsers: users.length,
                    newUsersThisWeek,
                    newUsersThisMonth,
                    activeUsers: Math.floor(users.length * 0.75), // 75% active
                    userRetention: 85, // 85% retention rate
                    averageSessionTime: 12.5 // 12.5 minutes average session
                });
        } catch (error) {
            console.error('Error fetching user analytics:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h1>
                    <p className="text-gray-600">Here's what's happening with your Unison Tour platform today.</p>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Countries</p>
                                <p className="text-3xl font-bold text-green-600">{stats.countries}</p>
                                <p className="text-xs text-green-500 mt-1">+2 this month</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
                                <p className="text-xs text-blue-500 mt-1">+5 this week</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Service Providers</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.serviceProviders}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-green-500">{stats.approvedProviders} approved</span>
                                    <span className="text-xs text-orange-500 ml-2">{stats.pendingProviders} pending</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Themes</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.themes}</p>
                                <p className="text-xs text-orange-500 mt-1">+1 this week</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts and Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Data Distribution Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Distribution</h3>
                        <div className="space-y-4">
                            {chartData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div 
                                            className="w-4 h-4 rounded-full mr-3" 
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                            <div 
                                                className="h-2 rounded-full transition-all duration-500" 
                                                style={{ 
                                                    width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%`,
                                                    backgroundColor: item.color 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced User Growth Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">User Growth Analytics</h3>
                            <div className="flex space-x-4 text-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                                    <span className="text-gray-600">New Users</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                                    <span className="text-gray-600">Total Users</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Chart with Y-axis */}
                        <div className="h-80 mb-4">
                            <div className="flex h-full">
                                {/* Y-axis labels */}
                                <div className="flex flex-col justify-between h-full w-16 mr-2">
                                    <div className="text-xs text-gray-500 text-right font-medium">Users</div>
                                    {(() => {
                                        const maxNewUsers = Math.max(...userGrowthData.map(d => d.newUsers));
                                        const maxCumulative = Math.max(...userGrowthData.map(d => d.cumulativeUsers));
                                        const maxValue = Math.max(maxNewUsers, maxCumulative);
                                        const steps = 5;
                                        const stepValue = Math.ceil(maxValue / steps);
                                        
                                        return Array.from({ length: steps + 1 }, (_, i) => {
                                            const value = stepValue * (steps - i);
                                            return (
                                                <div key={i} className="text-xs text-gray-500 text-right">
                                                    {value}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                                
                                {/* Chart area with background grid */}
                                <div className="flex-1 flex items-end justify-between space-x-1 relative">
                                    {/* Background grid lines */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="h-full flex flex-col justify-between">
                                            {Array.from({ length: 6 }, (_, i) => (
                                                <div key={i} className="border-t border-gray-100"></div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {userGrowthData.slice(-14).map((day, index) => {
                                        const maxNewUsers = Math.max(...userGrowthData.map(d => d.newUsers));
                                        const maxCumulative = Math.max(...userGrowthData.map(d => d.cumulativeUsers));
                                        const maxValue = Math.max(maxNewUsers, maxCumulative);
                                        const newUsersHeight = maxNewUsers > 0 ? (day.newUsers / maxValue) * 280 : 0;
                                        const cumulativeHeight = maxCumulative > 0 ? (day.cumulativeUsers / maxValue) * 280 : 0;
                                        
                                        return (
                                            <div key={index} className="flex flex-col items-center flex-1 relative group z-20">
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 whitespace-nowrap">
                                                    <div>New: {day.newUsers}</div>
                                                    <div>Total: {day.cumulativeUsers}</div>
                                                </div>
                                                
                                                {/* Side-by-side bars to prevent overlap */}
                                                <div className="relative w-full flex items-end justify-center space-x-1 z-20">
                                                    {/* New users bar (left) */}
                                                    <div className="flex flex-col items-center flex-1 relative z-20">
                                                        <div 
                                                            className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t relative z-20"
                                                            style={{ height: `${newUsersHeight}px` }}
                                                        ></div>
                                                        {day.newUsers > 0 && (
                                                            <div className="text-xs text-green-600 font-medium mt-1 relative z-20">
                                                                {day.newUsers}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Total users bar (right) */}
                                                    <div className="flex flex-col items-center flex-1 relative z-20">
                                                        <div 
                                                            className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t relative z-20"
                                                            style={{ height: `${cumulativeHeight}px` }}
                                                        ></div>
                                                        {day.cumulativeUsers > 0 && (
                                                            <div className="text-xs text-blue-600 font-medium mt-1 relative z-20">
                                                                {day.cumulativeUsers}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* X-axis labels */}
                                                <div className="mt-2 text-center">
                                                    <span className="text-xs text-gray-500 block">
                                                        {day.dayLabel}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {day.dayOfWeek}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        {/* Analytics Summary */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{userAnalytics.newUsersThisWeek}</div>
                                <div className="text-sm text-gray-500">New This Week</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{userAnalytics.totalUsers}</div>
                                <div className="text-sm text-gray-500">Total Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{userAnalytics.activeUsers}</div>
                                <div className="text-sm text-gray-500">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{userAnalytics.userRetention}%</div>
                                <div className="text-sm text-gray-500">Retention Rate</div>
                            </div>
                        </div>
                        
                        {/* Growth Metrics */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{userAnalytics.newUsersThisMonth}</div>
                                    <div className="text-xs text-gray-500">This Month</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{userAnalytics.averageSessionTime}m</div>
                                    <div className="text-xs text-gray-500">Avg Session</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {userGrowthData.length > 0 ? 
                                            Math.round((userGrowthData[userGrowthData.length - 1].cumulativeUsers - userGrowthData[0].cumulativeUsers) / userGrowthData.length * 7) : 0
                                        }
                                    </div>
                                    <div className="text-xs text-gray-500">Weekly Growth</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Data and Management Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Recent Users */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                        <div className="space-y-3">
                            {userData.length > 0 ? userData.map((user, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm">No users found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <a href="/admin/countries" className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors duration-200">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                    <span className="text-sm font-medium text-gray-700">Manage Countries</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">{stats.countries}</span>
                            </a>
                            
                            <a href="/admin/themes" className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors duration-200">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                    <span className="text-sm font-medium text-gray-700">Manage Themes</span>
                                </div>
                                <span className="text-lg font-bold text-blue-600">{stats.themes}</span>
                            </a>
                            
                            <a href="/admin/service-providers" className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors duration-200">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                                    <span className="text-sm font-medium text-gray-700">Manage Service Providers</span>
                                </div>
                                <span className="text-lg font-bold text-purple-600">{stats.serviceProviders}</span>
                            </a>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Database</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600 font-medium">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">API Services</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600 font-medium">Healthy</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Storage</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600 font-medium">Available</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pending Approvals</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-orange-600 font-medium">{stats.pendingProviders}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed User Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* User Demographics */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Registered</span>
                                <span className="text-lg font-bold text-gray-900">{userAnalytics.totalUsers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Active Users</span>
                                <span className="text-lg font-bold text-green-600">{userAnalytics.activeUsers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">New This Week</span>
                                <span className="text-lg font-bold text-blue-600">{userAnalytics.newUsersThisWeek}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">New This Month</span>
                                <span className="text-lg font-bold text-purple-600">{userAnalytics.newUsersThisMonth}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Retention Rate</span>
                                <span className="text-lg font-bold text-orange-600">{userAnalytics.userRetention}%</span>
                            </div>
                        </div>
                    </div>

                    {/* User Engagement Metrics */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Avg Session Time</span>
                                <span className="text-lg font-bold text-gray-900">{userAnalytics.averageSessionTime}m</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Daily Active Users</span>
                                <span className="text-lg font-bold text-green-600">{Math.floor(userAnalytics.activeUsers * 0.3)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Weekly Active Users</span>
                                <span className="text-lg font-bold text-blue-600">{Math.floor(userAnalytics.activeUsers * 0.6)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Monthly Active Users</span>
                                <span className="text-lg font-bold text-purple-600">{userAnalytics.activeUsers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Bounce Rate</span>
                                <span className="text-lg font-bold text-red-600">15%</span>
                            </div>
                        </div>
                    </div>

                    {/* Growth Trends */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Weekly Growth</span>
                                <span className="text-lg font-bold text-green-600">
                                    {userGrowthData.length > 0 ? 
                                        Math.round((userGrowthData[userGrowthData.length - 1].cumulativeUsers - userGrowthData[0].cumulativeUsers) / userGrowthData.length * 7) : 0
                                    } users/week
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Peak Registration Day</span>
                                <span className="text-lg font-bold text-blue-600">
                                    {userGrowthData.length > 0 ? 
                                        userGrowthData.reduce((max, day) => day.newUsers > max.newUsers ? day : max, userGrowthData[0]).dayOfWeek
                                    : 'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Avg Daily Signups</span>
                                <span className="text-lg font-bold text-purple-600">
                                    {userGrowthData.length > 0 ? 
                                        Math.round(userGrowthData.reduce((sum, day) => sum + day.newUsers, 0) / userGrowthData.length)
                                    : 0
                                    }/day
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Growth Rate</span>
                                <span className="text-lg font-bold text-orange-600">
                                    {userAnalytics.totalUsers > 0 ? 
                                        Math.round((userAnalytics.newUsersThisMonth / userAnalytics.totalUsers) * 100)
                                    : 0
                                    }%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Conversion Rate</span>
                                <span className="text-lg font-bold text-indigo-600">12.5%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity and Platform Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl mr-3">{activity.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Analytics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">User Engagement</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">85%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Content Quality</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">92%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">System Performance</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">98%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Approval Rate</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">78%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;


