import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { NavigationSidebar } from "./navigation/navigation-sidebar"
import { ServerSidebar } from "./servers/server-sidebar"
import { DialogTitle } from "./ui/dialog"


export const MobileToggle = ({
    serverId
}: {serverId: string}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <DialogTitle></DialogTitle>
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar  serverId={serverId}/> 
            </SheetContent>
        </Sheet>
    )
}