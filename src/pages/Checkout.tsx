import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Check, CreditCard, Truck, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn, formatCurrency, delay } from '@/lib/utils'
import { toast } from 'sonner'

type Step = 1 | 2 | 3

interface ShippingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

interface PaymentData {
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getCartTotal, couponDiscount, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = getCartTotal() + shipping

  // Detect card type
  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    if (cleaned.startsWith('4')) return 'Visa'
    if (cleaned.startsWith('5')) return 'Mastercard'
    if (cleaned.startsWith('3')) return 'Amex'
    return null
  }

  const cardType = getCardType(paymentData.cardNumber)

  // Format card number
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ').substring(0, 19) : ''
  }

  // Format expiry
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const validateShipping = () => {
    const newErrors: Record<string, string> = {}
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!shippingData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(shippingData.email)) newErrors.email = 'Invalid email'
    if (!shippingData.address.trim()) newErrors.address = 'Address is required'
    if (!shippingData.city.trim()) newErrors.city = 'City is required'
    if (!shippingData.state.trim()) newErrors.state = 'State is required'
    if (!shippingData.zip.trim()) newErrors.zip = 'ZIP code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = () => {
    const newErrors: Record<string, string> = {}
    const cardNum = paymentData.cardNumber.replace(/\s/g, '')
    if (!cardNum) newErrors.cardNumber = 'Card number is required'
    else if (cardNum.length < 15) newErrors.cardNumber = 'Invalid card number'
    if (!paymentData.cardName.trim()) newErrors.cardName = 'Name on card is required'
    if (!paymentData.expiry) newErrors.expiry = 'Expiry is required'
    else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry)) newErrors.expiry = 'Invalid format (MM/YY)'
    if (!paymentData.cvv) newErrors.cvv = 'CVV is required'
    else if (paymentData.cvv.length < 3) newErrors.cvv = 'Invalid CVV'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    await delay(2000)
    const newOrderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setOrderId(newOrderId)
    clearCart()
    setOrderComplete(true)
    setIsProcessing(false)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-3xl text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to continue to checkout.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </main>
    )
  }

  if (orderComplete) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="inline-flex p-6 rounded-full bg-green-500/20 mb-6 animate-[scale_0.3s_ease-out]">
            <Check className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="text-gold font-medium mb-8">Order ID: {orderId}</p>
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent to {shippingData.email}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/profile"
              className="px-6 py-3 border border-gold text-gold font-medium rounded-md hover:bg-gold hover:text-charcoal transition-colors"
            >
              View Order
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: ShoppingBag },
  ]

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-full transition-colors',
                  currentStep >= step.number
                    ? 'text-gold'
                    : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    currentStep > step.number
                      ? 'bg-gold text-charcoal'
                      : currentStep === step.number
                      ? 'border-2 border-gold text-gold'
                      : 'border border-muted-foreground text-muted-foreground'
                  )}
                >
                  {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 lg:w-24 h-px mx-2',
                    currentStep > step.number ? 'bg-gold' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl text-foreground mb-6">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.firstName ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.lastName ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.email ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="w-full h-12 px-4 bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className={cn(
                      'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                      errors.address ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City</label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.city ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">State</label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.state ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingData.zip}
                      onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.zip ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.zip && <p className="text-sm text-destructive mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl text-foreground mb-6">Payment Information</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Card Number
                    {cardType && <span className="ml-2 text-gold">({cardType})</span>}
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={cn(
                      'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                      errors.cardNumber ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name on Card</label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    className={cn(
                      'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                      errors.cardName ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.cardName && <p className="text-sm text-destructive mt-1">{errors.cardName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentData.expiry}
                      onChange={(e) => setPaymentData({ ...paymentData, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.expiry ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.expiry && <p className="text-sm text-destructive mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                      placeholder="123"
                      maxLength={4}
                      className={cn(
                        'w-full h-12 px-4 bg-card border rounded-md text-foreground focus:outline-none focus:border-gold transition-colors',
                        errors.cvv ? 'border-destructive' : 'border-border'
                      )}
                    />
                    {errors.cvv && <p className="text-sm text-destructive mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl text-foreground mb-6">Review Your Order</h2>
                
                {/* Shipping Info */}
                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">Shipping Address</h3>
                    <button onClick={() => setCurrentStep(1)} className="text-sm text-gold hover:text-gold-light transition-colors">
                      Edit
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.zip}<br />
                    {shippingData.email}
                  </p>
                </div>

                {/* Payment Info */}
                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">Payment Method</h3>
                    <button onClick={() => setCurrentStep(2)} className="text-sm text-gold hover:text-gold-light transition-colors">
                      Edit
                    </button>
                  </div>
                  <p className="text-muted-foreground">
                    {cardType} ending in {paymentData.cardNumber.slice(-4)}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Items ({items.length})</h3>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm text-foreground">{formatCurrency(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-foreground hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-8 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-24">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Discount ({couponDiscount}%)</span>
                    <span>-{formatCurrency(subtotal * couponDiscount / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-gold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
