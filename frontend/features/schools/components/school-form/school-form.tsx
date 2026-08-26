"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateSchoolInput } from '../../types';
import { api } from '@/services/api';

interface SchoolFormProps {
  onSubmit: (data: CreateSchoolInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function SchoolForm({ onSubmit, onCancel, isLoading }: SchoolFormProps) {
  const [campuses, setCampuses] = useState<{ campus_id: string; campus_name: string }[]>([]);
  const [formData, setFormData] = useState<CreateSchoolInput>({
    campus_id: '',
    school_code: '',
    school_name: '',
    description: '',
  });

  useEffect(() => {
    api.get<{ campus_id: string; campus_name: string }[]>('/campuses')
      .then((res) => {
        const list = res.data || [];
        setCampuses(list);
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, campus_id: list[0].campus_id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campus_id || !formData.school_code || !formData.school_name) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campus_id">Campus *</Label>
        <select
          id="campus_id"
          value={formData.campus_id}
          onChange={(e) => setFormData({ ...formData, campus_id: e.target.value })}
          className="w-full text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          required
        >
          {campuses.map((c) => (
            <option key={c.campus_id} value={c.campus_id}>
              {c.campus_name}
            </option>
          ))}
          {campuses.length === 0 && (
            <option value="d3b07384-d113-4ec2-a5d4-e69f11111111">Main Campus</option>
          )}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="school_code">School Code *</Label>
        <Input
          id="school_code"
          placeholder="e.g. SOE"
          value={formData.school_code}
          onChange={(e) => setFormData({ ...formData, school_code: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="school_name">School Name *</Label>
        <Input
          id="school_name"
          placeholder="e.g. School of Engineering"
          value={formData.school_name}
          onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Faculty and disciplines overview"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create School'}
        </Button>
      </div>
    </form>
  );
}
