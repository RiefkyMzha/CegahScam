import type { OfficialContact } from "../lib/risk";

type OfficialContactsProps = {
  contacts: OfficialContact[];
  variant?: "light" | "dark";
};

type ContactChannel = "phone" | "whatsapp" | "email" | "instagram" | "x";

function getPhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function getWhatsAppUrl(value: string) {
  const digits = getPhoneDigits(value);
  const internationalNumber = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits;

  return /^\d{8,15}$/.test(internationalNumber)
    ? `https://wa.me/${internationalNumber}`
    : undefined;
}

function getEmailHref(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? `mailto:${value}`
    : undefined;
}

function getInstagramHref(value: string) {
  const handle = value.trim().replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(handle)
    ? `https://www.instagram.com/${handle}/`
    : undefined;
}

function getXHref(value: string) {
  const handle = value.trim().replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(handle)
    ? `https://x.com/${handle}`
    : undefined;
}

function ContactIcon({ channel }: { channel: ContactChannel }) {
  const commonProps = {
    "aria-hidden": true as const,
    className: "h-3.5 w-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (channel) {
    case "phone":
      return (
        <svg {...commonProps}>
          <path
            d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.5.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17.9 17.9 0 0 1 2.9 4.3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.5 1 1 0 0 1-.2 1Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...commonProps}>
          <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
          <path d="M9 8.5c.3-.6.7-.5 1-.5l.8 1.8-.8 1a6 6 0 0 0 2.8 2.8l1-.8 1.8.8c0 .4.1.8-.5 1.1-.7.4-1.6.4-2.4 0a9 9 0 0 1-4-4c-.4-.8-.4-1.7.3-2.2Z" />
        </svg>
      );
    case "email":
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m4.5 7 7.5 5.5L19.5 7" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.8" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg {...commonProps}>
          <path d="m5 4 14 16M19 4 5 20" />
        </svg>
      );
  }
}

const channelStyles: Record<ContactChannel, { backgroundColor: string; color: string }> = {
  phone: { backgroundColor: "#FDEBEC", color: "#F04452" },
  whatsapp: { backgroundColor: "#E8F7EE", color: "#209653" },
  email: { backgroundColor: "#E8F2FF", color: "#3483E8" },
  instagram: { backgroundColor: "#FCEAF2", color: "#D94686" },
  x: { backgroundColor: "#E9EDF1", color: "#344054" },
};

function ContactRow({
  channel,
  label,
  value,
  href,
  dark,
}: {
  channel: ContactChannel;
  label: string;
  value: string;
  href?: string;
  dark: boolean;
}) {
  const className = `flex min-w-0 items-center gap-2 text-xs leading-5 ${
    dark ? "text-white/90" : "text-[#446685]"
  }`;
  const content = (
    <>
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={channelStyles[channel]}
      >
        <ContactIcon channel={channel} />
      </span>
      <span className="break-words">{value}</span>
    </>
  );

  return href ? (
    <a
      href={href}
      className={`${className} transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52789A]`}
      aria-label={`${label}: ${value}`}
      target={channel === "whatsapp" || channel === "instagram" || channel === "x" ? "_blank" : undefined}
      rel={channel === "whatsapp" || channel === "instagram" || channel === "x" ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    <span className={className} aria-label={`${label}: ${value}`}>
      {content}
    </span>
  );
}

export default function OfficialContacts({
  contacts,
  variant = "light",
}: OfficialContactsProps) {
  const dark = variant === "dark";

  return (
    <div className="flex flex-col">
      {contacts.map((contact, index) => {
        const phone = contact.phone?.trim() ?? "";
        const phoneDigits = getPhoneDigits(phone);
        const whatsapp = contact.whatsapp?.trim() ?? "";
        const whatsappUrl = whatsapp ? getWhatsAppUrl(whatsapp) : undefined;
        const email = contact.email?.trim() ?? "";
        const emailHref = email ? getEmailHref(email) : undefined;
        const instagram = contact.instagram?.trim() ?? "";
        const instagramHref = instagram
          ? getInstagramHref(instagram)
          : undefined;
        const twitterAccounts = (contact.twitter?.split("/") ?? [])
          .map((account) => account.trim())
          .filter(Boolean);
        const hasDivider = index < contacts.length - 1;

        return (
          <div
            key={`${contact.name}-${index}`}
            className={`flex flex-col gap-2.5 py-3 first:pt-0 last:pb-0 ${
              hasDivider ? "border-b" : ""
            }`}
            style={
              hasDivider
                ? {
                    borderBottomColor: dark
                      ? "rgba(47, 102, 152, 0.5)"
                      : "#D7E1EA",
                  }
                : undefined
            }
          >
            <p className={`break-words text-sm font-semibold ${dark ? "text-white" : "text-[#344054]"}`}>
              {contact.name}
            </p>
            <div className="flex flex-col gap-1.5">
              {phone &&
                (phoneDigits ? (
                  <ContactRow
                    channel="phone"
                    label="Telepon"
                    value={phone}
                    href={`tel:${phoneDigits}`}
                    dark={dark}
                  />
                ) : (
                  <ContactRow channel="phone" label="Telepon" value={phone} dark={dark} />
                ))}

              {whatsapp && (
                <ContactRow
                  channel="whatsapp"
                  label="WhatsApp"
                  value={whatsapp}
                  href={whatsappUrl}
                  dark={dark}
                />
              )}

              {email && (
                <ContactRow
                  channel="email"
                  label="Email"
                  value={email}
                  href={emailHref}
                  dark={dark}
                />
              )}

              {instagram && (
                <ContactRow
                  channel="instagram"
                  label="Instagram"
                  value={instagram.startsWith("@") ? instagram : `@${instagram}`}
                  href={instagramHref}
                  dark={dark}
                />
              )}

              {twitterAccounts.map((account, accountIndex) => (
                <ContactRow
                  key={`${account}-${accountIndex}`}
                  channel="x"
                  label="X"
                  value={account.startsWith("@") ? account : `@${account}`}
                  href={getXHref(account)}
                  dark={dark}
                />
              ))}

              {!phone &&
                !whatsapp &&
                !email &&
                !instagram &&
                twitterAccounts.length === 0 && (
                  <span className={`text-xs ${dark ? "text-white/75" : "text-[#667085]"}`}>
                    Kanal kontak belum tersedia.
                  </span>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
