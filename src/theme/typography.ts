import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 0
  },
  heading: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0
  },
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.2,
    textTransform: 'none'
  },
  overline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1
  }
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
