import Image from "next/image";

interface LogoProps {
  /** Show the wordmark next to the icon */
  showText?: boolean;
  /** Show the PNG icon mark */
  showIcon?: boolean;
  /** Size of the icon in px */
  size?: number;
  className?: string;
}

/**
 * ThinkLM brand logo.
 * Uses the generated /logo.png icon + an inline wordmark.
 */
export default function Logo({ showText = true, showIcon = true, size = 36, className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 select-none ${className}`}
      aria-label="ThinkLM logo"
    >
      {showIcon && (
        <Image
          src="/logo.png"
          alt="ThinkLM icon"
          width={size}
          height={size}
          priority
          style={{
            borderRadius: "10px",
            boxShadow: "0 0 12px rgba(124,58,237,0.5)",
          }}
        />
      )}
      {showText && (
        <span
          style={{
            fontWeight: 800,
            fontSize: `${size * 0.6}px`,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ThinkLM
        </span>
      )}
    </span>
  );
}
