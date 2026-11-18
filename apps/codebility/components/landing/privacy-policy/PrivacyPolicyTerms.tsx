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
import { privacyContactEmail } from "@/constants/landing/privacy-policy/privacy-policy-content";

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
                Last updated <time dateTime="2024-05-23">May 23, 2024</time>
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
          <TermsAndConditionContent variant="document" contactEmail={privacyContactEmail} />
          <div className="privacy-terms-footer">
            <a href={`mailto:${privacyContactEmail}`}>
              <Mail size={16} />
              <span>
                Questions?{" "}
                <span className="privacy-terms-email">
                  {privacyContactEmail}
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
