import React from 'react'
import BreakoutGame from '@/components/BreakoutGame';

const page = () => {
  return (
    <div className="min-h-window flex items-start justify-center max-2xl:items-center">
      <BreakoutGame />
    </div>
  )
}

export default page
