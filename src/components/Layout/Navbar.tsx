import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CubeLogo } from '@/components/ui/cube-logo';
import { useAuth } from '@/hooks/useAuth';
import { useStripe } from '@/hooks/useStripe';
import { getProductByPriceId } from '@/stripe-config';
import { toast } from 'sonner';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { getSubscription } = useStripe();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        try {
          const subscription = await getSubscription();
          if (subscription?.price_id) {
            const product = getProductByPriceId(subscription.price_id);
            setCurrentPlan(product?.name || null);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      } else {
        setCurrentPlan(null);
      }
    };

    fetchSubscription();
  }, [user, getSubscription]);

  const navLinks = [
    { href: '/pricing', label: 'Pricing' },
  ];

  const handleSignOut = async (closeMobileMenu = false) => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Failed to sign out');
      } else {
        toast.success('Signed out successfully');
        if (closeMobileMenu) {
          setIsMobileMenuOpen(false);
        }
      }
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-border/40' 
          : 'bg-background/60 border-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img 
            src="https://res.cloudinary.com/effichat/image/upload/v1756054849/mwklypitt7gyinxtnirj.png" 
            alt="Roomify Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-foreground">Roomify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-button font-medium transition-colors hover:text-primary ${
                location.pathname === link.href 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-sm">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                    {currentPlan && (
                      <p className="text-xs text-muted-foreground">{currentPlan} Plan</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="h-9 text-button">
              <Link to="/signin">Sign in</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSignOut(true)}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}