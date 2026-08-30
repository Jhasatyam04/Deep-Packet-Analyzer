import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import GlassCard from '../components/GlassCard';

export default function LandingScreen({ onNavigate }) {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-row justify-between items-center px-10 py-6">
        <Text className="text-primaryText font-sans text-xl font-bold">Deep Packet Analyzer</Text>
        <View className="flex-row space-x-8 hidden md:flex">
          <Text className="text-secondaryText font-sans text-sm">Features</Text>
          <Text className="text-secondaryText font-sans text-sm">Control</Text>
          <Text className="text-secondaryText font-sans text-sm">Security</Text>
          <Text className="text-secondaryText font-sans text-sm">FAQ</Text>
        </View>
        <TouchableOpacity 
          className="bg-accent px-4 py-2 rounded-lg hover:opacity-90"
          onPress={onNavigate}
        >
          <Text className="text-background font-sans font-bold text-sm">Open Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap px-10 py-16 justify-between items-center mt-10">
        <View className="w-full md:w-[45%] pr-0 md:pr-10 mb-16 md:mb-0">
          <View className="flex-row items-center border border-cardBorder rounded-full px-3 py-1.5 self-start mb-8">
            <View className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
            <Text className="font-mono text-[10px] text-secondaryText tracking-widest uppercase">Simple & Powerful</Text>
          </View>
          
          <Text className="font-sans text-5xl md:text-6xl font-bold text-primaryText leading-[1.1] mb-6">
            Take Control of{'\n'}Your Network.
          </Text>
          
          <Text className="font-sans text-secondaryText text-lg leading-relaxed mb-10">
            Keep your network safe and fast. Monitor internet traffic in real-time, inspect web requests, and block unwanted websites instantly—all from a simple, user-friendly dashboard.
          </Text>
          
          <View className="flex-row items-center mb-10">
            <TouchableOpacity 
              className="bg-accent px-6 py-3.5 rounded-xl mr-6 hover:opacity-90"
              onPress={onNavigate}
            >
              <Text className="text-background font-sans font-bold text-base">Start Monitoring</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-primaryText font-sans font-medium text-base">Learn more</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="font-sans text-secondaryText text-xs leading-relaxed opacity-60">
            Your data stays on your device. We respect your privacy and never share your network logs.
          </Text>
        </View>
        
        <View className="w-full md:w-[45%]">
          <GlassCard className="py-10 px-8">
            <Text className="font-mono text-xs text-secondaryText tracking-widest uppercase mb-8">How It Works</Text>
            <View className="ml-2">
              <TimelineItem text="Start Live Monitoring" isActive={false} />
              <TimelineLine />
              <TimelineItem text="Security Engine analyzes traffic" isActive={false} />
              <TimelineLine />
              <TimelineItem text="Block unwanted websites" isActive={true} />
              <TimelineLine />
              <TimelineItem text="Keep your network safe" isActive={false} />
            </View>
          </GlassCard>
        </View>
      </View>
    </ScrollView>
  );
}

function TimelineItem({ text, isActive }) {
  return (
    <View className="flex-row items-center">
      <View className={`w-2.5 h-2.5 rounded-full mr-6 ${isActive ? 'bg-accent' : 'bg-secondaryText'}`} />
      <Text className={`font-sans text-sm ${isActive ? 'text-primaryText font-bold' : 'text-secondaryText'}`}>
        {text}
      </Text>
    </View>
  );
}

function TimelineLine() {
  return (
    <View className="ml-[4px] my-1">
      <View className="w-[1px] h-6 bg-cardBorder" />
    </View>
  );
}