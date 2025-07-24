
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/ClientContext';

const AddClient = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName && formData.registrationNumber && formData.email) {
      addClient(formData);
      navigate('/clients/created');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/clients')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Building2 className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
            <p className="text-gray-600 mt-2">Enter client information below</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g., 556123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Add Client
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddClient;
