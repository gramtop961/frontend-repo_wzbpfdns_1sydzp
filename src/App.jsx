import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n || 0))

function Topbar({ cartCount = 0 }) {
  return (
    <div className="w-full bg-amber-900 text-amber-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tight">WoodenMart</span>
          <span className="hidden sm:inline text-amber-200">Handcrafted wood furniture</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/shop" className="px-3 py-1 rounded hover:bg-amber-800/60">Shop</Link>
          <Link to="/seller" className="px-3 py-1 rounded hover:bg-amber-800/60">Seller</Link>
          <Link to="/admin" className="px-3 py-1 rounded hover:bg-amber-800/60">Admin</Link>
          <div className="relative px-3 py-1 rounded bg-amber-800/60">
            Cart <span className="ml-1 inline-flex items-center justify-center text-xs bg-amber-500 text-black rounded-full w-5 h-5">{cartCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col">
      <div className="aspect-video bg-amber-100 rounded mb-3 overflow-hidden">
        {p.images?.[0] ? (
          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-900/50">No Image</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-amber-900">{p.title}</h3>
        <p className="text-sm text-amber-800/80 line-clamp-2">{p.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-amber-900">{formatINR(p.price)}</span>
        {onAdd && <button onClick={() => onAdd(p)} className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded">Add</button>}
      </div>
    </div>
  )
}

function ProductForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', price: 4999, currency: 'inr', images: [], stock: 10, featured: false })
  const create = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), images: form.images.filter(Boolean) }
    const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setForm({ title: '', description: '', price: 4999, currency: 'inr', images: [], stock: 10, featured: false })
      onCreated && onCreated()
    }
  }
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Add Product</h3>
      <form onSubmit={create} className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
        <input className="border rounded p-2" placeholder="Price (INR)" type="number" step="1" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
        <input className="border rounded p-2 sm:col-span-2" placeholder="Image URL (optional)" value={form.images[0]||''} onChange={e=>setForm({...form,images:[e.target.value]})} />
        <textarea className="border rounded p-2 sm:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <button className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded sm:col-span-2">Create</button>
      </form>
    </div>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-amber-50">
      <Topbar />
      <header className="bg-[url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="bg-amber-900/60">
          <div className="max-w-6xl mx-auto px-4 py-20 text-amber-50">
            <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow">Beautiful Wooden Furniture, Crafted in India</h1>
            <p className="mt-4 max-w-2xl text-amber-100">Shop premium, handcrafted pieces at honest Indian prices. Delivered across India.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/shop" className="bg-amber-500 text-black font-semibold px-5 py-3 rounded">Start Shopping</Link>
              <Link to="/seller" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-3 rounded border border-white/30">I'm a Seller</Link>
              <Link to="/admin" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-3 rounded border border-white/30">Admin</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-amber-900 mb-2">For Users</h3>
          <p className="text-amber-800/80 mb-4">Explore curated collections and enjoy transparent pricing in INR.</p>
          <Link to="/shop" className="text-amber-800 font-semibold">Go to Shop →</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-amber-900 mb-2">For Sellers</h3>
          <p className="text-amber-800/80 mb-4">List your wooden products and reach customers across India.</p>
          <Link to="/seller" className="text-amber-800 font-semibold">Open Seller Panel →</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-amber-900 mb-2">For Admin</h3>
          <p className="text-amber-800/80 mb-4">Manage products and view orders. Use admin ID and password to sign in.</p>
          <Link to="/admin" className="text-amber-800 font-semibold">Admin Dashboard →</Link>
        </div>
      </section>

      <footer className="bg-amber-900 text-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <p>© {new Date().getFullYear()} WoodenMart • Made in India</p>
          <div className="text-sm">Sustainably sourced • Crafted with care</div>
        </div>
      </footer>
    </div>
  )
}

function Shop() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [email, setEmail] = useState('customer@example.com')

  const loadProducts = async () => {
    const res = await fetch(`${API_BASE}/products`)
    const data = await res.json()
    setProducts(data)
  }
  useEffect(() => { loadProducts() }, [])

  const addToCart = (p) => {
    setCart(prev => {
      const id = p.id || p._id
      const found = prev.find(x => x.product_id === id)
      if (found) return prev.map(x => x.product_id === id ? { ...x, quantity: x.quantity + 1 } : x)
      return [...prev, { product_id: id, title: p.title, price: p.price, quantity: 1 }]
    })
  }

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart])

  const checkout = async () => {
    if (cart.length === 0) return
    const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
    const res = await fetch(`${API_BASE}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, customer_email: email }) })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else if (data.success) {
      alert('Payment simulated. Order placed: ' + data.order_id)
      setCart([])
    } else {
      alert('Checkout failed')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Topbar cartCount={cart.reduce((n,i)=>n+i.quantity,0)} />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <section id="catalog">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-amber-900">Catalog</h2>
            <div className="flex items-center gap-3">
              <input className="border rounded p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email for receipt" />
              <div className="text-lg font-bold text-amber-900">Total: {formatINR(total)}</div>
              <button onClick={checkout} className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded">Checkout</button>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="text-amber-800/80">No products yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id || p._id} p={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function Seller() {
  const [products, setProducts] = useState([])
  const refresh = async () => {
    const res = await fetch(`${API_BASE}/products`)
    setProducts(await res.json())
  }
  useEffect(() => { refresh() }, [])
  return (
    <div className="min-h-screen bg-amber-50">
      <Topbar />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <h2 className="text-2xl font-bold text-amber-900">Seller Panel</h2>
        <ProductForm onCreated={refresh} />
        <div className="text-sm text-amber-800/80">Products listed: {products.length}</div>
      </main>
    </div>
  )
}

function Admin() {
  const [email, setEmail] = useState('woodenmart@gmail.com')
  const [password, setPassword] = useState('woodenmart@1')
  const [token, setToken] = useState(localStorage.getItem('wm_token') || '')
  const [orders, setOrders] = useState([])

  const loggedIn = !!token

  const login = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('wm_token', data.token)
      setToken(data.token)
      loadData()
    } else {
      alert('Invalid credentials')
    }
  }

  const loadData = async () => {
    const res = await fetch(`${API_BASE}/orders`)
    if (res.ok) setOrders(await res.json())
  }

  useEffect(() => { if (loggedIn) loadData() }, [loggedIn])

  return (
    <div className="min-h-screen bg-amber-50">
      <Topbar />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <h2 className="text-2xl font-bold text-amber-900">Admin Dashboard</h2>
        {!loggedIn ? (
          <form onSubmit={login} className="bg-white border rounded-lg p-4 max-w-md">
            <div className="mb-3">
              <label className="block text-sm mb-1">Admin Email</label>
              <input className="border rounded p-2 w-full" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Password</label>
              <input className="border rounded p-2 w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded">Sign In</button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              {orders.length === 0 ? (
                <div className="text-amber-800/80">No orders yet.</div>
              ) : (
                <div className="divide-y">
                  {orders.map(o => (
                    <div key={o.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{o.user_email}</div>
                        <div className="text-sm text-amber-800/80">{o.items?.length || 0} items</div>
                      </div>
                      <div className="font-bold">{formatINR(o.total)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Add Product</h3>
              <ProductForm onCreated={() => {}} />
            </div>
            <button onClick={() => { localStorage.removeItem('wm_token'); setToken('') }} className="text-red-700">Log out</button>
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
