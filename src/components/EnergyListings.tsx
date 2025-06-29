
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Zap, Clock, DollarSign, User } from 'lucide-react';

interface EnergyListing {
  id: string;
  title: string;
  amount_kwh: number;
  price_per_kwh: number;
  total_price: number;
  description?: string;
  available_from: string;
  available_until?: string;
  status: string;
  created_at: string;
  user_id: string;
}

const EnergyListings: React.FC = () => {
  const [listings, setListings] = useState<EnergyListing[]>([]);
  const [userListings, setUserListings] = useState<EnergyListing[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
    fetchListings();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('energy_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const userOwnedListings = data?.filter(listing => listing.user_id === user.id) || [];
        const otherListings = data?.filter(listing => listing.user_id !== user.id) || [];
        
        setUserListings(userOwnedListings);
        setListings(otherListings);
      } else {
        setListings(data || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load energy listings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyEnergy = async (listing: EnergyListing) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase energy",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create transaction
      const { error: transactionError } = await supabase
        .from('energy_transactions')
        .insert({
          listing_id: listing.id,
          buyer_id: currentUser.id,
          seller_id: listing.user_id,
          amount_kwh: listing.amount_kwh,
          price_per_kwh: listing.price_per_kwh,
          total_amount: listing.total_price
        });

      if (transactionError) throw transactionError;

      // Update listing status to sold
      const { error: updateError } = await supabase
        .from('energy_listings')
        .update({ status: 'sold' })
        .eq('id', listing.id);

      if (updateError) throw updateError;

      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased ${listing.amount_kwh} kWh for $${listing.total_price}`
      });

      fetchListings(); // Refresh listings
    } catch (error) {
      console.error('Error purchasing energy:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to complete purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  const ListingCard = ({ listing, isOwned = false }: { listing: EnergyListing; isOwned?: boolean }) => (
    <Card className="glass border-marine-200/50 dark:border-marine-700/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-marine-900 dark:text-white text-lg">{listing.title}</CardTitle>
            <CardDescription className="text-marine-600 dark:text-marine-300">
              Listed {new Date(listing.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge 
            variant={isOwned ? "secondary" : "default"}
            className={isOwned ? "bg-ocean-100 text-ocean-700 dark:bg-ocean-900 dark:text-ocean-300" : ""}
          >
            {isOwned ? "Your Listing" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-ocean-500" />
            <div>
              <p className="text-sm text-marine-600 dark:text-marine-300">Amount</p>
              <p className="font-semibold text-marine-900 dark:text-white">{listing.amount_kwh} kWh</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-marine-600 dark:text-marine-300">Price per kWh</p>
              <p className="font-semibold text-marine-900 dark:text-white">${listing.price_per_kwh}</p>
            </div>
          </div>
        </div>

        {listing.description && (
          <p className="text-sm text-marine-600 dark:text-marine-300">{listing.description}</p>
        )}

        {listing.available_until && (
          <div className="flex items-center space-x-2 text-sm text-marine-600 dark:text-marine-300">
            <Clock className="h-4 w-4" />
            <span>Available until {new Date(listing.available_until).toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-marine-200 dark:border-marine-700">
          <div>
            <p className="text-sm text-marine-600 dark:text-marine-300">Total Value</p>
            <p className="text-xl font-bold text-green-600">${listing.total_price}</p>
          </div>
          {!isOwned && (
            <Button 
              onClick={() => handleBuyEnergy(listing)}
              className="bg-ocean-500 hover:bg-ocean-600 text-white"
            >
              Buy Energy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass border-marine-200/50 dark:border-marine-700/50 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-marine-200 dark:bg-marine-700 rounded w-3/4"></div>
                <div className="h-3 bg-marine-200 dark:bg-marine-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-marine-200 dark:bg-marine-700 rounded"></div>
                  <div className="h-3 bg-marine-200 dark:bg-marine-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userListings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-marine-900 dark:text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-ocean-500" />
            Your Listings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} isOwned={true} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-marine-900 dark:text-white mb-4">
          Available Energy ({listings.length})
        </h3>
        {listings.length === 0 ? (
          <Card className="glass border-marine-200/50 dark:border-marine-700/50">
            <CardContent className="text-center py-8">
              <Zap className="h-12 w-12 text-marine-400 mx-auto mb-4" />
              <p className="text-marine-600 dark:text-marine-300">No energy listings available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyListings;
