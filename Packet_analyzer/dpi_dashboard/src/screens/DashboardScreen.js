import { View, ScrollView, Text, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Heading, Subheading, MetricValue, MetricLabel, CodeText } from '../components/Typography';

export default function DashboardScreen() {
  const [latestJob, setLatestJob] = useState(null);
  const [domainInput, setDomainInput] = useState("");
  const [isLiveCaptureRunning, setIsLiveCaptureRunning] = useState(false);
  const [userIp, setUserIp] = useState("Loading...");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUserIp = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setUserIp(data.ip);
    } catch (e) {
      setUserIp("Unavailable");
    }
  };

  const handleToggleLiveCapture = async () => {
    try {
      const endpoint = isLiveCaptureRunning ? 'stop' : 'start';
      const response = await fetch(`http://localhost:8080/api/v1/live/${endpoint}`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsLiveCaptureRunning(!isLiveCaptureRunning);
        Alert.alert("Success", `Monitoring ${isLiveCaptureRunning ? 'Stopped' : 'Started'}`);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || `Failed to toggle monitoring.`);
      }
    } catch (err) {
      Alert.alert("Error", "Could not connect to the Security Engine.");
    }
  };

  const handleBlockDomain = async () => {
    if (!domainInput.trim()) return;
    try {
      const response = await fetch('http://localhost:8080/api/v1/rules/block-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainInput })
      });
      if (response.ok) {
        Alert.alert("Rule Active", `Access to ${domainInput} is now blocked.`);
        setDomainInput("");
      } else {
        Alert.alert("Error", "Failed to block website.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not connect to the Security Engine.");
    }
  };

  useEffect(() => {
    fetchUserIp();
    
    const fetchStats = async () => {
      try {
        const statusResponse = await fetch('http://localhost:8080/api/v1/live/status');
        const statusData = await statusResponse.json();
        setIsLiveCaptureRunning(statusData.isRunning);

        if (statusData.isRunning) {
            const liveResponse = await fetch('http://localhost:8080/api/v1/live/stats');
            const liveData = await liveResponse.json();
            if (Object.keys(liveData).length > 0) {
                setLatestJob(liveData);
            }
        } else {
            const response = await fetch('http://localhost:8080/api/v1/captures');
            const data = await response.json();
            if (data && data.length > 0) {
              setLatestJob(data[0]); 
            }
        }
      } catch (err) {
        console.log("Error fetching API: ", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 p-4">
          <View className="bg-card border border-cardBorder w-full max-w-2xl rounded-xl overflow-hidden max-h-[80%]">
            <View className="flex-row justify-between items-center p-4 border-b border-cardBorder bg-[#030710]">
              <Text className="text-primaryText font-sans font-bold text-lg">Live API Data</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="px-4 py-2 bg-accent/10 border border-accent/30 rounded">
                <Text className="text-accent font-bold">Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
              <Text className="text-secondaryText font-mono text-xs">
                {latestJob ? JSON.stringify(latestJob, null, 2) : "No API data available yet."}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1 bg-background px-8 py-12">
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Heading>Network Protection Dashboard</Heading>
            <Subheading>Security Engine · {isLiveCaptureRunning ? 'Real-Time Monitoring Active' : 'Offline Analysis Mode'}</Subheading>
          </View>
          <View className="flex-row items-center space-x-4">
            <View className="bg-card border border-cardBorder px-4 py-3 rounded-lg mr-4 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-accent mr-2" />
              <Text className="text-secondaryText text-sm mr-2">My IP:</Text>
              <Text className="text-primaryText font-mono font-bold">{userIp}</Text>
            </View>
            <TouchableOpacity 
              className={`px-6 py-3 rounded-lg flex-row items-center justify-center ${isLiveCaptureRunning ? 'bg-card border border-accent/50' : 'bg-accent/10 border border-accent/50'}`}
              onPress={handleToggleLiveCapture}
            >
              <Text className={`font-sans font-bold ${isLiveCaptureRunning ? 'text-secondaryText' : 'text-accent'}`}>
                {isLiveCaptureRunning ? '■ Stop Monitoring' : '▶ Start Monitoring'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row flex-wrap justify-between">
          <GlassCard className="w-[32%] mb-6">
            <MetricLabel>Network Requests</MetricLabel>
            <MetricValue>{latestJob ? latestJob.totalPackets : '---'}</MetricValue>
            <CodeText className="text-secondaryText">
              {latestJob ? `${latestJob.tcpPackets} TCP / ${latestJob.udpPackets} UDP` : 'Waiting for traffic...'}
            </CodeText>
          </GlassCard>
          
          <GlassCard className="w-[32%] mb-6">
            <MetricLabel>Data Size</MetricLabel>
            <MetricValue>{latestJob ? latestJob.totalBytes : '---'}</MetricValue>
            <CodeText className="text-secondaryText">Data processed</CodeText>
          </GlassCard>
          
          <GlassCard className="w-[32%] mb-6 relative overflow-hidden">
            <View className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
            <MetricLabel>Blocked Traffic</MetricLabel>
            <MetricValue>{latestJob ? `${latestJob.dropRate.toFixed(1)}%` : '---'}</MetricValue>
            <CodeText className="text-accent">
              {latestJob && latestJob.dropped > 0 ? `${latestJob.dropped} requests blocked` : 'All traffic permitted'}
            </CodeText>
          </GlassCard>
        </View>

        <View className="flex-row justify-between">
          <GlassCard className="w-[66%] h-auto relative justify-between pb-8">
            <View>
              <MetricLabel className="mb-4">Access Control</MetricLabel>
              <Text className="text-primaryText font-sans font-bold text-3xl mb-2">Block a specific website</Text>
              <Text className="text-secondaryText mb-8 text-base">Specify a target domain to immediately enforce a network-wide blocking rule.</Text>
              
              <View className="flex-row items-center mt-auto">
                <TextInput 
                  className="bg-background border border-cardBorder text-primaryText px-4 py-3.5 rounded-lg flex-1 mr-4 font-mono text-sm outline-none"
                  placeholder="e.g., twitter.com"
                  placeholderTextColor="#6B7280"
                  value={domainInput}
                  onChangeText={setDomainInput}
                />
                <TouchableOpacity 
                  className="bg-accent px-8 py-3.5 rounded-lg hover:opacity-90"
                  onPress={handleBlockDomain}
                >
                  <Text className="text-background font-sans font-bold text-base">Apply Rule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
          
          <GlassCard className="w-[32%]">
            <View className="flex-row justify-between mb-4 items-center">
              <MetricLabel>Recent Actions</MetricLabel>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text className="text-accent text-xs hover:underline">View API Info</Text>
              </TouchableOpacity>
            </View>
            {latestJob ? (
              <>
                <ActivityRow action="Analysis Completed" detail={`Processed in Security Engine`} time="Just now" />
                <ActivityRow action="Traffic Permitted" detail={`${latestJob.forwarded} requests`} time="" />
                <ActivityRow action="Traffic Blocked" detail={`${latestJob.dropped} requests`} time="" />
              </>
            ) : (
              <ActivityRow action="Engine idle" detail="Waiting for network traffic..." time="Now" />
            )}
          </GlassCard>
        </View>
      </ScrollView>
    </>
  );
}

function ActivityRow({ action, detail, time }) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-primaryText font-sans text-sm font-medium">{action}</Text>
        <Text className="text-secondaryText font-mono text-xs">{time}</Text>
      </View>
      <Text className="text-secondaryText text-xs mt-1">{detail}</Text>
    </View>
  );
}