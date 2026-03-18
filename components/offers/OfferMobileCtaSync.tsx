"use client";

import { useEffect } from "react";

import { useSiteContext, type MobileBookingCta } from "@/lib/site-context";

type OfferMobileCtaSyncProps = {
  cta: MobileBookingCta;
};

export default function OfferMobileCtaSync({ cta }: OfferMobileCtaSyncProps) {
  const { setMobileBookingCta } = useSiteContext();

  useEffect(() => {
    setMobileBookingCta(cta);

    return () => {
      setMobileBookingCta(null);
    };
  }, [cta, setMobileBookingCta]);

  return null;
}
