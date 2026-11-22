"use client";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/global/ui/dialog";
import { TermsAndConditionContent } from "@/components/global/marketing/TermsAndConditionContent";
import { Button } from "@/components/global/design-system/Button";
import { IconButton } from "@/components/global/design-system/IconButton";
import { Clock3, Mail, ShieldCheck, X } from "lucide-react";
import {
  TERMS_CONTACT_EMAIL,
  TERMS_LAST_UPDATED,
} from "@/constants/global/terms-and-conditions";

const termsLastUpdatedLabel = new Date(TERMS_LAST_UPDATED).toLocaleDateString(
  "en-US",
  {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  },
);

export function PrivacyPolicyTerms() {
  return (
    <div className="privacy-policy-switch" aria-label="Legal documents">
      <a href="/privacy-policy" aria-current="page">
        Privacy Policy
      </a>
      <Dialog modal>
        <DialogTrigger asChild>
          <button type="button">Terms &amp; Conditions</button>
        </DialogTrigger>
        <DialogContent hasButton className="privacy-terms-modal">
          <div className="privacy-terms-header">
            <span className="privacy-terms-icon" aria-hidden="true">
              <ShieldCheck size={24} />
            </span>
            <DialogHeader className="privacy-terms-title-group">
              <span className="privacy-terms-eyebrow">Legal</span>
              <DialogTitle className="privacy-terms-title">
                Terms &amp; Conditions
              </DialogTitle>
              <DialogDescription className="privacy-terms-description">
                The terms that apply when you use Codebility’s website and
                services.
              </DialogDescription>
              <p className="privacy-terms-date">
                <Clock3 size={14} />
                Last updated{" "}
                <time dateTime={TERMS_LAST_UPDATED}>
                  {termsLastUpdatedLabel}
                </time>
              </p>
            </DialogHeader>
            <DialogClose asChild>
              <IconButton
                label="Close terms and conditions"
                variant="ghost"
                className="privacy-terms-dismiss"
              >
                <X size={20} />
              </IconButton>
            </DialogClose>
          </div>
          <TermsAndConditionContent variant="document" />
          <div className="privacy-terms-footer">
            <a href={`mailto:${TERMS_CONTACT_EMAIL}`}>
              <Mail size={16} />
              <span>
                Questions?{" "}
                <span className="privacy-terms-email">
                  {TERMS_CONTACT_EMAIL}
                </span>
              </span>
            </a>
            <DialogClose asChild>
              <Button size="sm">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
