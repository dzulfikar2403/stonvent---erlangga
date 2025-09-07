import React, { ReactNode } from 'react'

const layout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-h-svh flex justify-center items-center'>
        {children}
    </div>
  )
}

export default layout