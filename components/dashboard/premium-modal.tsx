'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, Brain, Zap, Shield, Crown, Star, Clock } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const weeklyPrice = 49
const monthlyPrice = 149
const yearlyPrice = 999

const features = [
  { icon: Brain, title: 'NEXUS AI Assistant', desc: 'Unlimited AI-powered study help & explanations' },
  { icon: Zap, title: 'Smart Revision', desc: 'AI-generated flashcards & quizzes from your notes' },
  { icon: Shield, title: 'Focus Mode Pro', desc: 'Advanced distraction blocking & productivity analytics' },
  { icon: Crown, title: 'Priority Support', desc: '24/7 dedicated support for all your queries' },
  { icon: Star, title: 'Early Access', desc: 'Be first to try new features & improvements' },
  { icon: Clock, title: 'Extended History', desc: 'Unlimited chat history & progress tracking' },
]

const comparisons = [
  { feature: 'AI Chat Messages', free: '50/day', premium: 'Unlimited' },
  { feature: 'Study Sessions', free: '3/day', premium: 'Unlimited' },
  { feature: 'PDF Analysis', free: '5 pages', premium: 'Unlimited' },
  { feature: 'Flashcard Generation', free: '20/month', premium: 'Unlimited' },
  { feature: 'Focus Analytics', free: 'Basic', premium: 'Advanced' },
  { feature: 'Peer Study Rooms', free: '2 rooms', premium: 'Create unlimited' },
  { feature: 'Cloud Storage', free: '100MB', premium: '10GB' },
  { feature: 'Export Reports', free: 'No', premium: 'PDF & Excel' },
]

type BillingCycle = 'weekly' | 'monthly' | 'yearly'

export function PremiumModal() {
  const { isPremiumOpen, togglePremium } = useDashboardStore()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const getPrice = () => {
    switch (billingCycle) {
      case 'weekly': return weeklyPrice
      case 'monthly': return monthlyPrice
      case 'yearly': return yearlyPrice
    }
  }

  const getSavings = () => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = monthlyPrice * 12
      return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100)
    }
    return 0
  }

  const handlePayment = (method: string) => {
    setSelectedPayment(method)
    // Simulate payment processing
    setTimeout(() => {
      alert(`Redirecting to ${method} payment...`)
    }, 500)
  }

  return (
    <AnimatePresence>
      {isPremiumOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-6 border-b border-border">
              <button
                onClick={togglePremium}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">NEXUS AI Premium</h2>
                  <p className="text-sm text-muted-foreground">Unlock your full academic potential</p>
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-2 mt-4 p-1 bg-muted/50 rounded-xl w-fit mx-auto">
                {(['weekly', 'monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${billingCycle === cycle 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-card-foreground'
                      }
                    `}
                  >
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    {cycle === 'yearly' && (
                      <Badge className="absolute -top-2 -right-2 text-[10px] bg-green-500 text-white">
                        Save {getSavings()}%
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Price Display */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-muted-foreground">Rs.</span>
                  <span className="text-5xl font-bold text-card-foreground">{getPrice()}</span>
                  <span className="text-muted-foreground">/{billingCycle === 'yearly' ? 'year' : billingCycle === 'monthly' ? 'month' : 'week'}</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-500 mt-1">
                    That&apos;s just Rs. {Math.round(yearlyPrice / 12)}/month!
                  </p>
                )}
              </div>

              {/* Features Grid */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Premium Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                      <div className="p-2 rounded-lg bg-primary/20">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Comparison Table */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Free vs Premium</h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Feature</th>
                        <th className="text-center p-3 text-sm font-medium text-muted-foreground">Free</th>
                        <th className="text-center p-3 text-sm font-medium text-primary">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisons.map((row, index) => (
                        <tr key={row.feature} className={index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}>
                          <td className="p-3 text-sm text-card-foreground">{row.feature}</td>
                          <td className="p-3 text-sm text-center text-muted-foreground">{row.free}</td>
                          <td className="p-3 text-sm text-center text-primary font-medium">
                            <div className="flex items-center justify-center gap-1">
                              <Check className="w-4 h-4 text-green-500" />
                              {row.premium}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Choose Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Apple Pay */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePayment('Apple Pay')}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${selectedPayment === 'Apple Pay' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-muted/30 hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="font-medium text-card-foreground">Apple Pay</span>
                    </div>
                    {selectedPayment === 'Apple Pay' && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </motion.button>

                  {/* Google Pay */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePayment('Google Pay')}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${selectedPayment === 'Google Pay' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-muted/30 hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium text-card-foreground">Google Pay</span>
                    </div>
                    {selectedPayment === 'Google Pay' && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </motion.button>

                  {/* UPI */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePayment('UPI')}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${selectedPayment === 'UPI' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-muted/30 hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24">
                        <rect fill="#097939" width="24" height="24" rx="4"/>
                        <path fill="#fff" d="M5.5 7h3l4 10h-3l-4-10zm10 0h3l-4 10h-3l4-10z"/>
                      </svg>
                      <span className="font-medium text-card-foreground">UPI Pay</span>
                    </div>
                    {selectedPayment === 'UPI' && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  onClick={() => selectedPayment && handlePayment(selectedPayment)}
                  disabled={!selectedPayment}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {selectedPayment ? `Pay Rs. ${getPrice()} with ${selectedPayment}` : 'Select a payment method'}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                  <br />
                  Cancel anytime. No questions asked.
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-4 h-4" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span>5000+ Happy Students</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
