import { Text, type TextProps } from "react-native";
import { useTheme } from "@/theme/theme";

type Props = TextProps & { color?: string; size?: number };

// Heavy condensed uppercase headings ("THE CATALOGUE").
export function Display({ style, color, size = 44, children, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Display", fontSize: size, lineHeight: size * 0.92, color: color ?? colors.ink, textTransform: "uppercase" }, style]}
    >
      {children}
    </Text>
  );
}

// Small monospace labels and product numbers ("NO. 017 · KITCHEN").
export function Label({ style, color, size = 11, children, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Mono", fontSize: size, letterSpacing: 0.6, color: color ?? colors.ink, textTransform: "uppercase" }, style]}
    >
      {children}
    </Text>
  );
}

// Monospace figures (prices) without the uppercase label styling.
export function Mono({ style, color, size = 13, children, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <Text {...props} style={[{ fontFamily: "Mono", fontSize: size, color: color ?? colors.ink }, style]}>
      {children}
    </Text>
  );
}

// Italic serif taglines.
export function Serif({ style, color, size = 22, children, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <Text {...props} style={[{ fontFamily: "Serif", fontSize: size, lineHeight: size * 1.15, color: color ?? colors.ink }, style]}>
      {children}
    </Text>
  );
}

type BodyProps = Props & { weight?: "regular" | "medium" | "semibold" };
const bodyFonts = { regular: "Sans", medium: "SansMedium", semibold: "SansSemiBold" };

// Clean sans body copy.
export function Body({ style, color, size = 15, weight = "regular", children, ...props }: BodyProps) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[{ fontFamily: bodyFonts[weight], fontSize: size, lineHeight: size * 1.4, color: color ?? colors.ink }, style]}
    >
      {children}
    </Text>
  );
}
