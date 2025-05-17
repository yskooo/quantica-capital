
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartLine, Shield, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Trade with precision. <br />
                  <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                    Invest with confidence.
                  </span>
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Quantica Capital provides professional-grade trading tools with a seamless account opening experience. Join thousands of traders making informed decisions every day.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Open an Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur-3xl opacity-20"></div>
                <div className="relative glass-card rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Trading platform interface"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold">Why Choose Quantica Capital</h2>
              <p className="text-muted-foreground mx-auto max-w-[800px]">
                A modern trading platform built for today's investors, with powerful tools and a seamless experience.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ChartLine className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Real-time market data, interactive charts, and powerful technical indicators to make informed decisions.
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Portfolio Management</h3>
                <p className="text-muted-foreground">
                  Track your investments, analyze performance, and optimize your portfolio for better returns.
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Platform</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security protecting your assets and personal information at all times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="glass-card p-8 md:p-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/40 overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
              <div className="relative max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">Start Trading Today</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of traders who trust Quantica Capital for their investment needs. Open an account in minutes.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Create an Account
                    </Button>
                  </Link>
                  <Link to="/learn-more">
                    <Button variant="outline" size="lg">
                      Learn More
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
