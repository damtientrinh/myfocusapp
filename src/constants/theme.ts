import { Platform } from 'react-native';

/**
 * 1. BẢNG MÀU (COLORS)
 * Phân chia theo chế độ Sáng (Light) và Tối (Dark)
 */
export const Colors = {
  light: {
    // Màu chủ đạo & Trạng thái Pomodoro
    primary: '#FF5252',     // Đỏ (Focus/Work) - Màu thương hiệu của Trình
    secondary: '#4CAF50',   // Xanh lá (Short Break)
    accent: '#FFD700',      // Vàng (Long Break/Achievement)
    
    // Nội dung & Nền
    text: '#11181C',        // Chữ chính (Đen đậm)
    subText: '#687076',     // Chữ phụ (Xám mờ)
    background: '#F8F9FA',  // Nền app (Xám cực nhẹ)
    card: '#FFFFFF',        // Nền của các ô Task, Stats, Settings
    
    // Tương tác & Viền
    tint: '#FF5252',
    icon: '#687076',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FF5252',
    border: '#E1E4E8',      // Viền checkbox, input, đường kẻ chia
    error: '#CF6679',
    success: '#4CAF50',
  },
  dark: {
    // Màu chủ đạo (Nhạt hơn một chút để đỡ chói trong tối)
    primary: '#FF6B6B',
    secondary: '#81C784',
    accent: '#FFF176',
    
    // Nội dung & Nền (Deep Black cho màn hình AMOLED)
    text: '#ECEDEE',
    subText: '#9BA1A6',
    background: '#151718',
    card: '#1E2123',        // Xám tối để nổi bật trên nền đen
    
    // Tương tác & Viền
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#687076',
    tabIconSelected: '#FFFFFF',
    border: '#30363D',
    error: '#CF6679',
    success: '#81C784',
  },
};

/**
 * 2. HỆ THỐNG FONT CHỮ (FONTS)
 * Tự động chọn Font tốt nhất cho iOS, Android và Web
 */
export const Fonts = {
  ...Platform.select({
    ios: {
      sans: 'System',
      serif: 'Times New Roman',
      rounded: 'SF Pro Rounded', // Font bo tròn hiện đại của Apple
      mono: 'Courier',
    },
    android: {
      sans: 'sans-serif',
      serif: 'serif',
      rounded: 'sans-serif-medium', // Fallback cho Android
      mono: 'monospace',
    },
    web: {
      sans: "system-ui, -apple-system, sans-serif",
      serif: "Georgia, serif",
      rounded: "'SF Pro Rounded', sans-serif",
      mono: "monospace",
    },
    default: {
      sans: 'normal',
      serif: 'serif',
      rounded: 'normal',
      mono: 'monospace',
    },
  }),
};

/**
 * 3. KÍCH THƯỚC & KHOẢNG CÁCH (SPACING)
 * Giúp UI của cả nhóm (Trình, Minh, Mạnh) luôn đồng bộ
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  borderRadius: {
    small: 8,
    medium: 16, // Chuẩn bo góc cho Card
    large: 24,
    full: 99,   // Dùng cho nút bấm tròn hoặc avatar
  },
  layout: {
    paddingHorizontal: 20,
    itemMargin: 15,
  }
};

/**
 * 4. ĐỘ ĐẬM CHỮ (TYPOGRAPHY WEIGHT)
 */
export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const Shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Dành cho Android
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
};