import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'

function getRoleFromUser(user) {
  return user?.user_metadata?.role ?? null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    let isMounted = true

    async function loadProfile(nextSession) {
      const nextUser = nextSession?.user ?? null

      if (!nextUser) {
        if (isMounted) {
          setProfile(null)
          setLoading(false)
        }
        return
      }

      const fallbackRole = getRoleFromUser(nextUser)
      const { data, error } = await supabase.from('user_profiles').select('*').eq('user_id', nextUser.id).maybeSingle()

      if (!isMounted) return

      if (error) {
        setProfile(
          fallbackRole
            ? {
                user_id: nextUser.id,
                role: fallbackRole,
              }
            : null,
        )
      } else {
        setProfile(
          data ??
            (fallbackRole
              ? {
                  user_id: nextUser.id,
                  role: fallbackRole,
                }
              : null),
        )
      }

      setLoading(false)
    }

    async function initialize() {
      const {
        data: { session: nextSession },
      } = await supabase.auth.getSession()

      if (!isMounted) return

      setSession(nextSession)
      await loadProfile(nextSession)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession)
      setLoading(true)

      setTimeout(() => {
        loadProfile(nextSession)
      }, 0)
    })

    initialize()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function refreshProfile() {
    if (!isSupabaseConfigured || !session?.user) return

    const fallbackRole = getRoleFromUser(session.user)
    const { data } = await supabase.from('user_profiles').select('*').eq('user_id', session.user.id).maybeSingle()

    setProfile(
      data ??
        (fallbackRole
          ? {
              user_id: session.user.id,
              role: fallbackRole,
            }
          : null),
    )
  }

  async function signOut() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  const value = {
    isSupabaseConfigured,
    loading,
    profile,
    refreshProfile,
    role: profile?.role ?? getRoleFromUser(session?.user),
    session,
    signOut,
    user: session?.user ?? null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
