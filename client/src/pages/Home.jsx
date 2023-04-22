import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import {
  headContainerAnimation,
  headTextAnimation, 
  headContentAnimation,
  slideAnimation,
} from '../config/motion/'
import state from '../store/index'

const Home = () => {
  const snap = useSnapshot(state)
  return (
    <AnimatePresence>
      {snap.intro && (
      <motion.section className='home' {...slideAnimation('left')}>
        <motion.header>
          <img src='/threejs.png' alt='threejs'  className=' w-8 h-8 object-contain'/>
        </motion.header>
        </motion.section>
        )}
      </AnimatePresence>
  )
}

export default Home