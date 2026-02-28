// app/page.tsx (server component)
import { redirect } from 'next/navigation'
import supabase from '@lib/supabase'
import HomeClient from './HomeClient'

export default async function Root() {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        redirect('/home')
    } else {
        redirect('/authentication')
    }

    return <HomeClient />
}
