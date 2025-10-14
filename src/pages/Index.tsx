import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Shield, Zap, Clock, Database } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-24 md:py-32 relative border-b border-border/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/30 text-xs font-mono text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>LIVE TRADING • 24/7 MARKETS</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Institutional-Grade
                <br />
                <span className="wealth-gradient">Trading Infrastructure</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                High-performance trading platform built for quantitative traders, hedge funds, and sophisticated investors. Sub-millisecond execution, advanced analytics, direct market access.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/register">
                  <Button size="lg" className="gap-2 font-medium">
                    Open Trading Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="font-medium">
                    Access Platform
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold font-mono">$2.4B+</div>
                  <div className="text-xs text-muted-foreground">Assets Under Management</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold font-mono">&lt;1ms</div>
                  <div className="text-xs text-muted-foreground">Average Execution Time</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-bold font-mono">99.99%</div>
                  <div className="text-xs text-muted-foreground">Platform Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Data Visualization */}
        <section className="py-20 border-b border-border/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="text-sm font-mono text-primary">PERFORMANCE</div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      Built for Speed and Precision
                    </h2>
                    <p className="text-muted-foreground">
                      Our infrastructure is designed for high-frequency trading with direct market access, co-location services, and advanced order routing algorithms.
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded border border-border/30 flex items-center justify-center bg-card">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Ultra-Low Latency</div>
                        <div className="text-sm text-muted-foreground">Direct fiber connections to major exchanges with sub-millisecond execution</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded border border-border/30 flex items-center justify-center bg-card">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Real-Time Market Data</div>
                        <div className="text-sm text-muted-foreground">Level 2 order book data, time & sales, and tick-by-tick analytics</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded border border-border/30 flex items-center justify-center bg-card">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">24/7 Operations</div>
                        <div className="text-sm text-muted-foreground">Trade global markets around the clock with continuous system monitoring</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-square rounded border border-border/30 bg-card/50 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-muted-foreground">MARKET DEPTH</span>
                        <span className="text-xs font-mono text-primary">LIVE</span>
                      </div>
                      
                      <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between items-center border-b border-border/20 pb-2">
                          <span className="text-muted-foreground">BID</span>
                          <span className="text-muted-foreground">SIZE</span>
                          <span className="text-muted-foreground">ASK</span>
                        </div>
                        {[
                          { bid: '4,187.25', size: '2.5K', ask: '4,187.50' },
                          { bid: '4,187.00', size: '1.8K', ask: '4,187.75' },
                          { bid: '4,186.75', size: '3.2K', ask: '4,188.00' },
                          { bid: '4,186.50', size: '1.5K', ask: '4,188.25' },
                          { bid: '4,186.25', size: '2.1K', ask: '4,188.50' },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="text-market-bull">{row.bid}</span>
                            <span className="text-muted-foreground">{row.size}</span>
                            <span className="text-market-bear">{row.ask}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      <span className="font-mono">Updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 border-b border-border/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-3 mb-16">
                <div className="text-sm font-mono text-primary">CAPABILITIES</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Professional Trading Tools
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-border/30 rounded p-6 space-y-4 bg-card/30 hover:bg-card/50 transition-colors">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Proprietary algorithms, backtesting framework, statistical arbitrage models, and real-time risk metrics.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs px-2 py-1 rounded border border-border/30 font-mono">Python API</span>
                    <span className="text-xs px-2 py-1 rounded border border-border/30 font-mono">REST & WebSocket</span>
                  </div>
                </div>
                
                <div className="border border-border/30 rounded p-6 space-y-4 bg-card/30 hover:bg-card/50 transition-colors">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">Algorithmic Trading</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy custom trading strategies with millisecond precision. VWAP, TWAP, and smart order routing included.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs px-2 py-1 rounded border border-border/30 font-mono">FIX Protocol</span>
                    <span className="text-xs px-2 py-1 rounded border border-border/30 font-mono">Co-location</span>
                  </div>
                </div>
                
                <div className="border border-border/30 rounded p-6 space-y-4 bg-card/30 hover:bg-card/50 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank-grade encryption, multi-factor authentication, IP whitelisting, and segregated client accounts.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs px-2 py-1 rounded border border-border/30 font-mono">SOC 2 Type II</span>
                    <span className="text-xs px-2 py-1 rounded border border-border/30 font-mono">ISO 27001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-20 border-b border-border/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-3 mb-16">
                <div className="text-sm font-mono text-primary">BY THE NUMBERS</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Trusted by Institutional Investors
                </h2>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl md:text-4xl font-bold font-mono">500K+</div>
                  <div className="text-sm text-muted-foreground">Daily Transactions</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl md:text-4xl font-bold font-mono">45+</div>
                  <div className="text-sm text-muted-foreground">Global Exchanges</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl md:text-4xl font-bold font-mono">15,000+</div>
                  <div className="text-sm text-muted-foreground">Active Traders</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl md:text-4xl font-bold font-mono">8 Years</div>
                  <div className="text-sm text-muted-foreground">Market Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Ready to Trade at Institutional Speed?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Open your account and get access to our professional trading infrastructure. Onboarding takes less than 5 minutes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="gap-2 font-medium">
                    Open Trading Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="font-medium">
                    Access Platform
                  </Button>
                </Link>
              </div>
              
              <p className="text-xs text-muted-foreground pt-4">
                Trading involves substantial risk of loss. Past performance is not indicative of future results.
                <br />
                Quantica Capital is a registered broker-dealer and member of FINRA/SIPC.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
