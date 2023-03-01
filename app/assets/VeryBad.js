import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgVeryBad = (props) => (
  <Svg
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 16c0 8.837 7.163 16 16 16s16-7.163 16-16S24.837 0 16 0 0 7.163 0 16Zm2 0C2 8.268 8.268 2 16 2s14 6.268 14 14-6.268 14-14 14S2 23.732 2 16Zm6.798-5.327.035-.05a1.4 1.4 0 0 1 2.291-.06l.043.06a1 1 0 1 0 1.666-1.105 3.4 3.4 0 0 0-5.666 0 1 1 0 0 0 1.631 1.155ZM10 12.5a1.5 1.5 0 0 1 0 3l-.069-.002A1.5 1.5 0 0 1 10 12.5Zm12 0a1.5 1.5 0 0 1 0 3l-.069-.002A1.5 1.5 0 0 1 22 12.5Zm-1.167-1.877-.035.05a1 1 0 0 1-1.631-1.155 3.4 3.4 0 0 1 5.666 0 1 1 0 1 1-1.666 1.105l-.043-.06a1.4 1.4 0 0 0-2.29.06Zm-4.836 7.371c3.802 0 7.275 2.156 8.963 5.562a1 1 0 1 1-1.792.888 8.003 8.003 0 0 0-14.341 0 1 1 0 1 1-1.792-.888 10.003 10.003 0 0 1 8.962-5.562Z"
      fill="currentColor"
    />
  </Svg>
);
export default SvgVeryBad;
