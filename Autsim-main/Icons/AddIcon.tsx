import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const PlusSignIcon = (props: SvgProps) => (
  <Svg
    style={{ alignSelf: "center" }}
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color="#FFFFFF"
    fill="none"
    {...props}
  >
    <Path
      d="M12 4V20M20 12H4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusSignIcon;
