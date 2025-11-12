import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar({ cartCount, onAdminToggle }) {
  return (
    <div className="w-full bg-amber-900 text-amber-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tight">WoodenMart</span>
          <span className="hidden sm:inline text-amber-200">Handcrafted wood furniture</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#catalog" className="px-3 py-1 rounded hover:bg-amber-800/60">Shop</a>
          <a href="/test" className="px-3 py-1 rounded hover:bg-amber-800/60">Status</a>
          <button onClick={onAdminToggle} className="px-3 py-1 rounded hover:bg-amber-800/60">Admin</button>
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
        <span className="text-lg font-bold text-amber-900">${Number(p.price).toFixed(2)}</span>
        <button onClick={() => onAdd(p)} className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded">Add</button>
      </div>
    </div>
  )
}

function AdminPanel({ products, refresh }) {
  const [form, setForm] = useState({ title: '', description: '', price: 99.99, currency: 'usd', images: [], stock: 10, featured: false })

  const create = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), images: form.images.filter(Boolean) }
    const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setForm({ title: '', description: '', price: 99.99, currency: 'usd', images: [], stock: 10, featured: false })
      refresh()
    }
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Admin: Add Product</h3>
      <form onSubmit={create} className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
        <input className="border rounded p-2" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
        <input className="border rounded p-2 sm:col-span-2" placeholder="Image URL (optional)" value={form.images[0]||''} onChange={e=>setForm({...form,images:[e.target.value]})} />
        <textarea className="border rounded p-2 sm:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <button className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded sm:col-span-2">Create</button>
      </form>
      <div className="mt-4 text-sm text-amber-800/80">Existing: {products.length}</div>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [email, setEmail] = useState('customer@example.com')

  const loadProducts = async () => {
    const res = await fetch(`${API_BASE}/products`)
    const data = await res.json()
    setProducts(data)
  }

  useEffect(() => { loadProducts() }, [])

  const addToCart = (p) => {
    setCart(prev => {
      const found = prev.find(x => x.product_id === p.id || x.product_id === p._id)
      if (found) {
        return prev.map(x => x.product_id === (p.id || p._id) ? { ...x, quantity: x.quantity + 1 } : x)
      }
      return [...prev, { product_id: p.id || p._id, title: p.title, price: p.price, quantity: 1 }]
    })
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

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
      <Navbar cartCount={cart.reduce((n,i)=>n+i.quantity,0)} onAdminToggle={()=>setShowAdmin(s=>!s)} />

      <header className="bg-[url('https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI5MTcyNDJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="bg-amber-900/60">
          <div className="max-w-6xl mx-auto px-4 py-16 text-amber-50">
            <h1 className="text-4xl font-extrabold drop-shadow">Handcrafted Wooden Furniture</h1>
            <p className="mt-3 max-w-xl text-amber-100">Discover timeless pieces crafted from sustainable wood. Built to last, designed to inspire.</p>
            <a href="#catalog" className="inline-block mt-6 bg-amber-500 text-black font-semibold px-5 py-2 rounded">Shop Now</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {showAdmin && (
          <AdminPanel products={products} refresh={loadProducts} />
        )}

        <section id="catalog">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-amber-900">Catalog</h2>
            <div className="flex items-center gap-3">
              <input className="border rounded p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email for receipt" />
              <div className="text-lg font-bold text-amber-900">Total: ${total.toFixed(2)}</div>
              <button onClick={checkout} className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded">Checkout</button>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="text-amber-800/80">No products yet. Use Admin to add some.</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id || p._id} p={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-amber-900 text-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <p>© {new Date().getFullYear()} WoodenMart</p>
          <div className="text-sm">Sustainably sourced • Crafted with care</div>
        </div>
      </footer>
    </div>
  )
}

export default App
