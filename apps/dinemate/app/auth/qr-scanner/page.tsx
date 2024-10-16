import QrScanner from '~/components/auth/QrScanner'
import React from 'react'

const QrScannerPage = () => {
  return (
    <div className='h-[400px]  flex flex-col items-center w-full'>
      <h1 className='text-center font-bold text-2xl mb-5'>Scan QR</h1>
      <QrScanner/>
    </div>
  )
}

export default QrScannerPage