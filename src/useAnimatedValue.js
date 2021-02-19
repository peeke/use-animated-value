import React from 'react'
import { useSprings } from 'react-spring'

const KEY = '__KEY'

export function useAnimatedValue(initialValueOrFn) {
  const [values, set] = useAnimatedValues(
    1, 
    () => (typeof initialValueOrFn === 'function') ? initialValueOrFn() : initialValueOrFn
  )

  const setValue = React.useCallback(
    x => { set(() => x) }, 
    [set]
  )

  return [values[0], setValue]
}

export function useAnimatedValues(count, initialValueFn) {
  const [values, set] = useSprings(
    count, 
    i => ensureObject(initialValueFn(i), KEY)
  )

  const setValues = React.useCallback( 
    fn => {
      set(i => ({ 
        ...ensureObject(fn(i), KEY), 
        immediate: true 
      }))
    }, 
    [set]
  )

  return [
    values.map(x => (KEY in x) ? x[KEY] : x), 
    setValues
  ]
}

function ensureObject(val, key) {
  if (typeof val === 'object' && !Array.isArray(val)) return val
  return { [key]: val }
}