// Schémas de validation pour l'authentification (zod recommandé)
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  companyName: z.string().min(1, 'Nom entreprise requis'),
  role: z.string().min(1, 'Rôle requis'),
  services: z.array(z.string().min(1)),
  regions: z.array(z.string().min(1)).min(1, 'Sélectionnez au moins une zone'),
  employees: z.string().min(1, 'Sélectionnez une plage'),
  openingHours: z.any(),
  address: z.string().min(1, 'Adresse requise'),
  email: z.string().email('Email valide requis'),
  phone: z.string(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  x: z.string().optional(),
  pitch: z.string().optional(),
  password: z.string().min(8, 'Mot de passe (min 8 caractères)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Email valide requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});
