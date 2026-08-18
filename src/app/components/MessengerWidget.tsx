import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Camera, FileText, Image as ImageIcon, Info, Plus, Send, Smile, X } from 'lucide-react';
import imgPlanOutLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';
import imgMessengerLogo from '@/assets/messenger-logo-transparent.png';

interface MessengerWidgetProps {
  hasPendingFormCard?: boolean;
}

interface QuickReply {
  label: string;
  message: string;
  response: string;
}

interface MessengerMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

const QUICK_REPLIES: QuickReply[] = [
  {
    label: 'Find an event',
    message: 'I want to find an event.',
    response: 'Open Events to browse races and activities near you.',
  },
  {
    label: 'Manage my Passport',
    message: 'How do I manage my Passport?',
    response: 'Your Passport keeps the entries and events you can personally access.',
  },
  {
    label: 'Question about my order',
    message: 'I have a question about my order.',
    response: 'Orders keeps the tickets and forms your account bought or manages.',
  },
];

const INITIAL_MESSAGES: MessengerMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Hi! I’m the PlanOut team. How can we help with your registration?',
  },
];

const GENERIC_RESPONSE = 'Thanks for reaching out. A member of the PlanOut team will get back to you shortly.';
const ATTACHMENT_RESPONSE = 'Thanks — your attachment has been added to the conversation.';
const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '👏', '🙌', '🔥', '😊'];

type ComposerMenu = 'attachments' | 'emoji' | null;

interface PendingAttachment {
  name: string;
  kind: 'photo' | 'file';
}

function MessengerMark({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} aria-hidden="true">
      <img src={imgMessengerLogo} alt="" className="size-full object-contain" />
    </span>
  );
}

export function MessengerWidget({ hasPendingFormCard = false }: MessengerWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessengerMessage[]>(INITIAL_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [composerMenu, setComposerMenu] = useState<ComposerMenu>(null);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const isOpenRef = useRef(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  const setMessengerOpen = (open: boolean) => {
    isOpenRef.current = open;
    setIsOpen(open);
    if (open) setUnreadCount(0);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMessengerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => () => {
    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
  }, []);

  const queueAssistantResponse = (message: string, response: string) => {
    const exchangeId = `${Date.now()}-${message}`;
    setMessages((current) => [
      ...current,
      { id: `${exchangeId}-user`, role: 'user', text: message },
    ]);
    setIsTyping(true);

    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `${exchangeId}-assistant`, role: 'assistant', text: response },
      ]);
      setIsTyping(false);
      if (!isOpenRef.current) setUnreadCount((current) => current + 1);
      replyTimerRef.current = null;
    }, 420);
  };

  const handleQuickReply = (reply: QuickReply) => {
    if (isTyping) return;
    setComposerMenu(null);
    queueAssistantResponse(reply.message, reply.response);
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>, kind: PendingAttachment['kind']) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingAttachment({ name: file.name, kind });
    setComposerMenu(null);
    event.target.value = '';
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((current) => `${current}${emoji}`);
    setComposerMenu(null);
  };

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isTyping) return;

    const message = messageInput.trim();
    const attachment = pendingAttachment;
    if (!message && !attachment) return;

    setMessageInput('');
    setPendingAttachment(null);
    queueAssistantResponse(
      attachment
        ? `${attachment.kind === 'photo' ? 'Photo' : 'File'} attached: ${attachment.name}${message ? ` — ${message}` : ''}`
        : message,
      attachment ? ATTACHMENT_RESPONSE : GENERIC_RESPONSE,
    );
  };

  const bottomOffset = hasPendingFormCard
    ? 'bottom-[calc(220px+env(safe-area-inset-bottom))] md:bottom-[152px]'
    : 'bottom-[calc(88px+env(safe-area-inset-bottom))] md:bottom-6';

  return (
    <div className={`fixed right-4 z-[60] sm:right-6 md:right-8 ${bottomOffset}`}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            key="messenger-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            aria-label="Messenger conversation"
            className="absolute bottom-[calc(100%+12px)] right-0 flex w-[min(400px,calc(100vw-32px))] max-h-[min(640px,calc(100dvh-180px))] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_-20px_rgba(15,23,42,0.4)]"
          >
            <header className="flex min-h-[68px] shrink-0 items-center justify-between gap-3 border-b border-[#e4e6eb] bg-white px-4 py-3 text-[#050505] md:min-h-[76px] md:px-5">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e7f3ef] ring-1 ring-[#d7e5e2]">
                  <img src={imgPlanOutLogo} alt="PlanOut logo" className="size-[29px] object-contain" />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#31a24c]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 id={titleId} aria-label="PlanOut Messenger" className="truncate text-[15px] font-semibold leading-tight">PlanOut</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#65676b]">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isTyping ? 'bg-[#0084ff]' : 'bg-[#31a24c]'}`}
                      aria-hidden="true"
                    />
                    <span role="status" aria-live="polite">{isTyping ? 'Typing…' : 'Active now'}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 text-[#0084ff]">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35"
                  aria-label="Messenger details"
                >
                  <Info className="h-[19px] w-[19px]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setMessengerOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35"
                  aria-label="Close Messenger"
                >
                  <X className="h-[19px] w-[19px]" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="scrollbar-none flex min-h-0 flex-1 flex-col space-y-3 overflow-y-auto bg-[#f0f2f5] px-4 pb-5 pt-6 md:px-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === 'user'
                    ? 'ml-auto max-w-[84%] rounded-[18px] rounded-tr-md bg-[#0084ff] px-3.5 py-3 text-[13px] leading-[1.45] text-white'
                    : 'max-w-[84%] rounded-[18px] rounded-tl-md bg-white px-3.5 py-3 text-[13px] leading-[1.45] text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.12)]'}
                >
                  {message.text}
                </div>
              ))}
              {isTyping && (
                <div className="max-w-[84%] rounded-[18px] rounded-tl-md bg-white px-3.5 py-3 text-[12px] text-[#65676b] shadow-[0_1px_2px_rgba(0,0,0,0.12)]" aria-live="polite">
                  PlanOut is typing…
                </div>
              )}
              <div className="pt-2">
                <p className="mb-2.5 text-[12px] font-semibold text-[#65676b]">Quick replies</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.label}
                      type="button"
                      onClick={() => handleQuickReply(reply)}
                      disabled={isTyping}
                      className="rounded-full border border-[#ccd0d5] bg-white px-3 py-2 text-left text-[11px] font-semibold text-[#0084ff] transition-colors hover:bg-[#f5f6f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/45 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative shrink-0 border-t border-[#e4e6eb] bg-white px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 md:px-5 md:pb-4">
              <AnimatePresence initial={false}>
                {composerMenu === 'attachments' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0 : 0.14, ease: 'easeOut' }}
                    role="menu"
                    aria-label="Attachment options"
                    className="absolute bottom-[calc(100%+8px)] left-3 z-10 min-w-[166px] rounded-[14px] bg-white p-1.5 shadow-[0_12px_26px_-12px_rgba(15,23,42,0.35)] ring-1 ring-[#e4e6eb]"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => photoInputRef.current?.click()}
                      className="flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12px] font-semibold text-[#050505] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35"
                    >
                      <ImageIcon className="h-4 w-4 text-[#0084ff]" aria-hidden="true" />
                      Photo or video
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12px] font-semibold text-[#050505] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35"
                    >
                      <FileText className="h-4 w-4 text-[#0084ff]" aria-hidden="true" />
                      File
                    </button>
                  </motion.div>
                )}
                {composerMenu === 'emoji' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0 : 0.14, ease: 'easeOut' }}
                    role="dialog"
                    aria-label="Emoji picker"
                    className="absolute bottom-[calc(100%+8px)] right-3 z-10 grid grid-cols-4 gap-1 rounded-[14px] bg-white p-2 shadow-[0_12px_26px_-12px_rgba(15,23,42,0.35)] ring-1 ring-[#e4e6eb]"
                  >
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="flex size-9 items-center justify-center rounded-[9px] text-[20px] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35"
                        aria-label={`Add ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {pendingAttachment && (
                <div className="mb-2 flex items-center gap-2 rounded-[10px] bg-[#f0f2f5] px-2.5 py-2 text-[11px] text-[#65676b]">
                  {pendingAttachment.kind === 'photo'
                    ? <ImageIcon className="h-4 w-4 shrink-0 text-[#0084ff]" aria-hidden="true" />
                    : <FileText className="h-4 w-4 shrink-0 text-[#0084ff]" aria-hidden="true" />}
                  <span className="min-w-0 flex-1 truncate">{pendingAttachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-[#65676b] transition-colors hover:bg-white hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => handleAttachmentChange(event, 'photo')}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(event) => handleAttachmentChange(event, 'photo')}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <input
                ref={fileInputRef}
                type="file"
                onChange={(event) => handleAttachmentChange(event, 'file')}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />

              <form onSubmit={handleSend} className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Add attachment"
                  aria-haspopup="menu"
                  aria-expanded={composerMenu === 'attachments'}
                  onClick={() => setComposerMenu((menu) => menu === 'attachments' ? null : 'attachments')}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#0084ff] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35 md:size-10"
                >
                  <Plus className="h-[19px] w-[19px]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Open camera"
                  onClick={() => {
                    setComposerMenu(null);
                    cameraInputRef.current?.click();
                  }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#0084ff] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35 md:size-10"
                >
                  <Camera className="h-[17px] w-[17px]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Add photo"
                  onClick={() => {
                    setComposerMenu(null);
                    photoInputRef.current?.click();
                  }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#0084ff] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35 md:size-10"
                >
                  <ImageIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Add emoji"
                  aria-haspopup="dialog"
                  aria-expanded={composerMenu === 'emoji'}
                  onClick={() => setComposerMenu((menu) => menu === 'emoji' ? null : 'emoji')}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#0084ff] transition-colors hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35 md:size-10"
                >
                  <Smile className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f0f2f5] px-3.5 py-3">
                  <input
                    type="text"
                    enterKeyHint="send"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Aa"
                    aria-label="Message PlanOut"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#050505] outline-none placeholder:text-[#65676b]"
                  />
                  <button
                    type="submit"
                    disabled={(!messageInput.trim() && !pendingAttachment) || isTyping}
                    aria-label="Send message"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#0084ff] transition-colors hover:bg-[#dcecff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff]/35 disabled:cursor-not-allowed disabled:text-[#bcc0c4]"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setMessengerOpen(!isOpenRef.current)}
        aria-expanded={isOpen}
        aria-label={isOpen
          ? 'Close Messenger'
          : unreadCount > 0
            ? `Open Messenger, ${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`
            : 'Open Messenger'}
        className="relative flex size-12 items-center justify-center rounded-full bg-transparent shadow-[0_12px_28px_-12px_rgba(0,106,255,0.68)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006aff]/25 active:scale-95 motion-reduce:transition-none"
      >
        <MessengerMark className="size-10" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#fa3e3e] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white"
            aria-hidden="true"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
