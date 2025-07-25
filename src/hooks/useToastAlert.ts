import { useState } from "react"

type Toast = {
    id: number
    type: "success" | "error"
    title: string
    content: React.ReactNode
    removing?: boolean
}

export const useToastAlert = () => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const show = (type: Toast["type"], title: string, content: React.ReactNode) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, title, content }])

        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))

            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, 300)
        }, 3000)
    }

    return {
        showSuccess: (title: string, content: React.ReactNode) => show("success", title, content),
        showError: (title: string, content: React.ReactNode) => show("error", title, content),
        toasts
    }
}
