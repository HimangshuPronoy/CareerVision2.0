import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_CONFIG } from '@/integrations/stripe/config';
import { Settings as SettingsIcon, Save, Bell, Shield, Moon, Sun, LogOut, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { subscription, refreshSubscription } = useSubscription();
  const { loading: stripeLoading, createPortalSession } = useStripeCheckout();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setEmail(user.email || '');
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          if (data) {
            setName(data.full_name || '');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserData();

    // Check system preferences for dark mode
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user?.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = () => {
    // Apply theme
    document.documentElement.classList.toggle('dark', darkMode);
    
    toast({
      title: 'Preferences saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Notification settings saved',
      description: 'Your notification preferences have been updated successfully.',
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: 'Privacy settings saved',
      description: 'Your privacy settings have been updated successfully.',
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error signing out',
        description: 'There was a problem signing out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleManageSubscription = async () => {
    await createPortalSession();
  };

  const formatDate = (timestamp: Date | null) => {
    if (!timestamp) return 'N/A';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(timestamp);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled />
                <p className="text-sm text-muted-foreground">
                  Your email address cannot be changed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <Button 
                onClick={handleSaveProfile} 
                disabled={loading} 
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Actions that will affect your account permanently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="destructive" 
                onClick={handleLogout} 
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 p-6 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      {subscription.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </div>
                    
                    <div className="grid gap-1">
                      <div className="text-2xl font-bold">
                        {subscription.plan === 'monthly' && 'Pro Monthly'}
                        {subscription.plan === 'yearly' && 'Pro Yearly'}
                        {!subscription.plan && 'Free Plan'}
                      </div>
                      
                      {subscription.plan && (
                        <div className="text-muted-foreground">
                          {subscription.plan === 'monthly' && `$${STRIPE_CONFIG.MONTHLY_PLAN_PRICE}/month`}
                          {subscription.plan === 'yearly' && `$${STRIPE_CONFIG.YEARLY_PLAN_PRICE}/year`}
                        </div>
                      )}
                    </div>
                    
                    {subscription.isActive && (
                      <div className="mt-2 grid gap-1 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <span>Current period ends on:</span>
                          <span className="ml-1 font-semibold text-foreground">
                            {formatDate(subscription.currentPeriodEnd)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              {subscription.isActive ? (
                <Button 
                  onClick={handleManageSubscription} 
                  disabled={stripeLoading} 
                  className="gap-2"
                >
                  {stripeLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Manage Subscription
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/pricing')} 
                  className="gap-2 bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600"
                >
                  <CreditCard className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription Benefits</CardTitle>
              <CardDescription>
                Features included in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  <span>Basic career insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  <span>Job market overview</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  <span>Resume builder (1 resume)</span>
                </li>
                
                <li className={`flex items-start ${subscription.isActive ? '' : 'text-muted-foreground'}`}>
                  {subscription.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mr-2" />
                  )}
                  <span>Advanced career insights</span>
                </li>
                
                <li className={`flex items-start ${subscription.isActive ? '' : 'text-muted-foreground'}`}>
                  {subscription.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mr-2" />
                  )}
                  <span>AI-powered career recommendations</span>
                </li>
                
                <li className={`flex items-start ${subscription.isActive ? '' : 'text-muted-foreground'}`}>
                  {subscription.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mr-2" />
                  )}
                  <span>Unlimited resume builder</span>
                </li>
              </ul>
            </CardContent>
            {!subscription.isActive && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/pricing')} 
                  className="gap-2 w-full"
                >
                  View All Plan Features
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how CareerVision looks and behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
              
              <Button onClick={handleSavePreferences} className="gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control what notifications you receive and how
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your career progress
                  </p>
                </div>
                <Switch 
                  id="weekly-digest" 
                  checked={weeklyDigest} 
                  onCheckedChange={setWeeklyDigest} 
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Job Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new job opportunities matching your profile
                  </p>
                </div>
                <Switch 
                  id="job-alerts" 
                  checked={jobAlerts} 
                  onCheckedChange={setJobAlerts}
                  disabled={!emailNotifications}
                />
              </div>
              
              <Button onClick={handleSaveNotifications} className="gap-2">
                <Save className="h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your data privacy and sharing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-muted-foreground">
                    Allow your anonymized data to be used for improving our services
                  </p>
                </div>
                <Switch 
                  id="data-sharing" 
                  checked={dataSharing} 
                  onCheckedChange={setDataSharing} 
                />
              </div>
              
              <Button onClick={handleSavePrivacy} className="gap-2">
                <Save className="h-4 w-4" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
