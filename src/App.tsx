import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import { TopbarLayout } from '@/components/layout/topbar-layout';
import { Dashboard } from '@/pages/dashboard';
import { SigningPage } from '@/pages/signing';
import { TimestampPage } from '@/pages/timestamp';
import { TubitakPage } from '@/pages/tubitak';
import { CertificatesPage } from '@/pages/certificates';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TopbarLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="sign" element={<SigningPage />} />
            <Route path="timestamp" element={<TimestampPage />} />
            <Route path="tubitak" element={<TubitakPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
