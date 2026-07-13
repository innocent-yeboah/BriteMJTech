import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon from the redesigned MJ mark. */
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
          width="34"
          height="46"
          viewBox="0 0 80 108"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#111111" d="M8 4H66V62L54 74V104H8Z" />
          <path
            fill="#FFFFFF"
            d="M18 48V14H27L35.5 32L44 14H53V48H44V30L35.5 44L27 30V48Z"
          />
          <path fill="#FFFFFF" d="M44 56H53V92H18V83H44Z" />
          <path fill="#FFFFFF" d="M18 74H27V92H18Z" />
          <path
            d="M67.6 4V61.2L55.6 73.2V104"
            fill="none"
            stroke="#E63946"
            strokeWidth="2.75"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
