import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Camera,
  FileText,
  Headset,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Smile,
  X,
} from 'lucide-react';
import imgPlanOutLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';
import imgMessengerLogo from '@/assets/messenger-logo-transparent.png';
import { SecondaryButton } from '@/app/components/SecondaryButton';
export interface ContactTarget {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  logoColor: string;
  logoInitials: string;
}

interface OrganizerContactWidgetProps {
  contact: ContactTarget;
  hasPendingFormCard?: boolean;
  initiallyOpen?: boolean;
  showLauncher?: boolean;
  showContactMethods?: boolean;
  suggestedTopics?: string[];
  suggestedTopicReplies?: Record<string, string>;
  fullScreenOnMobile?: boolean;
  theme?: 'planout' | 'messenger';
  brandLogo?: 'planout' | 'messenger';
  title?: string;
  recipientLabel?: string;
  contextSummary?: string;
  onOpenChange?: (open: boolean) => void;
}

interface ContactMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

type ComposerMenu = 'attachments' | 'emoji' | null;

interface PendingAttachment {
  name: string;
  kind: 'photo' | 'file';
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '👏', '🙌', '🔥', '😊'];

function getInitialMessages(
  contact: ContactTarget,
  recipientLabel: string,
  showContactMethods: boolean,
  contextSummary?: string,
): ContactMessage[] {
  const instruction = showContactMethods
    ? `Choose a contact method below, or type a message to prepare your question for ${recipientLabel}.`
    : `Type a message to chat directly with ${contact.name}.`;
  const context = contextSummary ? ` about ${contextSummary}` : '';

  return [
    {
      id: `welcome-${contact.id}`,
      role: 'assistant',
      text: `Hi! You’re contacting ${contact.name}${context}. ${instruction}`,
    },
  ];
}

function getPhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function getEmailHref(email: string, contactName: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(`Question for ${contactName}`)}`;
}

export function OrganizerContactWidget({
  contact,
  hasPendingFormCard = false,
  initiallyOpen = false,
  showLauncher = true,
  showContactMethods = true,
  suggestedTopics = [],
  suggestedTopicReplies = {},
  fullScreenOnMobile = false,
  theme = 'planout',
  brandLogo = 'planout',
  title = 'Contact organizer',
  recipientLabel = 'organizer',
  contextSummary,
  onOpenChange,
}: OrganizerContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [messages, setMessages] = useState<ContactMessage[]>(() => getInitialMessages(contact, recipientLabel, showContactMethods, contextSummary));
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [composerMenu, setComposerMenu] = useState<ComposerMenu>(null);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const isOpenRef = useRef(initiallyOpen);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const isMessengerTheme = theme === 'messenger';
  const isMessengerLogo = brandLogo === 'messenger';
  const themeStyles = isMessengerTheme
    ? {
        header: 'border-[#0077e6] bg-[#0084ff] text-white',
        avatar: 'bg-white ring-white/50',
        status: 'border-[#0084ff] bg-[#31a24c]',
        heading: 'text-white',
        meta: 'text-white/80',
        metaBrand: 'text-white',
        close: 'text-white hover:bg-white/15 focus-visible:ring-white/60',
        body: 'bg-[#f0f2f5]',
        userBubble: 'bg-[#0084ff]',
        assistantBubble: 'border-[#e4e6eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
        card: 'border-[#e4e6eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        border: 'border-[#e4e6eb]',
        soft: 'bg-[#f0f2f5]',
        softHover: 'hover:bg-[#e4e6eb]',
        accentText: 'text-[#0084ff]',
        focusRing: 'focus-visible:ring-[#0084ff]/35',
        composer: 'bg-[#f0f2f5] ring-[#d6d9de]',
        composerBorder: 'border-[#dbe7f2]',
        popoverRing: 'ring-[#cfe4ff]',
        controlHover: 'hover:bg-[#e5f1ff]',
        controlFocus: 'focus-visible:ring-[#0084ff]/35',
        sendHover: 'hover:bg-[#dbeeff]',
        launcher: 'bg-[#0084ff] shadow-[0_12px_28px_-12px_rgba(0,132,255,0.68)] ring-1 ring-[#0084ff]/30',
        disabledText: 'disabled:text-[#9abfe8]',
        borderHover: 'hover:border-[#0084ff]/40',
      }
    : {
        header: 'border-[#d7e5e2] bg-white text-[#0f172a]',
        avatar: 'bg-[#e7f3ef] ring-[#d7e5e2]',
        status: 'border-white bg-[#31a24c]',
        heading: 'text-[#0f172a]',
        meta: 'text-[#64748b]',
        metaBrand: 'text-[#177564]',
        close: 'text-[#177564] hover:bg-[#edf7f4] focus-visible:ring-[#177564]/35',
        body: 'bg-[#f5faf8]',
        userBubble: 'bg-[#177564]',
        assistantBubble: 'border-[#e0ebe7] bg-white shadow-[0_1px_2px_rgba(15,118,100,0.08)]',
        card: 'border-[#d7e5e2] bg-white shadow-[0_1px_2px_rgba(15,118,100,0.06)]',
        border: 'border-[#d7e5e2]',
        soft: 'bg-[#f5faf8]',
        softHover: 'hover:bg-[#edf7f4]',
        accentText: 'text-[#177564]',
        focusRing: 'focus-visible:ring-[#177564]/35',
        composer: 'bg-[#f5faf8] ring-[#d7e5e2]',
        composerBorder: 'border-[#d7e5e2]',
        popoverRing: 'ring-[#d7e5e2]',
        controlHover: 'hover:bg-[#edf7f4]',
        controlFocus: 'focus-visible:ring-[#177564]/35',
        sendHover: 'hover:bg-[#dcefe9]',
        launcher: 'bg-[#e7f3ef] shadow-[0_12px_28px_-12px_rgba(23,117,100,0.68)] ring-1 ring-[#177564]/20',
        disabledText: 'disabled:text-[#a8c2ba]',
        borderHover: 'hover:border-[#177564]/40',
      };
  const emailLabel = recipientLabel === 'organizer' ? 'Email organizer' : `Email ${recipientLabel}`;
  const callLabel = recipientLabel === 'organizer' ? 'Call organizer' : `Call ${recipientLabel}`;
  const closeLabel = recipientLabel === 'organizer' ? 'Close contact organizer' : `Close ${title}`;

  const setContactOpen = (open: boolean) => {
    isOpenRef.current = open;
    setIsOpen(open);
    if (open) setUnreadCount(0);
    onOpenChange?.(open);
  };

  useEffect(() => {
    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = null;
    isOpenRef.current = initiallyOpen;
    setIsOpen(initiallyOpen);
    setMessages(getInitialMessages(contact, recipientLabel, showContactMethods, contextSummary));
    setMessageInput('');
    setIsTyping(false);
    setUnreadCount(0);
    setComposerMenu(null);
    setPendingAttachment(null);

    return () => {
      if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    };
  }, [contact.id, contextSummary, initiallyOpen, recipientLabel, showContactMethods]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContactOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => () => {
    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
  }, []);

  const queueAssistantResponse = (message: string, automatedResponse?: string) => {
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
        {
          id: `${exchangeId}-assistant`,
          role: 'assistant',
          text: automatedResponse
            ?? (showContactMethods
              ? `Your message is ready for ${contact.name}. Use Email ${recipientLabel} above to send it directly from your mail app.`
              : `Your message is ready for ${contact.name}. Messenger will deliver it directly to their business inbox.`),
        },
      ]);
      setIsTyping(false);
      if (!isOpenRef.current) setUnreadCount((current) => current + 1);
      replyTimerRef.current = null;
    }, 420);
  };

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    kind: PendingAttachment['kind'],
  ) => {
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
    );
  };

  const bottomOffset = hasPendingFormCard
    ? 'bottom-[calc(220px+env(safe-area-inset-bottom))] md:bottom-[152px]'
    : 'bottom-[calc(88px+env(safe-area-inset-bottom))] md:bottom-6';
  const panelClassName = fullScreenOnMobile
    ? 'fixed inset-0 flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-none md:absolute md:inset-auto md:bottom-[calc(100%+12px)] md:right-0 md:h-auto md:max-h-[min(640px,calc(100dvh-180px))] md:w-[min(400px,calc(100vw-32px))] md:rounded-[24px] md:shadow-[0_24px_64px_-20px_rgba(15,23,42,0.4)]'
    : 'absolute bottom-[calc(100%+12px)] right-0 flex w-[min(400px,calc(100vw-32px))] max-h-[min(640px,calc(100dvh-180px))] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_-20px_rgba(15,23,42,0.4)]';
  const headerClassName = fullScreenOnMobile
    ? `flex min-h-[76px] shrink-0 items-center justify-between gap-3 border-b px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] md:px-5 md:py-3 ${themeStyles.header}`
    : `flex min-h-[76px] shrink-0 items-center justify-between gap-3 border-b px-4 py-3 md:px-5 ${themeStyles.header}`;

  return (
    <div
      data-contact-theme={theme}
      className={`fixed right-4 z-[60] sm:right-6 md:right-8 ${bottomOffset}`}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            key="organizer-contact-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            aria-label={`Contact ${contact.name}`}
            data-contact-context={contextSummary || undefined}
            className={panelClassName}
          >
            <header className={headerClassName}>
              <div className="flex min-w-0 items-center gap-3">
                <div className={`relative flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ${themeStyles.avatar}`}>
                      <img
                        src={isMessengerLogo ? imgMessengerLogo : imgPlanOutLogo}
                        alt={isMessengerLogo ? 'Messenger logo' : 'PlanOut logo'}
                        className={isMessengerLogo ? 'size-8 object-contain' : 'size-[29px] object-contain'}
                      />
                  <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 ${themeStyles.status}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 id={titleId} className={`truncate text-[15px] font-semibold leading-tight ${themeStyles.heading}`}>
                    {title}
                  </h2>
                  <p className={`mt-1 flex min-w-0 items-center gap-1.5 truncate text-[12px] ${themeStyles.meta}`}>
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
                      style={{ backgroundColor: contact.logoColor }}
                      aria-hidden="true"
                    >
                      {contact.logoInitials}
                    </span>
                    <span className="truncate">{contact.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`shrink-0 ${themeStyles.metaBrand}`}>
                      {isMessengerTheme ? 'Messenger · PlanOut' : 'Powered by PlanOut'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none active:scale-[0.96] ${themeStyles.close}`}
                aria-label={closeLabel}
              >
                <X className="h-[19px] w-[19px]" aria-hidden="true" />
              </button>
            </header>

            <div className={`scrollbar-none flex min-h-0 flex-1 flex-col space-y-3 overflow-y-auto px-4 pb-5 pt-6 md:px-5 ${themeStyles.body}`}>
              {contextSummary && (
                <div
                  data-testid="contact-context"
                  className={`rounded-[14px] border px-3 py-2.5 ${themeStyles.card}`}
                >
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${themeStyles.meta}`}>
                    Regarding
                  </p>
                  <p className="mt-1 text-[12px] font-semibold leading-[1.35] text-[#0f172a]">
                    {contextSummary}
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === 'user'
                    ? `ml-auto max-w-[84%] rounded-[18px] rounded-tr-md px-3.5 py-3 text-[13px] leading-[1.45] text-white ${themeStyles.userBubble}`
                    : `max-w-[84%] rounded-[18px] rounded-tl-md border px-3.5 py-3 text-[13px] leading-[1.45] text-[#0f172a] ${themeStyles.assistantBubble}`}
                >
                  {message.text}
                </div>
              ))}

              {isTyping && (
                <div className={`max-w-[84%] rounded-[18px] rounded-tl-md border px-3.5 py-3 text-[12px] ${themeStyles.meta} ${themeStyles.assistantBubble}`} aria-live="polite">
                  {isMessengerTheme ? 'PlanOut Support is typing…' : 'PlanOut is preparing a response…'}
                </div>
              )}

              {suggestedTopics.length > 0 && (
                <div className={`rounded-[18px] border p-3.5 ${themeStyles.card}`}>
                  <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold text-[#0f172a]">
                    <MessageSquare className={`h-4 w-4 ${themeStyles.accentText}`} aria-hidden="true" />
                    <span>Suggested topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => queueAssistantResponse(topic, suggestedTopicReplies[topic])}
                        disabled={isTyping}
                        className={`rounded-full border px-3 py-2 text-left text-[12px] font-semibold leading-tight transition-colors focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${themeStyles.border} ${themeStyles.borderHover} ${themeStyles.soft} ${themeStyles.accentText} ${themeStyles.softHover} ${themeStyles.focusRing}`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showContactMethods && (
                <div className={`rounded-[18px] border p-3.5 ${themeStyles.card}`}>
                  <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold text-[#0f172a]">
                    <MessageSquare className={`h-4 w-4 ${themeStyles.accentText}`} aria-hidden="true" />
                    <span>Choose how to contact {contact.name}</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {contact.email && (
                      <a
                        href={getEmailHref(contact.email, contact.name)}
                        aria-label={`Email ${contact.name}`}
                        className={`flex min-w-0 items-center gap-2.5 rounded-[13px] border px-3 py-2.5 transition-colors focus-visible:outline-none active:scale-[0.98] ${themeStyles.border} ${themeStyles.borderHover} ${themeStyles.soft} ${themeStyles.accentText} ${themeStyles.softHover} ${themeStyles.focusRing}`}
                      >
                        <Mail className="size-4 shrink-0" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-[12px] font-semibold leading-tight">{emailLabel}</span>
                          <span className={`mt-0.5 block truncate text-[10px] ${themeStyles.meta}`}>{contact.email}</span>
                        </span>
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={getPhoneHref(contact.phone)}
                        aria-label={`Call ${contact.name}`}
                        className={`flex min-w-0 items-center gap-2.5 rounded-[13px] border px-3 py-2.5 transition-colors focus-visible:outline-none active:scale-[0.98] ${themeStyles.border} ${themeStyles.borderHover} ${themeStyles.soft} ${themeStyles.accentText} ${themeStyles.softHover} ${themeStyles.focusRing}`}
                      >
                        <Phone className="size-4 shrink-0" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-[12px] font-semibold leading-tight">{callLabel}</span>
                          <span className={`mt-0.5 block truncate text-[10px] ${themeStyles.meta}`}>{contact.phone}</span>
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={`relative shrink-0 border-t bg-white px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 md:px-5 md:pb-4 ${themeStyles.composerBorder}`}>
              <AnimatePresence initial={false}>
                {composerMenu === 'attachments' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0 : 0.14, ease: 'easeOut' }}
                    role="menu"
                    aria-label="Attachment options"
                    className={`absolute bottom-[calc(100%+8px)] left-3 z-10 min-w-[166px] rounded-[14px] bg-white p-1.5 shadow-[0_12px_26px_-12px_rgba(15,23,42,0.35)] ring-1 ${themeStyles.popoverRing}`}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => photoInputRef.current?.click()}
                      className={`flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12px] font-semibold text-[#0f172a] transition-colors focus-visible:outline-none ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
                    >
                      <ImageIcon className={`h-4 w-4 ${themeStyles.accentText}`} aria-hidden="true" />
                      Photo or video
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12px] font-semibold text-[#0f172a] transition-colors focus-visible:outline-none ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
                    >
                      <FileText className={`h-4 w-4 ${themeStyles.accentText}`} aria-hidden="true" />
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
                    className={`absolute bottom-[calc(100%+8px)] right-3 z-10 grid grid-cols-4 gap-1 rounded-[14px] bg-white p-2 shadow-[0_12px_26px_-12px_rgba(15,23,42,0.35)] ring-1 ${themeStyles.popoverRing}`}
                  >
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className={`flex size-9 items-center justify-center rounded-[9px] text-[20px] transition-colors focus-visible:outline-none ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
                        aria-label={`Add ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {pendingAttachment && (
                <div className={`mb-2 flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[11px] ${themeStyles.soft} ${themeStyles.meta}`}>
                  {pendingAttachment.kind === 'photo'
                    ? <ImageIcon className={`h-4 w-4 shrink-0 ${themeStyles.accentText}`} aria-hidden="true" />
                    : <FileText className={`h-4 w-4 shrink-0 ${themeStyles.accentText}`} aria-hidden="true" />}
                  <span className="min-w-0 flex-1 truncate">{pendingAttachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-white hover:text-[#0f172a] focus-visible:outline-none ${themeStyles.controlFocus}`}
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

              <form onSubmit={handleSend} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div role="toolbar" aria-label="Message actions" className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Add attachment"
                    aria-haspopup="menu"
                    aria-expanded={composerMenu === 'attachments'}
                    onClick={() => setComposerMenu((menu) => menu === 'attachments' ? null : 'attachments')}
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none md:size-10 ${themeStyles.accentText} ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
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
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none md:size-10 ${themeStyles.accentText} ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
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
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none md:size-10 ${themeStyles.accentText} ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
                  >
                    <ImageIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Add emoji"
                    aria-haspopup="dialog"
                    aria-expanded={composerMenu === 'emoji'}
                    onClick={() => setComposerMenu((menu) => menu === 'emoji' ? null : 'emoji')}
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none md:size-10 ${themeStyles.accentText} ${themeStyles.controlHover} ${themeStyles.controlFocus}`}
                  >
                    <Smile className="h-[18px] w-[18px]" aria-hidden="true" />
                  </button>
                </div>
                <div className={`flex w-full min-w-0 flex-1 items-center gap-2 rounded-full px-3.5 py-3 ring-1 ring-inset ${themeStyles.composer}`}>
                  <input
                    type="text"
                    enterKeyHint="send"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Write a message"
                    aria-label={`Message ${contact.name}`}
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b]"
                  />
                  <button
                    type="submit"
                    disabled={(!messageInput.trim() && !pendingAttachment) || isTyping}
                    aria-label="Send message"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none disabled:cursor-not-allowed ${themeStyles.accentText} ${themeStyles.sendHover} ${themeStyles.controlFocus} ${themeStyles.disabledText}`}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {showLauncher && (
        <button
          type="button"
          onClick={() => setContactOpen(!isOpenRef.current)}
          aria-expanded={isOpen}
          aria-label={isOpen
            ? closeLabel
            : unreadCount > 0
              ? `Contact ${contact.name}, ${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`
              : `Contact ${contact.name}`}
          title="Contact organizer"
          className={`relative flex size-12 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 active:scale-[0.96] motion-reduce:transition-none ${themeStyles.launcher} ${themeStyles.controlFocus}`}
        >
          <Headset
            className={isMessengerTheme ? 'size-7 text-white' : 'size-7 text-[#177564]'}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          {unreadCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#d84b4b] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white"
              aria-hidden="true"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export function ContactOrganizerButton({
  onClick,
  className = '',
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <SecondaryButton
      type="button"
      onClick={onClick}
      aria-label="Contact organizer"
      title="Contact organizer"
      compact
      className={className}
    >
      <Headset className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
      Contact organizer
    </SecondaryButton>
  );
}
