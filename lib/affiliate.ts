export function buildAffiliateLink(
  rawUrl: string,
  affiliateId: string
): { url: string } | { error: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { error: "That doesn't look like a valid link." };
  }

  if (!parsed.hostname.endsWith("myntra.com")) {
    return { error: "Please paste a Myntra product link." };
  }

  // .set() overwrites the param if it already exists, or adds it if not —
  // works whether the pasted link is bare or already carries a query string.
  parsed.searchParams.set("utm_source", "ugc_affiliate");
  parsed.searchParams.set("utm_medium", "social_share_pdp");
  parsed.searchParams.set("utm_campaign", affiliateId);
  parsed.searchParams.set("affiliate_id", affiliateId);

  return { url: parsed.toString() };
}
