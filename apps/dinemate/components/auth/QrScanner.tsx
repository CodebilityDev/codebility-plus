'use client'
import { setLink } from "~/lib/localStorage/table"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { QrReader, QrReaderViewFinder } from  "reactjs-qr-code-reader"

const QrScanner = () => {
  const [read, setRead] = useState(true)
  const router = useRouter()
  const handleResult = (result:any) => {
    const link = result.text

    setRead(false)
    setLink(link)
    router.push(link)
  }
  return (
    <QrReader 
      read={read} 
      onRead={(result) => handleResult(result)}
    >
      <QrReaderViewFinder color="#FF680D"/>
    </QrReader>
  )
}

export default QrScanner