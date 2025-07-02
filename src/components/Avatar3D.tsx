import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function CuteAvatar() {
	const group = useRef<THREE.Group>(null);

	// Animate rotation
	useFrame(() => {
		if (group.current) {
			group.current.rotation.y += 0.005;
		}
	});

	// Materials
	const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
	const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6699cc });
	const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

	// Smile shape (semi-circle)
	const smileShape = new THREE.Shape();
	smileShape.absarc(0, 0, 0.25, 0, Math.PI, false);
	const smileGeo = new THREE.ExtrudeGeometry(smileShape, {
		depth: 0.02,
		bevelEnabled: false,
	});

	return (
		<group ref={group}>
			{/* Head */}
			<mesh position={[0, 1.3, 0]} material={skinMat}>
				<sphereGeometry args={[0.5, 32, 32]} />
			</mesh>
			{/* Body */}
			<mesh position={[0, 0.6, 0]} material={bodyMat}>
				<cylinderGeometry args={[0.4, 0.5, 0.8, 32]} />
			</mesh>
			{/* Eyes */}
			<mesh position={[-0.15, 1.4, 0.46]} material={eyeMat}>
				<sphereGeometry args={[0.05, 16, 16]} />
			</mesh>
			<mesh position={[0.15, 1.4, 0.46]} material={eyeMat}>
				<sphereGeometry args={[0.05, 16, 16]} />
			</mesh>
			{/* Smile */}
			<mesh
				geometry={smileGeo}
				material={eyeMat}
				position={[0, 1.2, 0.48]}
				rotation={[-Math.PI / 2, 0, 0]}
			/>
		</group>
	);
}

export function Avatar3D() {
	return (
		<Canvas
			camera={{ position: [0, 1.5, 3], fov: 40 }}
			style={{ width: "100%", height: "100%" }}
		>
			<hemisphereLight args={[0xffffff, 0x444444, 1.2]} />
			<directionalLight position={[5, 10, 7]} intensity={0.8} />
			<CuteAvatar />
			<OrbitControls enablePan={false} />
		</Canvas>
	);
}
