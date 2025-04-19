'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, User, LogOut, ShoppingCart, UserCircle,LogIn } from 'lucide-react';
import { useSupabase } from './providers/supabase-provider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Navbar() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const [signin, setSignin] = useState(false);
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have successfully signed out.",
      });
      setSignin(true);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-primary">Bobchi Gas</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/order">
              <Button variant="ghost">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Gas
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/order-history" className="w-full flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order History
                  </Link>
                </DropdownMenuItem>
{signin ? (<DropdownMenuItem onClick={() => router.push('/auth') }>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </DropdownMenuItem>):(
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
                )}
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}