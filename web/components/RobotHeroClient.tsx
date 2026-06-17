'use client';

import dynamic from 'next/dynamic';

// WebGL only runs in the browser, so load the 3D scene client-side with no SSR.
const RobotHero = dynamic(() => import('./RobotHero'), { ssr: false });

export default function RobotHeroClient() {
  return <RobotHero />;
}
