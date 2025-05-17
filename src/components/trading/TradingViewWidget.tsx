
import { useEffect, useRef } from 'react';

// Define the TradingView widget props
interface TradingViewWidgetProps {
  symbol?: string;
  theme?: string;
  height?: number;
}

// TradingView Widget component
const TradingViewWidget = ({
  symbol = 'AAPL',
  theme = 'dark',
  height = 400
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the script element for TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => initWidget();

    // Add the script to the document
    document.head.appendChild(script);

    // Initialize the TradingView widget
    const initWidget = () => {
      if (container.current && "TradingView" in window) {
        const tradingView = (window as any).TradingView;
        
        container.current.innerHTML = '';
        
        new tradingView.widget({
          autosize: true,
          symbol: `NASDAQ:${symbol}`,
          interval: "D",
          timezone: "exchange",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: container.current.id,
          studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        });
      }
    };

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [symbol, theme]);

  useEffect(() => {
    // Reinitialize the widget when symbol changes
    if ("TradingView" in window && container.current) {
      const tradingView = (window as any).TradingView;
      
      container.current.innerHTML = '';
      
      new tradingView.widget({
        autosize: true,
        symbol: `NASDAQ:${symbol}`,
        interval: "D",
        timezone: "exchange",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: container.current.id,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
      });
    }
  }, [symbol]);

  return (
    <div 
      id={`tradingview_widget_${symbol}`} 
      ref={container} 
      style={{ height: `${height}px` }}
      className="w-full"
    />
  );
};

export default TradingViewWidget;
