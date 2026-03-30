import { Suspense, ReactNode } from 'react'

const SuspenseWrap = ({ children }: {
    children: ReactNode
}) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    )
}

export default SuspenseWrap
