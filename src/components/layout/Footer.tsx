
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quantica Capital</h3>
            <p className="text-sm text-muted-foreground">
              Professional trading solutions for modern investors
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Trading</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/trading" className="hover:text-foreground transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-foreground transition-colors">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  Open Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclosures" className="hover:text-foreground transition-colors">
                  Disclosures
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Quantica Capital. All rights reserved.</p>
          <p className="mt-1">
            Trading involves risk. Investment value can both increase and decrease
            and you may lose all your initial investment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
