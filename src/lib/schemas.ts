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

export const dashboardSummarySchema = z.object({
  total_leads: z.number(),
  total_emails: z.number(),
  recent_missions: z.array(
    z.object({
    id: z.number(),
    name: z.string(),
    progress: z.number().min(0).max(100),
    status: z.enum(['active', 'completed', 'draft', 'in_progress']),
    leads_found: z.number(),
    leads_requested: z.number(),
    started_ago: z.number(),
  }))
});

export const missionSchema = z.object({
  id: z.number(),
  name: z.string(),
  target_location: z.string(),
  target_sector: z.string(),
  lead_count: z.number(),
  notes: z.any().optional(),
  created_at: z.string(), // ISO date
  progress: z.number().min(0).max(100),
  status: z.enum(['completed', 'in_progress']),
});

export const dashboardMissionsSchema = z.array(missionSchema);



// Schéma pour la liste des leads d'une mission
export const missionLeadSchema = z.object({
  id: z.number(),
  company_name: z.string(),
  address: z.string().optional().nullable(),
  score: z.number(),
  email: z.string().min(1).nullable().optional(),
  phone: z.array(z.string().optional()).nullable(),
  reason: z.string().optional().nullable(),
  created_at: z.string(), // ISO date
});

export const missionLeadsListSchema = z.array(missionLeadSchema);

export const profileSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  companyName: z.string().min(1, 'Nom entreprise requis'),
  role: z.string().min(1, 'Rôle requis'),
  services: z.array(z.string().min(1, 'Service requis')).min(1, 'Au moins un service'),
  regions: z.array(z.string().min(1, 'Zone requise')).min(1, 'Au moins une zone'),
  employees: z.string().min(1, 'Plage requise'),
  openingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
  address: z.string().optional(),
  email: z.string().email('Email valide requis'),
  phone: z.array(z.string().optional()),
  website: z.string().optional(),
  socialNetworks: z.object({
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    x: z.string().optional(),
    pitch: z.string().optional(),
  }), 
});

export type ProfileFormFields = z.infer<typeof profileSchema>;
