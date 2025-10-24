import React from 'react'
import { motion } from 'framer-motion'

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl font-bold">Smart Forex AutoTrade AI</h1>
        <p className="text-gray-300 mt-3">Frontend loaded — deploy ready ✅</p>
      </motion.div>
    </div>
  )
}
