'use client'

import React, { useState } from 'react'

interface Order {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PARTIAL'
  timestamp: string
  strategy?: string
}

export function OrderBook() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      symbol: 'RELIANCE',
      type: 'BUY',
      quantity: 10,
      price: 2500,
      status: 'COMPLETED',
      timestamp: '2024-01-15 10:30:00',
      strategy: 'RSI Strategy'
    },
    {
      id: '2',
      symbol: 'TCS',
      type: 'SELL',
      quantity: 5,
      price: 3500,
      status: 'PENDING',
      timestamp: '2024-01-15 10:25:00',
      strategy: 'MACD Strategy'
    },
    {
      id: '3',
      symbol: 'HDFC',
      type: 'BUY',
      quantity: 15,
      price: 1800,
      status: 'PARTIAL',
      timestamp: '2024-01-15 10:20:00',
      strategy: 'Bollinger Bands'
    },
    {
      id: '4',
      symbol: 'INFY',
      type: 'SELL',
      quantity: 8,
      price: 1600,
      status: 'CANCELLED',
      timestamp: '2024-01-15 10:15:00',
      strategy: 'Manual'
    }
  ])

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PARTIAL'>('ALL')

  const filteredOrders = orders.filter(order => 
    filter === 'ALL' || order.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      case 'PARTIAL': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'BUY' ? 'text-green-600' : 'text-red-600'
  }

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id 
        ? { ...order, status: 'CANCELLED' as const }
        : order
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Order Book</h3>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PARTIAL">Partial</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + New Order
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Success Rate</div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((orders.filter(o => o.status === 'COMPLETED').length / orders.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getTypeColor(order.type)}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.strategy || 'Manual'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                    {order.status !== 'PENDING' && (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No orders found</div>
          <div className="text-gray-400 text-sm">Try adjusting your filter or create a new order</div>
        </div>
      )}
    </div>
  )
}

