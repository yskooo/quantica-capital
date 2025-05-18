
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChartLine, Shield, TrendingUp, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-primary/10 text-primary border-primary/20 animate-fade-in">
                    <span className="font-mono">New</span>
                    <span className="mx-2">·</span>
                    <span>Integrated trading platform with bank connections</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                    Start investing with <br />
                    <span className="wealth-gradient">professional precision.</span>
                  </h1>
                  <p className="text-muted-foreground md:text-xl max-w-lg">
                    Quantica Capital provides institutional-grade trading tools with a seamless account setup experience. Join thousands of traders making informed decisions.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Open an Account <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Login to Platform
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-primary" /> Security-first
                  </div>
                  <div className="flex items-center gap-1">
                    <ChartLine className="h-4 w-4 text-primary" /> Advanced analytics
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-primary" /> Personalized service
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-xl blur-3xl opacity-20"></div>
                <div className="relative glass-card rounded-xl overflow-hidden border border-border/40 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Trading platform interface"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                
                {/* Floating statistics */}
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border border-border/50 animate-slide-in-left">
                  <p className="text-xs text-muted-foreground mb-1">Portfolio Growth</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono">+27.4%</span>
                    <span className="text-xs text-market-bull">↑ YTD</span>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border/50 animate-slide-in-right">
                  <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono">57,200+</span>
                    <span className="text-xs text-market-bull">↑ Growing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">Why Choose Quantica Capital</h2>
              <p className="text-muted-foreground mx-auto max-w-[800px]">
                A modern trading platform built for today's investors, with powerful tools and a seamless experience.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-xl space-y-4 border border-border/50 hover:border-primary/30 transition-all hover:shadow-glow group">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <ChartLine className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Real-time market data, interactive charts, and powerful technical indicators to make informed decisions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>TradingView integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Custom indicators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Portfolio analytics</span>
                  </li>
                </ul>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4 border border-border/50 hover:border-primary/30 transition-all hover:shadow-glow group">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Portfolio Management</h3>
                <p className="text-muted-foreground">
                  Track your investments, analyze performance, and optimize your portfolio for better returns.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Performance tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Asset allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Risk assessment</span>
                  </li>
                </ul>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4 border border-border/50 hover:border-primary/30 transition-all hover:shadow-glow group">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Platform</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security protecting your assets and personal information at all times.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Bank-level encryption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Two-factor authentication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Fraud protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Investors</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#FFD700"
                      stroke="#FFD700"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-muted-foreground mb-4">
                  "Quantica Capital transformed how I approach investing. The platform is intuitive, and the analytics tools give me confidence in my trading decisions."
                </p>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Investment Analyst</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#FFD700"
                      stroke="#FFD700"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-muted-foreground mb-4">
                  "As someone new to investing, I was worried about getting started. The onboarding process was smooth, and their customer support is exceptional."
                </p>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Tech Entrepreneur</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#FFD700"
                      stroke="#FFD700"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-muted-foreground mb-4">
                  "The portfolio insights and performance metrics helped me optimize my investments. My returns have significantly improved since joining."
                </p>
                <div>
                  <p className="font-medium">David Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Financial Advisor</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="glass-card p-8 md:p-12 rounded-xl bg-gradient-to-br from-secondary to-background overflow-hidden relative border border-border/40 shadow-xl">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
              <div className="relative max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to Start Investing?</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of traders who trust Quantica Capital for their investment needs. Create an account in minutes and start trading today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Create an Account <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Login to Platform
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
