
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Zap, DollarSign } from 'lucide-react';

const SellEnergyForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount_kwh: '',
    price_per_kwh: '',
    description: '',
    available_until: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to sell energy.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('energy_listings')
        .insert({
          user_id: user.id,
          title: formData.title,
          amount_kwh: parseFloat(formData.amount_kwh),
          price_per_kwh: parseFloat(formData.price_per_kwh),
          description: formData.description,
          available_until: formData.available_until || null
        });

      if (error) throw error;

      toast({
        title: "Energy Listed Successfully!",
        description: `Your ${formData.amount_kwh} kWh energy listing is now active.`
      });

      // Reset form
      setFormData({
        title: '',
        amount_kwh: '',
        price_per_kwh: '',
        description: '',
        available_until: ''
      });

    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to create energy listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = formData.amount_kwh && formData.price_per_kwh 
    ? (parseFloat(formData.amount_kwh) * parseFloat(formData.price_per_kwh)).toFixed(2)
    : '0.00';

  return (
    <Card className="glass border-marine-200/50 dark:border-marine-700/50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-ocean-500" />
          <CardTitle className="text-marine-900 dark:text-white">Sell Energy</CardTitle>
        </div>
        <CardDescription className="text-marine-600 dark:text-marine-300">
          List your energy for sale on the marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-marine-700 dark:text-marine-300">
              Listing Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Solar Energy from Home Panel"
              className="border-marine-300 dark:border-marine-600 bg-white/50 dark:bg-marine-800/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount_kwh" className="text-marine-700 dark:text-marine-300">
                Amount (kWh)
              </Label>
              <Input
                id="amount_kwh"
                name="amount_kwh"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount_kwh}
                onChange={handleInputChange}
                placeholder="1000"
                className="border-marine-300 dark:border-marine-600 bg-white/50 dark:bg-marine-800/50"
                required
              />
            </div>

            <div>
              <Label htmlFor="price_per_kwh" className="text-marine-700 dark:text-marine-300">
                Price per kWh ($)
              </Label>
              <Input
                id="price_per_kwh"
                name="price_per_kwh"
                type="number"
                step="0.0001"
                min="0.0001"
                value={formData.price_per_kwh}
                onChange={handleInputChange}
                placeholder="0.15"
                className="border-marine-300 dark:border-marine-600 bg-white/50 dark:bg-marine-800/50"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="available_until" className="text-marine-700 dark:text-marine-300">
              Available Until (Optional)
            </Label>
            <Input
              id="available_until"
              name="available_until"
              type="datetime-local"
              value={formData.available_until}
              onChange={handleInputChange}
              className="border-marine-300 dark:border-marine-600 bg-white/50 dark:bg-marine-800/50"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-marine-700 dark:text-marine-300">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Additional details about your energy source..."
              className="border-marine-300 dark:border-marine-600 bg-white/50 dark:bg-marine-800/50"
              rows={3}
            />
          </div>

          {formData.amount_kwh && formData.price_per_kwh && (
            <div className="p-4 bg-ocean-50 dark:bg-ocean-900/20 rounded-lg border border-ocean-200 dark:border-ocean-700">
              <div className="flex items-center justify-between">
                <span className="text-marine-700 dark:text-marine-300">Total Value:</span>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">${totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-ocean-500 hover:bg-ocean-600 text-white"
          >
            {isLoading ? 'Creating Listing...' : 'List Energy for Sale'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SellEnergyForm;
