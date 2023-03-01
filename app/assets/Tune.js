import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgTune = (props) => (
  <Svg
    width={20}
    height={20}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M16.666 3.333H10.68c.093.262.153.54.153.833 0 .295-.06.572-.153.834h5.986a.834.834 0 0 0 0-1.667ZM3.333 5h2.654a2.468 2.468 0 0 1-.154-.834c0-.294.06-.571.154-.833H3.333a.834.834 0 0 0 0 1.667Z" />
    <Path opacity={0.5} d="M8.334 6.667a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <Path d="M16.666 9.167h-1.82c.093.262.153.54.153.833 0 .294-.06.572-.153.834h1.82a.834.834 0 0 0 0-1.667ZM3.333 10.834h6.82A2.47 2.47 0 0 1 10 10c0-.294.06-.571.153-.833h-6.82a.834.834 0 0 0 0 1.667Z" />
    <Path opacity={0.5} d="M12.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <Path d="M16.666 15H10.68c.093.262.153.54.153.833 0 .295-.06.572-.153.834h5.986a.834.834 0 0 0 0-1.667ZM3.333 16.667h2.654a2.468 2.468 0 0 1-.154-.834c0-.294.06-.571.154-.833H3.333a.834.834 0 0 0 0 1.667Z" />
    <Path
      opacity={0.5}
      d="M8.334 18.333a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
    />
  </Svg>
);
export default SvgTune;
