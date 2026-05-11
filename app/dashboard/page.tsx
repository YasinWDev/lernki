import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?from=/dashboard')
  }

  const { data: lernzettel, error } = await supabase
    .from('lernzettel')
    .select('id, titel, inhalt, fach, tags, schwierigkeit, file_name, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <DashboardClient
      lernzettel={lernzettel ?? []}
      userEmail={user.email ?? ''}
      loadError={error?.message ?? null}
    />
  )
}