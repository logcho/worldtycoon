import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Button from '../../components/Button';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>

      {/* Header  */}
      <div className='flex flex-row justify-between items-center p-2 bg-black'>
        <h1 className='text-white font-semibold text-2xl'>
          World Tycoon
        </h1>
        <ConnectButton />
      </div>

      {/* Content  */}
      {/* h-[calc(100vh-64px)] calculated height from header  */}
      <div className='flex flex-row justify-center items-center h-[calc(100vh-64px)] w-screen'>
        <h1>play scene</h1>
        
      </div>
    </>
  );
};

export default Home;
