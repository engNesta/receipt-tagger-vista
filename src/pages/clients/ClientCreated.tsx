
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ClientCreated = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Client Created!</h1>
            <p className="text-gray-600 mb-8">
              The client has been successfully added to your system.
            </p>
            
            <Link to="/clients">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientCreated;
