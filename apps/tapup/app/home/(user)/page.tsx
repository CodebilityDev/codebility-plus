import { createServer } from '@/utils/supabase'
import { Button } from '@codevs/ui/button'
import React from 'react'
import { signOut } from '@/app/auth/actions'

async function UserHomePage() {
  const supabase = createServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return <div>You are not allowed here!</div>

  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', user?.id)
    .single()

  return (
    <div>
      <div>Hello {data && data.email}</div>
      <img className="h-20 w-20" src={data.avatar_url} />
      <form action={signOut}>
        <Button>Logout</Button>
      </form>
    </div>
  )
}

export default UserHomePage
