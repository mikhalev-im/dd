import { ReactElement } from 'react';
import Header from './header';

interface PageWrapperProps {
  children: ReactElement | ReactElement[];
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div>
      <Header />

      <main className='container mx-auto text-gray-700'>
        {children}
      </main>
    </div>
  );
}

export default PageWrapper;
