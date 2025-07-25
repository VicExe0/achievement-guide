import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

import "@/assets/styles/toastalerts.css";

export const ToastAlerts = ({ toasts }: { toasts: any[] }) => {
    return (
        <div className="fixed bottom-4 right-4 flex flex-col z-50">
            {toasts.map(toast => (
                <div key={toast.id} className={`w-64 mb-2 ${toast.removing ? "slide-out" : "slide-in"}`}>
                    <Alert variant={toast.type === "error" ? "destructive" : undefined}>
                        {toast.type === "error" ? <AlertCircleIcon /> : <CheckCircle2Icon />}
                        <AlertTitle>{toast.title}</AlertTitle>
                        <AlertDescription>{toast.content}</AlertDescription>
                    </Alert>
                </div>
            ))}
        </div>
    )
}
