import { useEffect, useState } from 'react'
import './App.css'

type TestItem = {
  id: number
  message: string
  time: string
}

function App() {
  const [data, setData] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = `${import.meta.env.BASE_URL}api/test-data`
  console.log(import.meta.env.BASE_URL)
  console.log(apiUrl)
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const payload = (await response.json()) as TestItem[]
        setData(payload)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [apiUrl])

  return (
    <main className="container">
      <h1>Web2 status</h1>
      <p className="muted">
        Base URL: {import.meta.env.BASE_URL} • API: {apiUrl}
      </p>

      {loading && <p>Loading test data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <ul className="card">
          {data.map((item) => (
            <li key={item.id}>
              <strong>{item.message}</strong>
              <div className="muted">
                {new Date(item.time).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="muted">No data received yet.</p>
      )}
    </main>
  )
}

export default App
