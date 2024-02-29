import { Suspense, useState } from "react";
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Deshino from '../models/Deshino';
import Sky from '../models/Sky';
import Misha from '../models/Misha';
import Plane from '../models/Plane';
import HomeInfo from "../components/HomeInfo";

{/*<div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
        POPUP
      </div>*/}

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);



  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, 0, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustDeshinoForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, 0, -43.4];
    } else {
      screenScale = [1.1, 1.1, 1.1];
      screenPosition = [0, 1, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [deshinoScale, deshinoPosition] = adjustDeshinoForScreenSize();
  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();

  return (
    <section className="w-full h-screen relative">
      <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage}/>}
      </div>
      <Canvas 
      className={`w-full h-screen bg-transparent ${isRotating ? "cursor-grabbing" : "cursor-grab"}`}
      camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader/>}>
          <directionalLight position={[-4, 10, 1]} intensity={1}/>
          <ambientLight intensity={0.5}/>
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1}/>
          <Misha/>
          <Sky
          isRotating={isRotating}
          />
          <Deshino
          position={deshinoPosition}
          rotation={[0.2, 4.7077, 0]}
          scale={deshinoScale}
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          setCurrentStage={setCurrentStage}
          />
          <Plane
          isRotating={isRotating}
          biplaneScale={biplaneScale}
          biplanePosition={biplanePosition}
          rotation={[0, 20, 0]}
          position={biplanePosition}
          scale={biplaneScale}
          />
        </Suspense>
      </Canvas>
    </section>
  )
}

export default Home