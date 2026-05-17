import React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return undefined
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    if (isMobile !== (window.innerWidth < MOBILE_BREAKPOINT)) {
       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    return () => mql.removeEventListener("change", onChange)
  }, [isMobile])

  return !!isMobile
}
