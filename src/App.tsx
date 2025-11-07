import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">
              🔐 Sign API
            </h1>
            <p className="text-lg text-slate-600">
              Dijital İmza Yönetim Arayüzü
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Test Counter</p>
              <button
                onClick={() => setCount((count) => count + 1)}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Count is {count}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              🚀 React + Vite + TypeScript + Tailwind + shadcn/ui
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

