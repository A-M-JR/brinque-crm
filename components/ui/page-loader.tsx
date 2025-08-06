import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type PageFeedbackProps = {
    mode?: "spinner" | "skeleton" | "both"
    message?: string
    count?: number
}

export function PageFeedback({
    mode = "spinner",
    message = "Carregando...",
    count = 5,
}: PageFeedbackProps) {
    if (mode === "skeleton" || mode === "both") {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-1/4" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    {[...Array(count)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Card>
                <CardContent className="flex items-center gap-2 p-6 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {message}
                </CardContent>
            </Card>
        </div>
    )
}
