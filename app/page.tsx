"use client"

import { useState, useRef } from "react"
import { Plus, Minus, ShoppingCart, Phone, MapPin, Leaf, Instagram, Clock, Award, Heart, X, Menu } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  originalPrice: number
}

interface CustomerInfo {
  name: string
  phone: string
  address: string
  notes: string
}

export default function OlivaTucStore() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    notes: ""
  })

  const heroRef = useRef<HTMLElement | null>(null)
  const catalogRef = useRef<HTMLElement | null>(null)
  const contactRef = useRef<HTMLElement | null>(null)

  const products = [
    {
      id: "1-unit",
      name: "1 Botella de Aceite de Oliva Extra Virgen",
      price: 10500,
      originalPrice: 10500,
      description: "Botella de 1 litro de aceite de oliva extra virgen artesanal",
      size: "1L",
      savings: 0
    },
    {
      id: "2-units",
      name: "Pack de 2 Botellas",
      price: 20000,
      originalPrice: 21000,
      description: "2 botellas de 1 litro cada una - Oferta especial",
      size: "2 x 1L",
      savings: 1000
    },
    {
      id: "6-units",
      name: "Pack Familiar - 6 Botellas",
      price: 60000,
      originalPrice: 63000,
      description: "6 botellas de 1 litro cada una - Máximo ahorro",
      size: "6 x 1L",
      savings: 3000
    }
  ]

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setShowMobileMenu(false)
  }

  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        originalPrice: product.originalPrice
      }]
    })
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id))
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`
  }

  const generateWhatsAppMessage = () => {
    const orderDetails = cart.map(item => 
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}`
    ).join("\n")

    const total = getTotalPrice()

    const message = [
      'Hola! Quiero hacer un pedido de OLIVA.TUC:',
      '',
      'DATOS DEL CLIENTE:',
      `Nombre: ${customerInfo.name}`,
      `Telefono: ${customerInfo.phone}`,
      `Direccion: ${customerInfo.address}`,
      'PEDIDO:',
      orderDetails,
      '',
      `TOTAL: $${total.toLocaleString('es-AR')}`,
      customerInfo.notes ? `Notas: ${customerInfo.notes}` : '',
      'Gracias!'
    ].filter(Boolean).join('\n')

    return encodeURIComponent(message)
  }

  const handleWhatsAppRedirect = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Por favor completa todos los campos obligatorios (Nombre, Teléfono y Dirección)")
      return
    }
    
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/5493816661189?text=${message}`
    window.open(whatsappUrl, '_blank')
    setShowCart(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 backdrop-blur-md border-b border-green-200 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Menu Button - Movido a la izquierda */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-2 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative">
                <Leaf className="h-10 w-10 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-2 sm:ml-3">
                <h1 className="text-3xl font-bold text-white">
                  Oliva.Tuc
                </h1>
                <p className="text-green-100 text-sm font-medium">Aceite de Oliva Artesanal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={() => scrollToSection(heroRef)}
                className="text-white hover:text-amber-200 font-medium transition-colors duration-300 hover:scale-105 transform"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection(catalogRef)}
                className="text-white hover:text-amber-200 font-medium transition-colors duration-300 hover:scale-105 transform"
              >
                Catálogo
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-white hover:text-amber-200 font-medium transition-colors duration-300 hover:scale-105 transform"
              >
                Contacto
              </button>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart Button */}
              <div className="relative">
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Carrito</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-green-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {/* Dropdown Cart - Centrado más hacia la izquierda */}
                {showCart && (
                  <div className="absolute right-0 sm:-right-12 md:-right-20 lg:-right-32 top-full mt-2 w-[95vw] max-w-md sm:max-w-lg md:w-96 bg-white rounded-2xl shadow-2xl border-0 z-50 max-h-[80vh] overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 flex items-center justify-between">
                      <h3 className="font-semibold flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Carrito de Compras
                      </h3>
                      <button
                        onClick={() => setShowCart(false)}
                        className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="p-4">
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Tu carrito está vacío</p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                        {/* Products Section */}
                        <div className="p-2 sm:p-4">
                          <div className="space-y-4">
                            {cart.map((item) => (
                              <div key={item.id} className="bg-gray-50 rounded-xl p-2 sm:p-3 hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-start mb-1 sm:mb-2">
                                  <h4 className="font-medium text-sm text-gray-800 leading-tight flex-1 mr-2">
                                    {item.name}
                                  </h4>
                                  <p className="font-bold text-green-600 text-sm">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center space-x-1 sm:space-x-2">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors border border-gray-300 flex items-center justify-center"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="h-7 w-7 p-0 rounded-full hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors border border-gray-300 flex items-center justify-center"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {formatPrice(item.price)} c/u
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        {/* Total and Form Section */}
                        <div className="p-2 sm:p-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2 sm:p-3 mb-4">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-gray-800">Total:</span>
                              <span className="text-green-600 text-lg">{formatPrice(getTotalPrice())}</span>
                            </div>
                          </div>

                          {/* Customer Information Form */}
                          <div className="space-y-2 sm:space-y-3">
                            <h4 className="font-semibold text-gray-800 text-base sm:text-lg">Datos de Entrega</h4>
                            
                            <div className="space-y-1">
                              <label className="text-gray-700 text-sm">Nombre completo *</label>
                              <input
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                placeholder="Tu nombre completo"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-gray-700 text-sm">Teléfono *</label>
                              <input
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                placeholder="Tu número de teléfono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-gray-700 text-sm">Dirección *</label>
                              <input
                                value={customerInfo.address}
                                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                placeholder="Dirección de entrega"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-gray-700 text-sm">Notas adicionales</label>
                              <textarea
                                value={customerInfo.notes}
                                onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                placeholder="Instrucciones especiales..."
                                rows={2}
                              />
                            </div>
                          </div>

                          <button
                            onClick={handleWhatsAppRedirect}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-3 sm:mt-4 text-sm sm:text-base flex items-center justify-center"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Confirmar Pedido por WhatsApp
                          </button>
                          
                          <p className="text-xs text-gray-500 text-center mt-2">
                            Al confirmar, serás redirigido a WhatsApp
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
              <nav className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection(heroRef)}
                  className="text-white hover:text-amber-200 font-medium transition-colors duration-300 text-left"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection(catalogRef)}
                  className="text-white hover:text-amber-200 font-medium transition-colors duration-300 text-left"
                >
                  Catálogo
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="text-white hover:text-amber-200 font-medium transition-colors duration-300 text-left"
                >
                  Contacto
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Cart Slide-in */}
      {showCart && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowCart(false)}
        />
      )}

      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Hero/About Section */}
        <section ref={heroRef} className="relative overflow-hidden mb-10 sm:mb-20">
          {/* Fondo gris transparente */}
          <div className="absolute inset-0 bg-gray-500/30 rounded-3xl pointer-events-none z-0"></div>
          {/* Fondo decorativo original */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-amber-500/10 rounded-3xl z-0"></div>
          <div className="relative bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden z-10 p-4 sm:p-8 md:p-12">
            <div className="text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <span className="bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold rounded-full flex items-center hover:bg-green-200 transition-colors">
                  <Award className="h-4 w-4 mr-2" />
                  100% Natural
                </span>
                <span className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-semibold rounded-full flex items-center hover:bg-amber-200 transition-colors">
                  <Heart className="h-4 w-4 mr-2" />
                  Calidad Premium
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-700 via-green-600 to-amber-600 bg-clip-text text-transparent">
                Aceite de Oliva Artesanal
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                En <strong>OLIVA.TUC</strong> nos dedicamos a producir el mejor aceite de oliva extra virgen 
                de manera artesanal, manteniendo los métodos tradicionales que garantizan 
                la máxima calidad y sabor auténtico.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center p-6 bg-white/50 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">100% Natural</h3>
                  <p className="text-gray-600 text-sm">Sin aditivos ni conservantes artificiales</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                  <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Calidad Premium</h3>
                  <p className="text-gray-600 text-sm">Aceite extra virgen de primera extracción</p>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Hecho con Amor</h3>
                  <p className="text-gray-600 text-sm">Producción artesanal familiar</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-green-700">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Envíos en San Miguel y Yerba Buena</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Entrega rápida</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Catalog */}
        <section ref={catalogRef} className="mb-10 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">Nuestro Catálogo</h3>
            <p className="text-base sm:text-xl text-gray-600">Botellas de un litro de aceite de oliva extra virgen</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <span className="mb-3 bg-green-100 text-green-800 hover:bg-green-200 transition-colors px-3 py-1 rounded-full text-sm font-medium">
                          {product.size}
                        </span>
                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors mt-3">
                          {product.name}
                        </h4>
                        <p className="text-gray-600 mt-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        {product.savings > 0 && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                              ¡Descuento especial!
                            </span>
                          </div>
                        )}
                        <p className="text-3xl font-bold text-green-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center">
                          <Leaf className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 pt-0">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer ref={contactRef} className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Leaf className="h-8 w-8 text-green-400" />
                <h3 className="text-2xl font-bold">OLIVA.TUC</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Aceite de oliva artesanal de la más alta calidad, 
                producido con amor y tradición familiar.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/oliva.tuc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-green-400">Contacto</h4>
              <div className="space-y-3">
                <a
                  href="https://wa.me/5493813432202?text=Hola!%20Quiero%20hacer%20una%20consulta%20sobre%20aceite%20de%20oliva."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 hover:text-green-400 transition-colors"
                >
                  <Phone className="h-5 w-5 text-green-400" />
                  <span>381 343 2202 <span className='text-xs text-gray-300'>(tomas)</span></span>
                </a>
                <a
                  href="https://wa.me/5493816661189?text=Hola!%20Quiero%20hacer%20una%20consulta%20sobre%20aceite%20de%20oliva."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 hover:text-green-400 transition-colors"
                >
                  <Phone className="h-5 w-5 text-green-400" />
                  <span>381 666 1189 <span className='text-xs text-gray-300'>(facundo)</span></span>
                </a>
                <a
                  href="https://instagram.com/oliva.tuc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 hover:text-green-400 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-green-400" />
                  <span>@oliva.tuc</span>
                </a>
                <div className="flex items-center space-x-3 hover:text-green-400 transition-colors">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span>San Miguel y Yerba Buena</span>
                </div>
                
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-green-400">Nuestro Producto</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>100% Natural</span>
                </li>
                <li className="flex items-center space-x-2 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Extra Virgen</span>
                </li>
                <li className="flex items-center space-x-2 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Calidad Premium</span>
                </li>
                <li className="flex items-center space-x-2 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Producción Artesanal</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 my-8"></div>
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 OLIVA.TUC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}