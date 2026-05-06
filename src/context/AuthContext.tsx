import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { toast } from 'sonner'
import { delay } from '@/lib/utils'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'luxe-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await delay(800)
    
    if (password.length >= 6) {
      const newUser: User = {
        id: 'user_' + Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        avatar: `https://picsum.photos/seed/${email}/200/200`,
      }
      setUser(newUser)
      setIsLoading(false)
      toast.success('Welcome back!')
      return true
    }
    
    setIsLoading(false)
    toast.error('Invalid credentials')
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    await delay(1000)
    
    if (password.length >= 6) {
      const newUser: User = {
        id: 'user_' + Math.random().toString(36).substring(7),
        email,
        name,
        avatar: `https://picsum.photos/seed/${email}/200/200`,
      }
      setUser(newUser)
      setIsLoading(false)
      toast.success('Account created successfully!')
      return true
    }
    
    setIsLoading(false)
    toast.error('Password must be at least 6 characters')
    return false
  }

  const logout = () => {
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
