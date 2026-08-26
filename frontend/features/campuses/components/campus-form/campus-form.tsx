"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateCampusInput } from '../../types';

interface CampusFormProps {
  onSubmit: (data: CreateCampusInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CampusForm({ onSubmit, onCancel, isLoading }: CampusFormProps) {
  const [formData, setFormData] = useState<CreateCampusInput>({
    campus_code: '',
    campus_name: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campus_code || !formData.campus_name) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campus_code">Campus Code *</Label>
        <Input
          id="campus_code"
          placeholder="e.g. CAMPUS-BLR"
          value={formData.campus_code}
          onChange={(e) => setFormData({ ...formData, campus_code: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campus_name">Campus Name *</Label>
        <Input
          id="campus_name"
          placeholder="e.g. Bengaluru Main Campus"
          value={formData.campus_name}
          onChange={(e) => setFormData({ ...formData, campus_name: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Street address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            placeholder="PIN / Zip"
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Campus'}
        </Button>
      </div>
    </form>
  );
}
