import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import scopedStyles from './Layout1.module.scss';

interface Props {
  children: ReactNode;
}

const Layout1: FC<Props> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <header className={scopedStyles['header']}>
        <Link href="/">
          <h1 className={scopedStyles['logo']}>
            File Upload <span className={scopedStyles['bold']}>Service</span>
          </h1>
        </Link>

        <nav className={scopedStyles['main-nav']}>
          <Link href="/">
            <a className={router.pathname == '/' ? scopedStyles['active'] : ''}>Home</a>
          </Link>
          <Link href="/image">
            <a className={router.pathname == '/image' ? scopedStyles['active'] : ''}>Images</a>
          </Link>
        </nav>
      </header>

      <main className={scopedStyles['main-content']}>{children}</main>
    </>
  );
};

export default Layout1;
