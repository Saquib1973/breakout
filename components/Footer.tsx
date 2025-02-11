import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="header-footer text-sm justify-end items-end">
      <div>
        Made with 💓 by{' '}
        <Link
          className="underline underline-offset-4 text-red-400"
          href={'https://heysaquib.vercel.app/'}
          target='_blank'
        >
          @Saquib
        </Link>
      </div>
    </div>
  )
}

export default Footer
