'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function session() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {

    console.error('Session called')

    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking session:', error.message)
      }

      if (!session && pathname !== '/authentication') {
        router.push('/authentication')
      } else {
        console.log('User with this email has logged in:', session?.user.email)
      }
    }

    checkAuth()
  }, [router])
}
