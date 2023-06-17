import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-center h-screen bg-pal-3">
      {session ? (
        <div className="grid m-auto text-center">
          <div className="m-4"> {session.user.name}님, 반가워요! </div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                      bg-pal-1 text-black
                      border border-pal-1 rounded
                      hover:text-pal-4 hover:border-pal-4 rounded`}
            onClick={() => router.push("/StartPage")}
          >
            하루상자
          </button>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                      bg-pal-2 text-black
                      border border-pal-1 rounded
                      hover:text-pal-4 hover:border-pal-4 rounded`}
            onClick={() => signOut()}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="grid m-auto text-center">
          <div className="m-4">안녕하세요! 저희는 팀 민준세수입니다. </div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                      bg-pal-2 text-black
                      border border-pal-1 rounded
                      hover:text-pal-4 hover:border-pal-4 rounded`}
            onClick={() => signIn()}
          >
            로그인
          </button>
        </div>
      )}
      <div style={{ position: 'absolute', top: '21%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <img src="/mjss.png" alt="Harubox Image" style={{ width: '200px' }} />
    </div>
    </div>
  );
}