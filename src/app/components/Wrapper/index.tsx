import { ReactNode } from 'react';

type WrapperProps = {
  children: ReactNode;
};

export function Wrapper({ children }: WrapperProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      {children}
    </div>
  );
}
