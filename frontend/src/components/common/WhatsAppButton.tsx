import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '@/constants';

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
