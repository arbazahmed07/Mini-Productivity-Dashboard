
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, Quote } from "lucide-react";

interface QuoteData {
  text: string;
  author: string;
}

const MotivationalQuote = () => {
  const [quote, setQuote] = useState<QuoteData>({
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock quotes for demo purposes
  const mockQuotes: QuoteData[] = [
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    }
  ];

  const fetchNewQuote = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      setQuote(randomQuote);
      setIsLoading(false);
      setIsFavorited(false);
    }, 1000);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Quote className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <blockquote className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              "{quote.text}"
            </blockquote>
            <cite className="text-sm text-gray-600 dark:text-gray-300">
              — {quote.author}
            </cite>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={fetchNewQuote}
              variant="outline"
              size="icon"
              disabled={isLoading}
              className="dark:border-gray-600"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={toggleFavorite}
              variant="outline"
              size="icon"
              className={`dark:border-gray-600 ${
                isFavorited 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900 dark:text-red-300' 
                  : ''
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote;
