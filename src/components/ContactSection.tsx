"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AtSign, MapPin, Phone, Send, ShieldCheck } from "lucide-react";

const CAPABILITIES = [
  { key: "cap1", value: "Advertising & Strategic Consulting" },
  { key: "cap2", value: "Graphic Design & Printing" },
  { key: "cap3", value: "Audiovisual Production & Photography" },
  { key: "cap4", value: "Web Development & Digital Services" }
] as const;

interface FieldErrors {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  scope?: string;
}

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const mountedAtRef = useRef<number>(Date.now());

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCaps, setSelectedCaps] = useState<string[]>([
    "Audiovisual Production"
  ]);
  const [scope, setScope] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<
    "idle" | "confirmed" | "unconfigured"
  >("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleSelectCapability = (e: Event) => {
      const customEvent = e as CustomEvent<{ capability?: string }>;
      const cap = customEvent.detail?.capability;
      if (!cap) return;
      setSelectedCaps((prev) => (prev.includes(cap) ? prev : [...prev, cap]));
    };
    window.addEventListener(
      "publimarca:select-capability",
      handleSelectCapability
    );
    return () =>
      window.removeEventListener(
        "publimarca:select-capability",
        handleSelectCapability
      );
  }, []);

  const toggleCapability = (val: string) => {
    setSelectedCaps((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const validateSingleField = (
    field: keyof FieldErrors,
    rawValue: string
  ): string | undefined => {
    const val = rawValue.trim();
    if (field === "name") {
      return val.length < 2 ? t("form.errors.name") : undefined;
    }
    if (field === "company") {
      return val.length < 2 ? t("form.errors.company") : undefined;
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(val) ? t("form.errors.email") : undefined;
    }
    if (field === "phone") {
      const phoneRegex = /^[+\d\s().-]{7,25}$/;
      return val !== "" && !phoneRegex.test(val)
        ? t("form.errors.phone")
        : undefined;
    }
    if (field === "scope") {
      return val.length < 20 ? t("form.errors.scope") : undefined;
    }
    return undefined;
  };

  const handleFieldChange = (field: keyof FieldErrors, nextVal: string) => {
    if (field === "name") setName(nextVal);
    if (field === "company") setCompany(nextVal);
    if (field === "email") setEmail(nextVal);
    if (field === "phone") setPhone(nextVal);
    if (field === "scope") setScope(nextVal);

    const fieldError = validateSingleField(field, nextVal);
    setErrors((prev) => {
      const updated = { ...prev };
      if (fieldError) {
        updated[field] = fieldError;
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    const nameErr = validateSingleField("name", name);
    if (nameErr) nextErrors.name = nameErr;
    const companyErr = validateSingleField("company", company);
    if (companyErr) nextErrors.company = companyErr;
    const emailErr = validateSingleField("email", email);
    if (emailErr) nextErrors.email = emailErr;
    const phoneErr = validateSingleField("phone", phone);
    if (phoneErr) nextErrors.phone = phoneErr;
    const scopeErr = validateSingleField("scope", scope);
    if (scopeErr) nextErrors.scope = scopeErr;
    return nextErrors;
  };

  const formatBriefText = () =>
    [
      "PUBLIMARCA STUDIO — COMMISSION BRIEF",
      `Name / Title: ${name.trim()}`,
      `Entity / Venture: ${company.trim()}`,
      `Email: ${email.trim()}`,
      `Telephone: ${phone.trim() || "Not provided"}`,
      `Capabilities: ${selectedCaps.join(", ") || "General Inquiry"}`,
      `Scope & Context:\n${scope.trim()}`
    ].join("\n");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Spam & bot timing check
    if (honeypot.trim() !== "" || Date.now() - mountedAtRef.current < 1200) {
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitState("idle");
      return;
    }

    setSubmitting(true);
    setCopied(false);

    try {
      const response = await fetch("/api/commission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          capabilities: selectedCaps,
          scope: scope.trim(),
          locale,
          honeypot,
          elapsedMs: Date.now() - mountedAtRef.current
        })
      });

      if (response.ok) {
        const data = (await response.json()) as { accepted?: boolean };
        if (data.accepted === true) {
          setSubmitState("confirmed");
          setName("");
          setCompany("");
          setEmail("");
          setPhone("");
          setScope("");
          setSubmitting(false);
          return;
        }
      }

      // Never fake a successful submission if the backend did not accept/deliver it
      setSubmitState("unconfigured");
    } catch {
      setSubmitState("unconfigured");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(formatBriefText());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const mailtoHref = `mailto:dispatch@publimarca.do?subject=${encodeURIComponent(
    `Commission Brief — ${company.trim() || "Publimarca Inquiry"}`
  )}&body=${encodeURIComponent(formatBriefText())}`;

  const rawPhoneDigits = t("phoneValue").replace(/\D+/g, "") || "18095542040";
  const whatsappGreeting =
    locale === "es"
      ? "Hola Publimarca Studio, me gustaría conversar directamente sobre un proyecto."
      : "Hello Publimarca Studio, I would like to chat directly about a project.";
  const whatsappHref = `https://wa.me/${rawPhoneDigits}?text=${encodeURIComponent(
    whatsappGreeting
  )}`;

  return (
    <section
      id="commission"
      className="w-full bg-white px-margin md:px-margin-tablet lg:px-margin-desktop py-20 border-t border-[#EBEBE6] scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Editorial Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span
                  className="w-2 h-2 rounded-full bg-[#A01318]"
                  aria-hidden="true"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-[#A01318]">
                  {t("kicker")}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#101014] tracking-tight mb-4">
                {t("title")}
              </h2>
              <p className="text-base text-[#52525B] mb-8 leading-relaxed">
                {t("subtitle")}
              </p>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#00758C] shrink-0"
                    aria-hidden="true"
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-[#101014] block">
                      {t("locLabel")}
                    </span>
                    <span className="text-sm text-[#52525B]">
                      {t("locValue")}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#00758C] shrink-0"
                    aria-hidden="true"
                  >
                    <AtSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-[#101014] block">
                      {t("emailLabel")}
                    </span>
                    <a
                      href={`mailto:${t("emailValue")}`}
                      className="text-sm text-[#52525B] hover:text-[#A01318] underline decoration-[#E5E5DF] hover:decoration-[#A01318] transition-colors"
                      translate="no"
                    >
                      {t("emailValue")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#00758C] shrink-0"
                    aria-hidden="true"
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-[#101014] block">
                      {t("phoneLabel")}
                    </span>
                    <span className="text-sm text-[#52525B]">
                      {t("phoneValue")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Alternative Card */}
              <div className="mb-8 p-5 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DF] shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#101014]">
                    {locale === "es"
                      ? "¿Prefieres atención directa sin formulario?"
                      : "Prefer direct messaging?"}
                  </span>
                </div>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  {locale === "es"
                    ? "Si prefieres no llenar el formulario, comunícate directamente con nuestro equipo por WhatsApp para atención inmediata."
                    : "If you prefer not to fill out the form, connect directly with our team via WhatsApp for immediate assistance."}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                  <span>
                    {locale === "es"
                      ? "Escribir por WhatsApp"
                      : "Write on WhatsApp"}
                  </span>
                </a>
              </div>
            </div>

            <div className="p-5 bg-[#F8F8F5] rounded-2xl border border-[#E5E5DF] font-mono text-xs text-[#52525B]">
              <span className="text-[#00758C] font-bold" aria-hidden="true">
                &gt;{" "}
              </span>
              <span>{t("turnaround")}</span>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FBFBF9] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#E5E5DF] shadow-editorial">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company_website_hp">Company Website</label>
                <input
                  id="company_website_hp"
                  name="company_website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-name"
                    className="block text-xs font-bold uppercase text-[#404048] mb-1.5"
                  >
                    {t("form.nameLabel")}
                  </label>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={(e) => handleFieldChange("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    placeholder={t("form.namePlaceholder")}
                    className={`w-full bg-white px-4 py-3 text-[#101014] placeholder:text-[#7A7A75] text-sm rounded-xl border ${
                      errors.name ? "border-[#A01318]" : "border-[#E0E0D8]"
                    } focus:outline-none focus:border-[#A01318] focus:ring-1 focus:ring-[#A01318] transition-all`}
                  />
                  {errors.name && (
                    <p
                      id="err-name"
                      role="alert"
                      className="mt-1.5 text-xs text-[#A01318] font-medium"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-company"
                    className="block text-xs font-bold uppercase text-[#404048] mb-1.5"
                  >
                    {t("form.companyLabel")}
                  </label>
                  <input
                    id="field-company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => handleFieldChange("company", e.target.value)}
                    onBlur={(e) => handleFieldChange("company", e.target.value)}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={
                      errors.company ? "err-company" : undefined
                    }
                    placeholder={t("form.companyPlaceholder")}
                    className={`w-full bg-white px-4 py-3 text-[#101014] placeholder:text-[#7A7A75] text-sm rounded-xl border ${
                      errors.company ? "border-[#A01318]" : "border-[#E0E0D8]"
                    } focus:outline-none focus:border-[#A01318] focus:ring-1 focus:ring-[#A01318] transition-all`}
                  />
                  {errors.company && (
                    <p
                      id="err-company"
                      role="alert"
                      className="mt-1.5 text-xs text-[#A01318] font-medium"
                    >
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-email"
                    className="block text-xs font-bold uppercase text-[#404048] mb-1.5"
                  >
                    {t("form.emailLabel")}
                  </label>
                  <input
                    id="field-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={(e) => handleFieldChange("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    placeholder={t("form.emailPlaceholder")}
                    className={`w-full bg-white px-4 py-3 text-[#101014] placeholder:text-[#7A7A75] text-sm rounded-xl border ${
                      errors.email ? "border-[#A01318]" : "border-[#E0E0D8]"
                    } focus:outline-none focus:border-[#A01318] focus:ring-1 focus:ring-[#A01318] transition-all`}
                  />
                  {errors.email && (
                    <p
                      id="err-email"
                      role="alert"
                      className="mt-1.5 text-xs text-[#A01318] font-medium"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-phone"
                    className="block text-xs font-bold uppercase text-[#404048] mb-1.5"
                  >
                    {t("form.phoneLabel")}
                  </label>
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onBlur={(e) => handleFieldChange("phone", e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    placeholder={t("form.phonePlaceholder")}
                    className={`w-full bg-white px-4 py-3 text-[#101014] placeholder:text-[#7A7A75] text-sm rounded-xl border ${
                      errors.phone ? "border-[#A01318]" : "border-[#E0E0D8]"
                    } focus:outline-none focus:border-[#A01318] focus:ring-1 focus:ring-[#A01318] transition-all`}
                  />
                  {errors.phone && (
                    <p
                      id="err-phone"
                      role="alert"
                      className="mt-1.5 text-xs text-[#A01318] font-medium"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <fieldset>
                <legend className="block text-xs font-bold uppercase text-[#404048] mb-2">
                  {t("form.capabilitiesLabel")}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {CAPABILITIES.map(({ key, value }) => {
                    const checked = selectedCaps.includes(value);
                    return (
                      <label key={key} className="cursor-pointer">
                        <input
                          type="checkbox"
                          name="capabilities"
                          value={value}
                          checked={checked}
                          onChange={() => toggleCapability(value)}
                          className="sr-only peer"
                        />
                        <span className="inline-block px-4 py-2 bg-white text-[#404048] text-xs font-semibold uppercase rounded-full border border-[#E0E0D8] peer-checked:bg-[#A01318] peer-checked:text-white peer-checked:border-[#A01318] peer-focus-visible:ring-2 peer-focus-visible:ring-[#101014] peer-focus-visible:ring-offset-1 transition-all shadow-sm">
                          {t(`form.${key}`)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="field-scope"
                  className="block text-xs font-bold uppercase text-[#404048] mb-1.5"
                >
                  {t("form.scopeLabel")}
                </label>
                <textarea
                  id="field-scope"
                  name="scope"
                  rows={4}
                  required
                  value={scope}
                  onChange={(e) => handleFieldChange("scope", e.target.value)}
                  onBlur={(e) => handleFieldChange("scope", e.target.value)}
                  aria-invalid={Boolean(errors.scope)}
                  aria-describedby={errors.scope ? "err-scope" : undefined}
                  placeholder={t("form.scopePlaceholder")}
                  className={`w-full bg-white p-4 text-[#101014] placeholder:text-[#7A7A75] text-sm rounded-xl border ${
                    errors.scope ? "border-[#A01318]" : "border-[#E0E0D8]"
                  } focus:outline-none focus:border-[#A01318] focus:ring-1 focus:ring-[#A01318] transition-all`}
                />
                {errors.scope && (
                  <p
                    id="err-scope"
                    role="alert"
                    className="mt-1.5 text-xs text-[#A01318] font-medium"
                  >
                    {errors.scope}
                  </p>
                )}
              </div>

              {submitState === "confirmed" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-5 rounded-2xl border border-[#00758C]/40 bg-[#00758C]/5 text-[#101014] text-xs leading-relaxed"
                >
                  {t("form.status.confirmed")}
                </div>
              )}

              {submitState === "unconfigured" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-5 rounded-2xl border border-[#A01318]/40 bg-white text-[#101014] text-xs leading-relaxed space-y-3 shadow-sm"
                >
                  <p className="font-bold text-[#A01318] uppercase tracking-wider">
                    {t("form.status.noBackendTitle")}
                  </p>
                  <p className="text-[#52525B]">
                    {t("form.status.noBackendBody")}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={mailtoHref}
                      className="px-4 py-2 rounded-full bg-[#101014] text-white font-bold uppercase tracking-wider text-[11px] hover:bg-[#A01318] transition-colors"
                    >
                      {t("form.status.openMailto")}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="px-4 py-2 rounded-full bg-[#F4F4F0] text-[#101014] border border-[#E5E5DF] font-bold uppercase tracking-wider text-[11px] hover:border-[#101014] transition-colors"
                    >
                      {copied
                        ? t("form.status.copied")
                        : t("form.status.copyBrief")}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-[#25D366] text-[#101014] hover:text-white border border-[#E0E0D8] hover:border-[#25D366] rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                  <span>
                    {locale === "es" ? "WhatsApp Directo" : "WhatsApp Direct"}
                  </span>
                </a>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#A01318] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md shadow-[#A01318]/20 hover:bg-[#851014] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] focus-visible:ring-offset-2 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>
                    {submitting
                      ? t("form.submittingBtn")
                      : t("form.submitBtn")}
                  </span>
                  <Send
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
