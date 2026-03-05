// components/ui/modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

interface ModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: React.ReactNode
    children: React.ReactNode
    className?: string
}

export function Modal({ open, onOpenChange, title, children, className }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-[480px] overflow-visible rounded-3xl! shadow-xl", className)}>
                <DialogPrimitive.Close className="absolute -top-10 -right-1 z-50 cursor-pointer rounded-full bg-white p-1.5 shadow-md hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                {title && (
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    </DialogHeader>
                )}

                <div className="py-4">{children}</div>
            </DialogContent>
        </Dialog>
    )
}