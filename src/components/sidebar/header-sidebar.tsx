import { SidebarTrigger, useSidebar } from "../ui/sidebar"

export default function SidebarHeaderHeader() {
  const { open, isMobile } = useSidebar()

  return (
    <div className="flex items-center gap-2 px-2 pb-2" style={{ height: '40px', justifyContent: open ? 'space-between' : 'center' }}>
      <div className="flex items-center justify-center gap-2 md:justify-start text-[var(--primary)] font-medium" style={{ marginLeft: open ? '8px' : '0px' }}>
        
      </div>

      {open && !isMobile && <SidebarTrigger size={isMobile ? 'lg' : 'icon'} />}
    </div>
  )
}
