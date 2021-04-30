# Library title
Use react-spring's `<animated.element>` to update the DOM without re-rendering.

## Motivation
Whenever you are trying to animate something through the React Lifecycle, you're likely to run into problems hitting that smooth 60fps mark. React is fast, but it's not that fast. Think about it: you are forcing a full component (+ its children) through React and its diffing mechanism 60 times per second. 

*(Taken from [Performance pitfalls
](https://github.com/pmndrs/react-three-fiber/blob/master/markdown/pitfalls.md), it's written in the context of `react-three-fiber`, but generalizes to all animations you want to update at 60fps).*

Alternatively, you can mutate the DOM directly, bypassing React's lifecycle. This is a complex challenge because React doesn't know about the changes you make to the DOM. Luckily for us, the folks at `react-spring` have already solved this problem with their animated elements (e.g. `<animated.div>`). You pass them a special animated value which it will safely apply for you, and update whenever it changes.

This library provides a way to create such an animated value, which you can use with an animated component. In case you don't want to use React Spring as the driver for the animation. 

## Installation

```
yarn add react-spring @kaliber/use-animated-value
```

_This library is created to be used with React Spring v8_

## Usage
This library exposes a `useAnimatedValue` and a `useAnimatedValues` hook. 

### Using as drop-in replacement for `React.useState`
You pass in a default value, or a function that returns your default value. Returns an array with the animated value, and a setter. 

```js
const [animatedValue, setAnimatedValue] = useAnimatedValue(defaultValue)
const [animatedValue, setAnimatedValue] = useAnimatedValue(() => defaultValue)
```

### Example

```jsx
import { animated } from 'react-spring'
import { useAnimatedValue } from '@kaliber/use-animated-value'

function Component() {
  const [animatedY, setAnimatedY] = useAnimatedValue(0)

  useSingleDimensionBouncyBallPhysics({
    bbox: { min: 0, max: 100 },
    onFrame(y) {
      setAnimatedY(y)
    }
  })

  return (
    <animated.div style={{ 
      transform: animatedY.interpolate(y => `translate3d(0, ${y}vh, 0)`)
    }}>
  )
}
```

### Animating a group of values

If you want to use multiple values in one go, you can provide an object as default value. In this case, the hook returns an object with multiple animated values. The setter also expects to be called with an object, and will be merged with the existing values.

```js
const [animatedProps, setAnimatedProps] = React.useState({
  animatedValue1,
  animatedValue2
})
```

### Example

```jsx
import { animated, interpolate } from 'react-spring'
import { useAnimatedValue } from '@kaliber/use-animated-value'

function Component() {
  const [{ x, y }, setAnimatedValue] = useAnimatedValue({ 
    x: 0, 
    y: 0 
  })

  use2dBouncyBallPhysics({
    bbox: { top: 0, right: 100, bottom: 100, left: 0 },
    onFrame({ x, y }) {
      setAnimatedValue({ x, y })
    }
  })

  return (
    <animated.div style={{ 
      transform: interpolate(
        [x, y],
        (x, y) => `translate3d(${x}vw, ${y}vh, 0)`)
    }}>
  )
}
```

### Multiple animated values
Whenever you need to animate a dynamic amount of values, you can use use the `useAnimatedValues` hook. The first argument it takes, is the amount of animated values you need. The second argument must be a function, which returns the default values for the animated values. 

This hook closely resembles how [`useSprings`](https://www.react-spring.io/docs/hooks/use-springs) works in React Spring.

```js
const [arrayOfAnimatedValues, setArrayOfAnimatedValues] = useAnimatedValues(
  amount, 
  i => defaultValue
)
```
```js
const [arrayOfAnimatedProps, setArrayOfAnimatedProps] = useAnimatedValues(
  amount, 
  i => ({
    animatedValue1,
    animatedValue2
  })
)
```

### Example
```jsx
import { animated, interpolate } from 'react-spring'
import { useAnimatedValues } from '@kaliber/use-animated-value'

function Component() {
  const amount = React.useMemo(() => Math.ceil(Math.random() * 100), [])
  const [animatedProps, setAnimatedProps] = useAnimatedValues(
    amount, 
    i => ({ x: 0, y: 0 })
  )

  useBallPitPhysics({
    balls: amount,
    bbox: { top: 0, right: 100, bottom: 100, left: 0 },
    onFrame(balls) {
      setAnimated(i => ({
        x: balls[i].x,
        y: balls[i].y,
      }))
    }
  })

  return (
    <>
      {animatedProps.map(({ x, y }, i) => (
        <animated.div key={i} style={{ 
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}vw, ${y}vh, 0)`)
        }}>
      ))}
    </>
  )
}
```

![](https://media.giphy.com/media/l2JhL0Gpfbvs4Y07K/giphy.gif)

## Disclaimer
This library is intended for internal use, we provide __no__ support, use at your own risk. It does not import React, but expects it to be provided, which [@kaliber/build](https://kaliberjs.github.io/build/) can handle for you.

This library is not transpiled.
