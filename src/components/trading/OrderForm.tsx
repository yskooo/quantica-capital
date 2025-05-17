
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

interface OrderFormProps {
  symbol: string;
  price: number;
}

const OrderForm = ({ symbol, price }: OrderFormProps) => {
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(price.toFixed(2));
  const [availableCash, setAvailableCash] = useState(25000);
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");

  const calculateTotal = () => {
    const priceToUse = orderType === "market" ? price : parseFloat(limitPrice);
    return (quantity * priceToUse).toFixed(2);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) > 0)) {
      setLimitPrice(value);
    }
  };

  const handleOrderSubmit = () => {
    const orderTotal = parseFloat(calculateTotal());
    
    if (orderSide === "buy" && orderTotal > availableCash) {
      toast.error("Insufficient funds for this order");
      return;
    }

    // Process the order
    toast.success(
      `${orderSide.toUpperCase()} order for ${quantity} ${symbol} at $${
        orderType === "market" ? price.toFixed(2) : limitPrice
      } submitted successfully`
    );

    // Update available cash (in a real app this would come from API)
    if (orderSide === "buy") {
      setAvailableCash(prev => prev - orderTotal);
    } else {
      setAvailableCash(prev => prev + orderTotal);
    }

    // Reset form
    setQuantity(1);
    setLimitPrice(price.toFixed(2));
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <div className="flex items-center mt-1 border rounded-md p-2 bg-secondary/50">
              <span>{symbol}</span>
              <span className="ml-auto font-medium">${price.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Label>Order Side</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Button
                type="button"
                variant={orderSide === "buy" ? "default" : "outline"}
                className={orderSide === "buy" ? "bg-market-bull text-white hover:bg-market-bull/90" : ""}
                onClick={() => setOrderSide("buy")}
              >
                <ArrowDown className="mr-2 h-4 w-4" /> Buy
              </Button>
              <Button
                type="button"
                variant={orderSide === "sell" ? "default" : "outline"}
                className={orderSide === "sell" ? "bg-market-bear text-white hover:bg-market-bear/90" : ""}
                onClick={() => setOrderSide("sell")}
              >
                <ArrowUp className="mr-2 h-4 w-4" /> Sell
              </Button>
            </div>
          </div>

          <div>
            <Label>Order Type</Label>
            <Tabs defaultValue="market" className="w-full mt-1" onValueChange={setOrderType}>
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="limit">Limit</TabsTrigger>
              </TabsList>
              <TabsContent value="market">
                <p className="text-xs text-muted-foreground mb-4">
                  Market orders are executed immediately at the current market price
                </p>
              </TabsContent>
              <TabsContent value="limit">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="limitPrice">Limit Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="limitPrice"
                      type="text"
                      value={limitPrice}
                      onChange={handleLimitPriceChange}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Limit orders are executed only at the specified price or better
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1"
            />
          </div>

          <div className="pt-2 border-t border-border/20">
            <div className="flex justify-between text-sm">
              <span>Estimated Total:</span>
              <span className="font-medium">${calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Available {orderSide === "buy" ? "Cash" : "Shares"}:</span>
              <span>{orderSide === "buy" ? `$${availableCash.toFixed(2)}` : "N/A"}</span>
            </div>
          </div>

          <Button 
            onClick={handleOrderSubmit} 
            className={`w-full ${
              orderSide === "buy" 
                ? "bg-market-bull hover:bg-market-bull/90" 
                : "bg-market-bear hover:bg-market-bear/90"
            }`}
          >
            {orderSide === "buy" ? "Buy" : "Sell"} {symbol}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
