/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Parkampus Brand Colors
const mainColor = '#0D47A1';
const mainLightColor = '#42A5F5';
const blackColor = '#212121';

const tintColorLight = mainColor;
const tintColorDark = mainLightColor;

export const Colors = {
    light: {
        text: blackColor,
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        primary: mainColor,
        primaryLight: mainLightColor,
        black: blackColor,
    },
    dark: {
        text: '#ECEDEE',
        background: blackColor,
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        primary: mainLightColor,
        primaryLight: mainColor,
        black: blackColor,
    },
};

// Parkampus Theme
export const ParkampusTheme = {
    colors: {
        main: '#004793', // Darker blue from the design
        mainLight: '#0066CC',
        black: blackColor,
        white: '#FFFFFF',
        gray: '#687076',
        lightGray: '#F5F5F5',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#F0F4F8', // Light blue-ish gray background
        cardBorder: '#E5E7EB',
        textSecondary: '#64748B',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
    },
};

export const Fonts = Platform.select({
    ios: {
        /** iOS `UIFontDescriptorSystemDesignDefault` */
        sans: 'system-ui',
        /** iOS `UIFontDescriptorSystemDesignSerif` */
        serif: 'ui-serif',
        /** iOS `UIFontDescriptorSystemDesignRounded` */
        rounded: 'ui-rounded',
        /** iOS `UIFontDescriptorSystemDesignMonospaced` */
        mono: 'ui-monospace',
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
});
