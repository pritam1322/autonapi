'use client';

import { Bell, Check, ChevronRight, CircleDollarSign, CloudUpload, Cpu, KeyRound, Plus, SlidersVertical, Ticket, TriangleAlert, Zap } from "lucide-react";
import { useSession } from "next-auth/react"
import { ModeToggle } from "./ModeToggle";

export default function ConsumerDashboard(){

    const { data: session } = useSession();

    return (
        <section id="dashboard" className="min-h-screen py-8 px-4 md:px-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Welcome, {session?.user.name?.split(" ")[0]}!</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Here&apos;s an overview of your API usage</p>
                </div>
                
                {/* Dark Mode Toggle & Notifications */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                    {/* Notifications Button */}
                    <button className="p-2 rounded-lg bg-transparent text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 relative">
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    <Bell className="h-4 w-4"/>
                    </button>
                    
                    {/* Dark Mode Toggle */}
                    <ModeToggle />
                </div>
                </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* APIs Subscribed */}
                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                    <Cpu className="h-6 w-6"/>
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Subscribed APIs</p>
                    <p className="text-2xl font-semibold text-slate-800 dark:text-white">7</p>
                    </div>
                </div>
                </div>
                
                {/* API Requests */}
                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                    <CloudUpload className="h-6 w-6"/>
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">API Requests (Today)</p>
                    <p className="text-2xl font-semibold text-slate-800 dark:text-white">2,451</p>
                    </div>
                </div>
                </div>
                
                {/* Credits Remaining */}
                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
                    <CircleDollarSign className="h-6 w-6"/>
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Credits Remaining</p>
                    <p className="text-2xl font-semibold text-slate-800 dark:text-white">358,400</p>
                    </div>
                </div>
                </div>
                
                {/* Active Endpoints */}
                <div className="bg-white dark:bg-stone-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-4">
                    <Zap className="h-6 w-6"/>
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Active Endpoints</p>
                    <p className="text-2xl font-semibold text-slate-800 dark:text-white">23</p>
                    </div>
                </div>
                </div>
            </div>
            
            {/* Recent Activity & Usage Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Usage Trends */}
                <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-xl border border-slate-200 dark:border-slate-700/30 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">API Usage Trends</h2>
                    <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">Daily</button>
                    <button className="px-3 py-1 text-sm bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-md">Weekly</button>
                    <button className="px-3 py-1 text-sm bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-md">Monthly</button>
                    </div>
                </div>
                {/* Chart Placeholder */}
                <div className="h-64 bg-slate-50 dark:bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">API usage daily chart</p>
                    </div>
                </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-slate-200 dark:border-slate-700/30 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Check className="h-4 w-4"/>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">New API Key Generated</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">10 minutes ago</p>
                    </div>
                    </div>
                    
                    <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <CloudUpload className="h-4 w-4"/>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Subscription Upgraded</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago</p>
                    </div>
                    </div>
                    
                    <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <TriangleAlert className="h-4 w-4"/>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Rate Limit Warning</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Yesterday at 11:42 PM</p>
                    </div>
                    </div>
                    
                    <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Ticket className="h-4 w-4"/>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">New API Subscription</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">2 days ago</p>
                    </div>
                    </div>
                </div>
                <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">View All Activity</button>
                </div>
            </div>
            
            {/* Top APIs & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top APIs */}
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-slate-200 dark:border-slate-700/30 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Top APIs by Usage</h2>
                <div className="space-y-4">
                    {/* API Item 1 */}
                    <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-md bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">W</span>
                    </div>
                    <div className="ml-4 flex-grow">
                        <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Weather API</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">42%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                        <div className="bg-blue-600 h-1.5 rounded-full"></div>
                        </div>
                    </div>
                    </div>
                    
                    {/* API Item 2 */}
                    <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-md bg-green-600 flex items-center justify-center">
                        <span className="text-white font-bold">M</span>
                    </div>
                    <div className="ml-4 flex-grow">
                        <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Maps API</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">28%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                        <div className="bg-green-600 h-1.5 rounded-full"></div>
                        </div>
                    </div>
                    </div>
                    
                    {/* API Item 3 */}
                    <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-md bg-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                    </div>
                    <div className="ml-4 flex-grow">
                        <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Authentication API</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">16%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                        <div className="bg-purple-600 h-1.5 rounded-full"></div>
                        </div>
                    </div>
                    </div>
                    
                    {/* API Item 4 */}
                    <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-md bg-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold">P</span>
                    </div>
                    <div className="ml-4 flex-grow">
                        <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Payment Gateway</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">14%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                        <div className="bg-amber-600 h-1.5 rounded-full"></div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-slate-200 dark:border-slate-700/30 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                        <Plus className="h-5 w-5"/>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Add API</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                        <KeyRound className="h-5 w-5"/>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">New API Key</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
                        <SlidersVertical className="h-5 w-5"/>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Settings</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Support</span>
                    </button>
                </div>
                
                {/* Recommended API */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <div className="flex">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Recommended for you</h3>
                        <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">Based on your usage, the Image Processing API would be a great addition to your toolkit.</p>
                        <div className="mt-2">
                        <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                            Learn More
                            <ChevronRight className="h-4 w-4"/>
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
    )
}