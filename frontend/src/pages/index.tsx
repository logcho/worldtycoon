import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Button from '../components/Button';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>

      {/* Header  */}
      <div className='flex flex-row justify-between items-center p-2 bg-black w-screen'>

        <h1 className='text-white font-semibold text-2xl'>
          World Tycoon
        </h1>
        <ConnectButton />

      </div>

      {/* Content  */}
      {/* h-[calc(100vh-64px)] calculated height from header  */}
      <div 
        className='flex flex-col justify-center items-center h-[calc(100vh-56px)] w-full bg-cover bg-center gap-y-2'
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        {/* Logo */}

        <img 
          src="/images/wtlogo.png" 
          alt="Logo" 
          className="mb-4 w-64 h-64 object-contain"
        />
        <Button 
          onClick={() => router.push('/play')}
          className='bg-black h-fit w-32'
        >
          <h1 className='text-white font-semibold text-2xl'>
            Play
          </h1>
        </Button>
        <Button 
          onClick={() => router.push('/play')}
          className='bg-black h-fit w-32'
        >
          <h1 className='text-white font-semibold text-2xl'>
            Create
          </h1>
        </Button>
      </div>
    </>
  );
};

export default Home;
