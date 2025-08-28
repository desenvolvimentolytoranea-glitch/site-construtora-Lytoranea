import React from 'react';
import { AdminClientGrid } from '@/components/admin/AdminClientGrid';

const AdminClients: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <AdminClientGrid />
    </div>
  );
};

export default AdminClients;