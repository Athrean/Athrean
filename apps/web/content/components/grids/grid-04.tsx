"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Wifi,
  Battery,
  Activity,
  Cloud,
  Lock,
  Thermometer,
  Gauge
} from "lucide-react";

// Neomorphic Dashboard Bento - Soft shadows with modern metrics
export default function Grid04() {
  const metrics = [
    { icon: Cpu, label: "CPU Usage", value: 67, unit: "%", color: "#6366F1" },
    { icon: Battery, label: "Battery", value: 84, unit: "%", color: "#10B981" },
    { icon: Thermometer, label: "Temperature", value: 42, unit: "°C", color: "#F59E0B" },
    { icon: Wifi, label: "Network", value: 128, unit: "Mbps", color: "#3B82F6" },
  ];

  const devices = [
    { name: "MacBook Pro", status: "online", ip: "192.168.1.42" },
    { name: "iPhone 15", status: "online", ip: "192.168.1.56" },
    { name: "iPad Air", status: "offline", ip: "192.168.1.89" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#E8EDF5] p-6 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-500 mb-1"
            >
              Good morning, Alex
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-gray-800"
            >
              System Overview
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8EDF5] shadow-[6px_6px_12px_#c5c9d1,-6px_-6px_12px_#ffffff] flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-600" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#E8EDF5] shadow-[6px_6px_12px_#c5c9d1,-6px_-6px_12px_#ffffff] flex items-center justify-center">
              <Cloud className="w-4 h-4 text-gray-600" />
            </div>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Main Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-8 row-span-2 rounded-3xl bg-[#E8EDF5] shadow-[8px_8px_16px_#c5c9d1,-8px_-8px_16px_#ffffff] p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    System Activity
                  </h3>
                  <p className="text-sm text-gray-500">Last 24 hours</p>
                </div>
              </div>
              <div className="flex gap-2">
                {["1H", "24H", "7D"].map((period, i) => (
                  <button
                    key={period}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      i === 1
                        ? "bg-[#E8EDF5] shadow-[inset_4px_4px_8px_#c5c9d1,inset_-4px_-4px_8px_#ffffff] text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-48 flex items-end gap-3 mb-6">
              {[45, 62, 38, 75, 52, 88, 64, 71, 55, 82, 48, 90].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-xl bg-linear-to-t from-indigo-500 to-indigo-300 relative group cursor-pointer"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg"
                  >
                    {h}%
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Avg CPU", value: "54%", trend: "+5%" },
                { label: "Memory", value: "12.4GB", trend: "-2%" },
                { label: "Disk I/O", value: "234MB/s", trend: "+12%" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-[#E8EDF5] shadow-[inset_4px_4px_8px_#c5c9d1,inset_-4px_-4px_8px_#ffffff] p-4"
                >
                  <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-800">
                      {stat.value}
                    </span>
                    <span
                      className={`text-xs ${
                        stat.trend.startsWith("+")
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Metric Cards */}
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="col-span-6 md:col-span-2 rounded-3xl bg-[#E8EDF5] shadow-[8px_8px_16px_#c5c9d1,-8px_-8px_16px_#ffffff] p-5 flex flex-col"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                <metric.icon
                  className="w-5 h-5"
                  style={{ color: metric.color }}
                />
              </div>
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-800">
                {metric.value}
                <span className="text-sm font-normal text-gray-500">
                  {metric.unit}
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="mt-auto pt-4">
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Connected Devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-12 md:col-span-4 rounded-3xl bg-[#E8EDF5] shadow-[8px_8px_16px_#c5c9d1,-8px_-8px_16px_#ffffff] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Connected Devices</h3>
            </div>
            <div className="space-y-3">
              {devices.map((device, i) => (
                <motion.div
                  key={device.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        device.status === "online"
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {device.name}
                      </div>
                      <div className="text-xs text-gray-500">{device.ip}</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-lg ${
                      device.status === "online"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {device.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
