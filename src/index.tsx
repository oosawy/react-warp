import React, { useState, useRef, useContext, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'

type WarpManager = {
  set(key: string, element: React.ReactElement): HTMLElement
}

const WarpContext = React.createContext<WarpManager | undefined>(undefined)

type Portals = Record<
  string,
  { node: HTMLElement; element: React.ReactElement }
>

export const WarpProvider = (props: { children: React.ReactNode }) => {
  const [portals, setPortals] = useState<Portals>({})

  const manager: WarpManager = {
    set(key, element) {
      const node = portals[key]?.node ?? document.createElement('span')
      setPortals((prev) =>
        Object.assign({}, prev, { [key]: { node, element } })
      )
      return node
    },
  }

  return (
    <WarpContext.Provider value={manager}>
      {props.children}
      <WarpHost portals={portals} />
    </WarpContext.Provider>
  )
}

const WarpHost = (props: { portals: Portals }) => {
  return (
    <>
      {Object.values(props.portals).map(({ node, element }) =>
        ReactDOM.createPortal(element, node)
      )}
    </>
  )
}

const isServer = typeof window === 'undefined'
const useClientOnlyLayoutEffect = isServer ? () => {} : useLayoutEffect

export const Warp = (props: { children: React.ReactElement }) => {
  const manager = useContext(WarpContext)

  if (!manager) {
    throw new Error('<Warp /> must used under <WarpProvider />')
  }

  const ref = useRef<HTMLSpanElement>(null)

  const key = React.Children.only(props.children).key

  if (!key) {
    throw new Error('<Warp /> child must have key prop')
  }

  useClientOnlyLayoutEffect(() => {
    const node = manager.set(key.toString(), props.children)
    ref.current?.replaceChildren(node)
  }, [props.children, key])

  return <span ref={ref} />
}
