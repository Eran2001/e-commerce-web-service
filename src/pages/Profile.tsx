import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Truck, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { mockOrders, mockAddresses } from '@/data/mockOrders'
import { cn, formatCurrency } from '@/lib/utils'

type Tab = 'orders' | 'addresses' | 'settings'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  if (!isAuthenticated || !user) {
    navigate('/auth')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gold" />
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-border">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-medium">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="font-display text-xl text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors',
                    activeTab === 'orders'
                      ? 'bg-gold/10 text-gold'
                      : 'text-foreground hover:bg-muted/50'
                  )}
                >
                  <Package className="h-5 w-5" />
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors',
                    activeTab === 'addresses'
                      ? 'bg-gold/10 text-gold'
                      : 'text-foreground hover:bg-muted/50'
                  )}
                >
                  <MapPin className="h-5 w-5" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors',
                    activeTab === 'settings'
                      ? 'bg-gold/10 text-gold'
                      : 'text-foreground hover:bg-muted/50'
                  )}
                >
                  <Settings className="h-5 w-5" />
                  Account Settings
                </button>
                <div className="h-px bg-border my-4" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-left text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="font-display text-3xl text-foreground mb-6">Order History</h1>
                {mockOrders.length === 0 ? (
                  <div className="bg-card rounded-lg p-12 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                    >
                      Start Shopping
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="bg-card rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-border">
                          <div>
                            <p className="font-medium text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={cn(
                              'text-sm font-medium',
                              order.status === 'delivered' && 'text-green-500',
                              order.status === 'shipped' && 'text-blue-500',
                              order.status === 'processing' && 'text-gold'
                            )}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-4">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground truncate">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <span className="text-foreground font-medium">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <span className="text-muted-foreground">Total</span>
                          <span className="text-gold font-semibold text-lg">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-3xl text-foreground">Saved Addresses</h1>
                  <button className="px-4 py-2 border border-gold text-gold text-sm font-medium rounded-md hover:bg-gold hover:text-charcoal transition-colors">
                    Add New
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mockAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={cn(
                        'bg-card rounded-lg p-6 border-2',
                        address.isDefault ? 'border-gold' : 'border-transparent'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{address.name}</span>
                          {address.isDefault && (
                            <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <button className="text-sm text-gold hover:text-gold-light transition-colors">
                          Edit
                        </button>
                      </div>
                      <p className="text-muted-foreground">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zip}<br />
                        {address.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h1 className="font-display text-3xl text-foreground mb-6">Account Settings</h1>
                <div className="bg-card rounded-lg divide-y divide-border">
                  <div className="p-6">
                    <h3 className="font-medium text-foreground mb-4">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          readOnly
                          className="w-full h-10 px-4 bg-background border border-border rounded-md text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="w-full h-10 px-4 bg-background border border-border rounded-md text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-foreground mb-4">Password</h3>
                    <button className="px-4 py-2 border border-gold text-gold text-sm font-medium rounded-md hover:bg-gold hover:text-charcoal transition-colors">
                      Change Password
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-foreground mb-4">Preferences</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-gold focus:ring-gold bg-card" />
                      <span className="text-muted-foreground">Receive marketing emails</span>
                    </label>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-destructive mb-4">Danger Zone</h3>
                    <button className="px-4 py-2 border border-destructive text-destructive text-sm font-medium rounded-md hover:bg-destructive hover:text-white transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
