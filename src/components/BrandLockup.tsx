import Image from "next/image";

export function BrandLockup({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={`brand-lockup brand-lockup-${size}`}>
      <Image
        src="/brand/netapp-wordmark.svg"
        alt="NetApp"
        className="brand-netapp"
        width={1008}
        height={182}
      />
      <span className="brand-times" aria-hidden>
        ×
      </span>
      <Image
        src="/brand/spacexai.svg"
        alt="SpaceXAI"
        className="brand-sxai"
        width={1294}
        height={158}
      />
    </div>
  );
}
