import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ProfileContent from 'components/Profile/profileContent';

export default function Home() {
  const userinfo = useSelector((state) => state.user.userinfo);
  const router = useRouter();
  // useEffect(() => {
  //   if (userinfo?.id) {
  //     router.push(`/dashboard`);
  //   }
  // }, [userinfo?.id]);
  return (
    <>
      <div className={styles.container}>
        <>
          <ProfileContent id={userinfo?.id} />
        </>
      </div>
    </>
  );
}
