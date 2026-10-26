# Form Handling & Validation Strategy

## 1. Core Form Technologies

Forms in the School ERP frontend are built with:

- **React Hook Form (v7)**: Manages form state, input registration, errors, and submission lifecycle without unnecessary re-renders.
- **Zod (v3)**: Declares typed validation schemas with runtime parsing and validation.
- **@hookform/resolvers/zod**: Seamlessly bridges Zod schemas into React Hook Form.

---

## 2. Standard Form Architecture Pattern

Every complex form inside a feature should follow this 3-step pattern:

### Step 1: Define the Zod Schema

```typescript
// features/students/schemas/student.schema.ts
import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  gradeLevel: z.number().int().min(1).max(12),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
```

### Step 2: Implement the Form Component

```tsx
// features/students/components/student-form.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStudentSchema, type CreateStudentFormValues } from '../schemas/student.schema';
import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';

interface StudentFormProps {
  onSubmit: (data: CreateStudentFormValues) => void;
  isLoading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      gradeLevel: 1,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
      <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Button type="submit" isLoading={isLoading}>
        Save Student
      </Button>
    </form>
  );
};
```

---

## 3. Server-Side Validation Error Mapping

When the backend returns HTTP 422 with validation errors, map them directly into form state:

```typescript
const onSubmit = async (data: CreateStudentFormValues) => {
  try {
    await createStudentMutation.mutateAsync(data);
  } catch (err) {
    if (err instanceof ApiClientError && Array.isArray(err.details)) {
      err.details.forEach(detail => {
        if (detail.field) {
          setError(detail.field as any, { message: detail.message });
        }
      });
    }
  }
};
```
