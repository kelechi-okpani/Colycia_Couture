import { cookies } from "next/headers";

export async function getReferralData() {
  const cookieStore =
    await cookies();

  return {
    partnerCode:
      cookieStore.get(
        "colycia_ref"
      )?.value || null,

    visitorId:
      cookieStore.get(
        "colycia_vid"
      )?.value || null,
  };
}