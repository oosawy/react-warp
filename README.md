# react-warp

Construct Warp Tunnels to warp elements between renders in React🪐

> **Warning**
> This library is still Proof of Concept, and not tested enough. Don't use this in production!

## Motivation

[RFC: Keeping real dom elements across renders in React](https://dev.to/oosawy/rfc-keeping-real-dom-elements-across-renders-in-react-401l)

## Install

```sh
npm i @oosawy/react-warp
```

## Usage

1. Add `<WarpProvider />` your app to prepare the warp tunnels.

```tsx
// if you use next.js, _app.tsx is good place to put WarpProvider
import type { AppProps } from 'next/app'
import { WarpProvider } from '@oosawy/react-warp'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WarpProvider>
      <Component {...pageProps} />
    </WarpProvider>
  )
}
```

2. Then wrap the element which you want to be warped with `<Warp />`. then the element will be warped to the same `<Warp />` in other renders.
   Note: the children are only allowed to have one React element, which must have a `key` prop.

```tsx
const IndexPage = () => {
  return (
    <div>
      <LandingLayout
        header={
          <Warp>
            <input type="text" key="search-input" />
          </Warp>
        }
      >
        <h1>The search input warps when you navigate to another page!</h1>
        <p>So the text you entered will persist even though its state is not managed.</p>
      </LandingLayout>
    </div>
  )
}

const SearchPage = () => {
  return (
    <div>
      <SearchLayout>
        <Warp>
          <input type="text" key="search-input" />
        </Warp>
      </SearchLayout>
    </div>
  )
}
```
