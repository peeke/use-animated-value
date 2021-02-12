import React from "react"
import { animated, interpolate } from 'react-spring'
import { useKeenSlider } from 'keen-slider/react'
import { useAnimatedValues, useAnimatedValue } from '@kaliber/use-animated-value'
import './App.css'

const images = [
  'https://source.unsplash.com/featured/1600x900/?nature,1',
  'https://source.unsplash.com/featured/1600x900/?nature,2',
  'https://source.unsplash.com/featured/1600x900/?nature,3',
  'https://source.unsplash.com/featured/1600x900/?nature,4',
]

import styles  from './App.css'

export default function App() {
  const [animatedProgress, setAnimatedProgress] = useAnimatedValue(0)
  const [animatedValues, setAnimatedValues] = useAnimatedValues(
    images.length, 
    () => ({ x: 0, scale: 1, opacity: 1 })
  )

  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: images.length,
    move(s) {
      const { positions: p, progressTrack } = s.details()
      setAnimatedProgress(progressTrack)
      setAnimatedValues(i => ({
        x: p[i].distance * 50,
        scale: 0.7 + 0.3 * p[i].portion,
        opacity: p[i].portion
      }))
    },
    initial: 1,
  })

  return (
    <div ref={sliderRef} className={styles.app}>
      <div className={styles.slides}>
        {images.map((src, i) => {
          const { x, scale, opacity } = animatedValues[i]
          return (
            <animated.div
              key={i}
              style={{
                opacity,
                transform: interpolate(
                  [x, scale], 
                  (x, scale) => `translate3d(${x}%, 0, 0) scale(${scale})`
                )
              }}
              className={styles.slide}
            >
              <img src={src} className={styles.image} />
            </animated.div>
          )
        })}
      </div>

      <div className={styles.progress}>
        <animated.div 
          className={styles.progressFill}
          style={{ transform: animatedProgress.interpolate(
            p => `scaleX(${p})`
          )}}
        />
      </div>
    </div>
  )
} 
