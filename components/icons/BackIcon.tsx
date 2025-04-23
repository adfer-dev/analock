import { G, Path, Svg } from "react-native-svg";

export const BackIcon = () => {
  return (
    <Svg viewBox="0 0 1024 1024" width={24} height={24} fill="#000000">
      <G>
        <Path
          fill="#000000"
          d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
        />
        <Path
          fill="#000000"
          d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
        />
      </G>
    </Svg>
  );
};
