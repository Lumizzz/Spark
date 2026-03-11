import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
        }}
      />
    </>
  );
}
