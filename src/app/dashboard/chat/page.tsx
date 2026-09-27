import { Suspense } from 'react';
import { MainChat } from './components/MainChat';

export default function ChatPage() {
  // useSearchParams (conversation ouverte) exige une frontière Suspense
  return (
    <Suspense>
      <MainChat />
    </Suspense>
  );
}
