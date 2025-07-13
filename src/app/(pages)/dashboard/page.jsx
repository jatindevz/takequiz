'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {
    const {data : session} = useSession()
  return (
      <div className='text-2xl text-white '>
          {session?.user?.username} welcome
          
    </div>
  )
}

export default page