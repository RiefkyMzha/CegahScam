import type { OfficialContact } from "../lib/risk";

type OfficialContactsProps = {
  contacts: OfficialContact[];
  variant?: "light" | "dark";
};

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

export default function OfficialContacts({
  contacts,
  variant = "light",
}: OfficialContactsProps) {
  const linkClass =
    variant === "dark"
      ? "border-white/30 text-white hover:bg-white/15"
      : "border-[#D7E1EA] text-[#446685] hover:bg-[#F3F7FB]";
  const secondaryTextClass =
    variant === "dark" ? "text-white/75" : "text-[#667085]";

  return (
    <div className="flex flex-col gap-3">
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

        return (
          <div
            key={`${contact.name}-${index}`}
            className="flex flex-col gap-2"
          >
            <p className="break-words font-semibold">{contact.name}</p>
            <div className="flex flex-wrap gap-2">
              {phone &&
                (phoneDigits ? (
                  <a
                    href={`tel:${phoneDigits}`}
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition ${linkClass}`}
                  >
                    Telepon · {phone}
                  </a>
                ) : (
                  <span className={secondaryTextClass}>Telepon · {phone}</span>
                ))}

              {whatsapp &&
                (whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition ${linkClass}`}
                  >
                    WhatsApp · {whatsapp}
                  </a>
                ) : (
                  <span className={secondaryTextClass}>
                    WhatsApp · {whatsapp}
                  </span>
                ))}

              {email &&
                (emailHref ? (
                  <a
                    href={emailHref}
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition ${linkClass}`}
                  >
                    Email · {email}
                  </a>
                ) : (
                  <span className={secondaryTextClass}>Email · {email}</span>
                ))}

              {instagram &&
                (instagramHref ? (
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition ${linkClass}`}
                  >
                    Instagram · {instagram}
                  </a>
                ) : (
                  <span className={secondaryTextClass}>
                    Instagram · {instagram}
                  </span>
                ))}

              {twitterAccounts.map((account, accountIndex) => {
                const xHref = getXHref(account);
                return xHref ? (
                  <a
                    key={`${account}-${accountIndex}`}
                    href={xHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-9 items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition ${linkClass}`}
                  >
                    X · {account}
                  </a>
                ) : (
                  <span
                    key={`${account}-${accountIndex}`}
                    className={secondaryTextClass}
                  >
                    X · {account}
                  </span>
                );
              })}

              {!phone &&
                !whatsapp &&
                !email &&
                !instagram &&
                twitterAccounts.length === 0 && (
                  <span className={secondaryTextClass}>
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
