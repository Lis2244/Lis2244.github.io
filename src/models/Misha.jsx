import { useRef, useEffect } from 'react'

import mishaScene from '../assets/3d/Mihalich.glb';
import { useAnimations, useGLTF } from '@react-three/drei';

const Misha = () => {
  const mishaRef = useRef();
    const { scene, animations } = useGLTF(mishaScene)
    const { actions } = useAnimations(animations, mishaRef)
    console.log(scene);
/*
    useEffect(() => {
      actions['Take 001'].play();
    }, [])

*/
  return (
    <mesh position={[2, 4, -20]} rotation={[0, 0.3, 0]} ref={mishaRef}>
        <primitive object={scene}/>
    </mesh>
  )
}

export default Misha
