import { View } from 'react-native';

export default function GlassCard({ children, className = '' }) {
  return (
    <View
      className={`bg-card border border-cardBorder rounded-xl p-6 ${className}`}
    >
      {children}
    </View>
  );
}