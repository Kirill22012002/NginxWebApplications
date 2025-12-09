import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type TestItem = {
  id: number
  message: string
  time: string
}

type LoginResponse = {
  message: string
  time: string
}

type Route = 'home' | 'login'

const computeRoute = (baseUrl: string): Route => {
  if (typeof window === 'undefined') return 'home'

  const trimmedBase = baseUrl === '/' ? '' : baseUrl.replace(/\/+$/, '')
  const path = window.location.pathname
  const relative = trimmedBase && path.startsWith(trimmedBase) ? path.slice(trimmedBase.length) : path
  const clean = relative.replace(/^\/+|\/+$/g, '')

  return clean === 'login' ? 'login' : 'home'
}

function App() {
  const [route, setRoute] = useState<Route>(() => computeRoute(import.meta.env.BASE_URL))
  const [data, setData] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const testDataUrl = `${import.meta.env.BASE_URL}api/test-data`
  const loginUrl = `${import.meta.env.BASE_URL}api/login`

  const navigate = (target: Route) => {
    const targetPath = target === 'home' ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}login`
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', targetPath)
      setRoute(target)
    }
  }

  useEffect(() => {
    const handler = () => setRoute(computeRoute(import.meta.env.BASE_URL))
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(testDataUrl)
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
  }, [testDataUrl])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setLoginLoading(true)
      setLoginError(null)
      setLoginResponse(null)

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`)
      }

      const payload = (await response.json()) as LoginResponse
      setLoginResponse(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setLoginError(message)
    } finally {
      setLoginLoading(false)
    }
  }

  const navigation = useMemo(
    () => [
      { key: 'home', label: 'Главная v1', onClick: () => navigate('home'), active: route === 'home' },
      { key: 'login', label: 'Login', onClick: () => navigate('login'), active: route === 'login' },
    ],
    [route],
  )

  return (
    <main className="container">
      <header className="nav">
        <h1>Web2</h1>
        <nav>
          {navigation.map((item) => (
            <button
              key={item.key}
              className={item.active ? 'nav-btn active' : 'nav-btn'}
              type="button"
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {route === 'home' && (
        <>
          <p className="muted">
            Base URL v1: {import.meta.env.BASE_URL} • API: {testDataUrl}
          </p>

          {loading && <p>Loading test data...</p>}
          {error && <p className="error">Error: {error}</p>}

          {!loading && !error && (
            <ul className="card">
              {data.map((item) => (
                <li key={item.id}>
                  <strong>{item.message}</strong>
                  <div className="muted">{new Date(item.time).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && data.length === 0 && <p className="muted">No data received yet.</p>}
        </>
      )}

      {route === 'login' && (
        <section className="card">
          <h2>Login</h2>
          <p className="muted">POST {loginUrl}</p>

          <form className="form-grid" onSubmit={handleLogin}>
            <label className="field">
              <span>Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="demo"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="secret"
                autoComplete="current-password"
              />
            </label>

            <div className="actions">
              <button type="submit" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Send login request'}
              </button>
            </div>
          </form>

          {loginError && <p className="error">Error: {loginError}</p>}
          {loginResponse && (
            <div className="muted">
              <div>{loginResponse.message}</div>
              <div>{new Date(loginResponse.time).toLocaleString()}</div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default App
