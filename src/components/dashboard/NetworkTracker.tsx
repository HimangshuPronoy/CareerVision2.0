
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Building, Calendar } from 'lucide-react';

const NetworkTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    connection_name: '',
    connection_title: '',
    company: '',
    industry: '',
    connection_type: '',
    interaction_frequency: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('network_connections')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const addConnection = async () => {
    if (!newConnection.connection_name.trim()) return;

    try {
      const { error } = await supabase
        .from('network_connections')
        .insert({
          ...newConnection,
          user_id: user?.id,
          last_interaction_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: 'Connection Added!',
        description: 'Your network connection has been saved.',
      });

      setNewConnection({
        connection_name: '',
        connection_title: '',
        company: '',
        industry: '',
        connection_type: '',
        interaction_frequency: '',
        notes: ''
      });
      setShowAddForm(false);
      fetchConnections();
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to add connection.',
        variant: 'destructive',
      });
    }
  };

  const getNetworkScore = () => {
    if (connections.length === 0) return 0;
    
    const diversityScore = new Set(connections.map(c => c.industry)).size * 10;
    const frequencyScore = connections.filter(c => ['daily', 'weekly'].includes(c.interaction_frequency)).length * 5;
    const qualityScore = connections.filter(c => c.connection_type === 'mentor').length * 15;
    
    return Math.min(100, diversityScore + frequencyScore + qualityScore);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Network Tracker
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{getNetworkScore()}/100</Badge>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Connection
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 border rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Name"
                value={newConnection.connection_name}
                onChange={(e) => setNewConnection({...newConnection, connection_name: e.target.value})}
              />
              <Input
                placeholder="Job Title"
                value={newConnection.connection_title}
                onChange={(e) => setNewConnection({...newConnection, connection_title: e.target.value})}
              />
              <Input
                placeholder="Company"
                value={newConnection.company}
                onChange={(e) => setNewConnection({...newConnection, company: e.target.value})}
              />
              <Input
                placeholder="Industry"
                value={newConnection.industry}
                onChange={(e) => setNewConnection({...newConnection, industry: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select onValueChange={(value) => setNewConnection({...newConnection, connection_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Connection Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setNewConnection({...newConnection, interaction_frequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Interaction Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addConnection} size="sm">Add Connection</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {connections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No connections yet. Start building your network!</p>
            </div>
          ) : (
            connections.slice(0, 5).map((connection) => (
              <div key={connection.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{connection.connection_name}</p>
                  <p className="text-sm text-gray-600">
                    {connection.connection_title} at {connection.company}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {connection.connection_type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {connection.interaction_frequency}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {connections.length > 5 && (
          <p className="text-sm text-gray-500 text-center">
            +{connections.length - 5} more connections
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkTracker;
