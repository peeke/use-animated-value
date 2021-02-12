import { useSprings } from 'react-spring'

const KEY = Symbol()

export function useAnimatedValue(initialValue) {
  const [values, set] = useAnimatedValues(1, () => initialValue)

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
    values.map(x => x[KEY] || x), 
    setValues
  ]
}

function ensureObject(val, key) {
  if (typeof val === 'object' && !Array.isArray(val)) return val
  return { [key]: val }
}