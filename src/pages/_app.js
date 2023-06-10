import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const { session, ...restPageProps } = pageProps;
  const router = useRouter(); // useRouter를 사용하기 위해서는 next/router 모듈을 임포트해야 합니다.

  return (
    <SessionProvider session={session}>
      <AnimatePresence mode="wait" initial={false}>
        <Component {...restPageProps} key={router.asPath} />
      </AnimatePresence>
    </SessionProvider>
  );
}
