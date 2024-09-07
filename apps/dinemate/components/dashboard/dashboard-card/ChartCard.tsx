"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartData as defaultChartData } from "~/lib/dummyOrders";
import { ordersService } from "~/modules";

const ChartCard: React.FC = () => {

  const [chartData, setChartData] = useState(defaultChartData)

  const handleGetChartData = async () => {
    const data = await ordersService.getWeeklySales()
    if (data) {
      setChartData(data)
    }
  }

  useEffect(() => {
    handleGetChartData()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-gray-700 text-lg font-semibold mb-2">Weekly Sales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend
            align="right"
            verticalAlign="top"
            iconType="circle"
            wrapperStyle={{ paddingLeft: 20 }}
          />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#4285F4"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#EA4335"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;
