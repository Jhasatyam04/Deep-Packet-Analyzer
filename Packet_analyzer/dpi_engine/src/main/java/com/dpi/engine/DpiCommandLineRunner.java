package com.dpi.engine;
import com.dpi.rules.BlockingRuleManager;
public class DpiCommandLineRunner {
    public static void main(String[] args) {
        if (args.length < 2) {
            printUsage();
            System.exit(1);
        }
        String inputFile = args[0];
        String outputFile = args[1];
        DeepPacketInspectionEngine.Config config = new DeepPacketInspectionEngine.Config();
        for (int i = 2; i < args.length; i++) {
            switch (args[i]) {
                case "--block-ip" -> {
                    if (i + 1 < args.length) config.rulesFile = ""; 
                    i++; 
                }
                case "--block-app", "--block-domain" -> {
                    if (i + 1 < args.length) i++; 
                }
                case "--lbs" -> {
                    if (i + 1 < args.length) config.numLoadBalancers = Integer.parseInt(args[++i]);
                }
                case "--fps" -> {
                    if (i + 1 < args.length) config.fpsPerLb = Integer.parseInt(args[++i]);
                }
                case "--rules" -> {
                    if (i + 1 < args.length) config.rulesFile = args[++i];
                }
                case "--verbose" -> config.verbose = true;
                case "--help", "-h" -> {
                    printUsage();
                    System.exit(0);
                }
            }
        }
        BlockingRuleManager ruleManager = new BlockingRuleManager();
        DeepPacketInspectionEngine engine = new DeepPacketInspectionEngine(config, ruleManager);
        if (!engine.initialize()) {
            System.err.println("Failed to initialize DPI engine");
            System.exit(1);
        }
        for (int i = 2; i < args.length; i++) {
            switch (args[i]) {
                case "--block-ip" -> { if (i + 1 < args.length) engine.blockIp(args[++i]); }
                case "--block-app" -> { if (i + 1 < args.length) engine.blockApp(args[++i]); }
                case "--block-domain" -> { if (i + 1 < args.length) engine.blockDomain(args[++i]); }
                case "--lbs", "--fps", "--rules" -> { if (i + 1 < args.length) i++; } 
            }
        }
        if (!engine.processFile(inputFile, outputFile)) {
            System.err.println("Failed to process file");
            System.exit(1);
        }
        System.out.println("\nOutput written to: " + outputFile);
    }
    private static void printUsage() {
        System.out.println("""
                DPI Engine v2.0 - Multi-threaded Deep Packet Inspection (Java)
                ================================================================
                Usage: java -jar deep-packet-analyzer.jar <input.pcap> <output.pcap> [options]
                Options:
                  --block-ip <ip>        Block source IP
                  --block-app <app>      Block application (YouTube, Facebook, etc.)
                  --block-domain <dom>   Block domain (substring match)
                  --rules <file>         Load blocking rules from file
                  --lbs <n>              Number of load balancer threads (default: 2)
                  --fps <n>              FP threads per LB (default: 2)
                  --verbose              Enable verbose output
                Example:
                  java -jar deep-packet-analyzer.jar capture.pcap filtered.pcap --block-app YouTube --block-ip 192.168.1.50
                """);
    }
}