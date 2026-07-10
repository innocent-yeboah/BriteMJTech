import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * App favicon generated from the polished MJ mark.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <svg
          width="36"
          height="48"
          viewBox="0 0 72 96"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 2H60V56L50 66V94H4Z" fill="#0B0B0B" />
          <path
            fill="#FFFFFF"
            d="M14 42V12H22L30.5 28L39 12H47V42H39V25.5L30.5 38L22 25.5V42Z"
          />
          <path fill="#FFFFFF" d="M39 50H47V80H16V72.5H39Z" />
          <path
            d="M61.25 2V55.4L51.25 65.4V94"
            fill="none"
            stroke="#E63946"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
