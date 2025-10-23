import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visuallyHidden"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { X } from "lucide-react"

interface QuestionImagePreviewProps {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt: string
}

export default function QuestionImagePreview({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
}: QuestionImagePreviewProps) {
    if (!imageSrc) return null
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>{imageAlt}</DialogTitle>
                </VisuallyHidden>

                <div className="relative flex flex-col h-full">
                    {/* Image Container */}
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

                    {/* Close Button */}
                    <div className="p-4 flex justify-center">
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