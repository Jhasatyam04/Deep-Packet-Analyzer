import { Text } from 'react-native';
export const Heading = ({ children, className = '' }) => (
  <Text className={`text-primaryText font-sans font-bold text-3xl mb-1 ${className}`}>{children}</Text>
);
export const Subheading = ({ children, className = '' }) => (
  <Text className={`text-secondaryText font-sans text-sm mb-6 ${className}`}>{children}</Text>
);
export const MetricValue = ({ children, className = '' }) => (
  <Text className={`text-primaryText font-mono text-4xl mb-2 ${className}`}>{children}</Text>
);
export const MetricLabel = ({ children, className = '' }) => (
  <Text className={`text-secondaryText font-sans text-xs uppercase tracking-wider ${className}`}>{children}</Text>
);
export const CodeText = ({ children, className = '' }) => (
  <Text className={`text-accent font-mono text-sm ${className}`}>{children}</Text>
);