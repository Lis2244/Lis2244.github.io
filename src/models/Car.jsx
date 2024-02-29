import { useEffect, useRef } from 'react'

import carScene from '../assets/3d/tachka.glb'
import { useAnimations, useGLTF } from '@react-three/drei'

const Car = ({ isRotating, ...props }) => {
    const carRef = useRef();
    const { scene, animations } = useGLTF(carScene);
    const { actions } = useAnimations( animations, carRef );

    useEffect(() => {
      if(isRotating) {
        carRef.current.play();
      }
     }) /*else {
        actions['Take 001'].stop();
      }
    }, [actions, isRotating])  */


  return (
    <mesh { ...props } ref={carRef}>
        <primitive object={scene}/>
    </mesh>
  )
}

export default Car;