import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visuallyHidden"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { X, FileText, File, Download } from "lucide-react"
import { memo, useCallback } from "react"

interface QuestionImagePreviewProps {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt: string
}

// Memoized DocumentPreview component
const DocumentPreview = memo(function DocumentPreview({
    fileSrc,
    fileName,
    fileType,
}: {
    fileSrc: string
    fileName: string
    fileType: string
}) {
    const getDocumentIcon = () => {
        switch (fileType) {
            case 'pdf':
                return <FileText className="h-16 w-16 text-red-500" />
            case 'doc':
            case 'docx':
                return <FileText className="h-16 w-16 text-blue-500" />
            case 'txt':
                return <FileText className="h-16 w-16 text-gray-500" />
            default:
                return <File className="h-16 w-16 text-gray-500" />
        }
    }

    const getDocumentInfo = () => {
        const typeMap: Record<string, string> = {
            pdf: 'PDF Document',
            doc: 'Word Document',
            docx: 'Word Document',
            txt: 'Text File',
        }
        return typeMap[fileType] || 'Document'
    }

    const handleDownload = useCallback(() => {
        try {
            const link = document.createElement('a')
            link.href = fileSrc
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }, [fileSrc, fileName])

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
            {/* Document Icon */}
            <div className="flex items-center justify-center">
                {getDocumentIcon()}
            </div>

            {/* File Info */}
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {fileName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getDocumentInfo()}
                </p>
            </div>

            {/* Download Button */}
            <Button
                onClick={handleDownload}
                className="gap-2 bg-customBlue-500 hover:bg-customBlue-600 text-white"
            >
                <Download className="h-4 w-4" />
                Download File
            </Button>

            {/* File Preview Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
                Click the download button to view or save this file
            </p>
        </div>
    )
})

// Memoized ImagePreview component
const ImagePreview = memo(function ImagePreview({
    imageSrc,
    imageAlt,
}: {
    imageSrc: string
    imageAlt: string
}) {
    return (
        <div className="relative w-full flex items-center justify-center bg-transparent p-4">
            <div className="relative max-h-[calc(80vh-70px)] w-full">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain max-h-[calc(80vh-70px)]"
                    priority
                />
            </div>
        </div>
    )
})

export default function QuestionImagePreview({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
}: QuestionImagePreviewProps) {
    if (!imageSrc) return null

    // Determine file type from the source
    const isImage = imageSrc.startsWith('data:image/') || /\.(jpe?g|png|gif|webp)$/i.test(imageSrc)
    
    // Extract file name and type from URL or data URI
    const getFileInfo = () => {
        if (imageSrc.startsWith('data:')) {
            // For data URIs, extract from data type
            const mimeMatch = imageSrc.match(/data:([^;]+);/)
            const mimeType = mimeMatch?.[1] || 'application/octet-stream'
            
            const extMap: Record<string, string> = {
                'application/pdf': 'pdf',
                'application/msword': 'doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                'text/plain': 'txt',
            }
            
            const ext = extMap[mimeType] || 'bin'
            return {
                fileName: `document.${ext}`,
                fileType: ext,
            }
        } else {
            // For regular URLs, extract from path
            const urlPath = imageSrc.split('/').pop() || 'file'
            const ext = urlPath.split('.').pop()?.toLowerCase() || 'bin'
            return {
                fileName: urlPath,
                fileType: ext,
            }
        }
    }

    const fileInfo = getFileInfo()

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>{imageAlt}</DialogTitle>
                </VisuallyHidden>

                <div className="relative flex flex-col h-full">
                    {/* Preview Content */}
                    {isImage ? (
                        <ImagePreview imageSrc={imageSrc} imageAlt={imageAlt} />
                    ) : (
                        <DocumentPreview
                            fileSrc={imageSrc}
                            fileName={fileInfo.fileName}
                            fileType={fileInfo.fileType}
                        />
                    )}

                    {/* Close Button */}
                    <div className="p-4 flex justify-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="gap-2 border border-foreground/30 bg-destructive/70 hover:bg-destructive text-foreground"
                        >
                            <X className="h-4 w-4" />
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}