import { Professional, Specialty } from '@/types';

const professionalStore: Professional[] = [
  {
    id: 'pro-001', name: 'Dr. Sarah Mitchell', specialty: 'physical-therapist',
    bio: 'Board-certified physical therapist with 12 years of experience specializing in sports injuries and post-surgical rehabilitation. I work with athletes and active adults to restore function and prevent re-injury using evidence-based techniques.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78702','78703','78704','78705'],
    credentials: ['DPT','OCS','CSCS'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    pricingMin: 120, pricingMax: 180, rating: 4.9, reviewCount: 147, yearsExperience: 12,
    acceptingClients: true, email: 'sarah.mitchell@fitconnect.com', createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'pro-002', name: 'Marcus Johnson', specialty: 'strength-conditioning',
    bio: 'NSCA-certified Strength & Conditioning Specialist with a background in Division I collegiate athletics. I design personalized programs for athletes looking to maximize performance, power, and injury resilience.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78745','78748','78749'],
    credentials: ['CSCS','NSCA-CPT','FMS Level 2'], photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
    pricingMin: 80, pricingMax: 140, rating: 4.8, reviewCount: 89, yearsExperience: 8,
    acceptingClients: true, email: 'marcus.johnson@fitconnect.com', createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'pro-003', name: 'Dr. Priya Patel', specialty: 'nutritionist',
    bio: 'Registered Dietitian and certified sports nutritionist helping clients achieve sustainable health through personalized nutrition plans. Specializing in weight management, sports performance nutrition, and managing chronic conditions through diet.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78702','78731','78756'],
    credentials: ['RD','CSSD','CDN'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    pricingMin: 90, pricingMax: 150, rating: 4.9, reviewCount: 203, yearsExperience: 10,
    acceptingClients: true, email: 'priya.patel@fitconnect.com', createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'pro-004', name: 'Jake Rivera', specialty: 'massage-therapist',
    bio: 'Licensed Massage Therapist specializing in deep tissue, sports massage, and myofascial release. With 7 years of experience working with high-performance athletes and weekend warriors, I help clients recover faster and move better.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78702','78703','78723'],
    credentials: ['LMT','NCTMB'], photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    pricingMin: 75, pricingMax: 120, rating: 4.7, reviewCount: 134, yearsExperience: 7,
    acceptingClients: true, email: 'jake.rivera@fitconnect.com', createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'pro-005', name: 'Elena Vasquez', specialty: 'yoga-instructor',
    bio: 'E-RYT 500 certified yoga instructor with training in therapeutic yoga, prenatal yoga, and meditation. I create mindful movement practices that help clients reduce stress, improve flexibility, and build a sustainable wellness routine.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78702','78751','78752'],
    credentials: ['E-RYT 500','YACEP','Prenatal Yoga Certified'], photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    pricingMin: 60, pricingMax: 100, rating: 4.8, reviewCount: 178, yearsExperience: 9,
    acceptingClients: true, email: 'elena.vasquez@fitconnect.com', createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'pro-006', name: 'Dr. James Okafor', specialty: 'mental-wellness',
    bio: 'Licensed Professional Counselor specializing in sport psychology, performance anxiety, and holistic mental wellness. I integrate cognitive-behavioral techniques with mindfulness practices to help clients optimize their mental performance and overall wellbeing.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78703','78731','78746'],
    credentials: ['LPC','CMPC','MS Psychology'], photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop',
    pricingMin: 130, pricingMax: 200, rating: 4.9, reviewCount: 92, yearsExperience: 15,
    acceptingClients: true, email: 'james.okafor@fitconnect.com', createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'pro-007', name: 'Brittany Chen', specialty: 'personal-trainer',
    bio: 'NASM-certified personal trainer and weight loss specialist with a passion for helping busy professionals fit fitness into their lives. My programs are efficient, results-driven, and adaptable to any schedule or fitness level.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78702','78745','78748','78749'],
    credentials: ['CPT-NASM','CES','Precision Nutrition L1'], photo: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop',
    pricingMin: 65, pricingMax: 110, rating: 4.7, reviewCount: 156, yearsExperience: 6,
    acceptingClients: true, email: 'brittany.chen@fitconnect.com', createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'pro-008', name: 'Dr. Amanda Torres', specialty: 'physical-therapist',
    bio: 'Doctor of Physical Therapy specializing in chronic pain, neurological conditions, and orthopedic rehabilitation. I take a whole-person approach, addressing movement patterns, lifestyle factors, and mental resilience alongside physical treatment.',
    city: 'Austin', state: 'TX', zipCodes: ['78702','78704','78723','78741'],
    credentials: ['DPT','NCS','LSVT BIG Certified'], photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
    pricingMin: 110, pricingMax: 170, rating: 4.8, reviewCount: 118, yearsExperience: 11,
    acceptingClients: true, email: 'amanda.torres@fitconnect.com', createdAt: '2024-01-25T00:00:00Z',
  },
  {
    id: 'pro-009', name: 'Ryan Fitzgerald', specialty: 'strength-conditioning',
    bio: 'Former professional rugby player turned CSCS coach. I specialize in building athletic foundations for collision sport athletes and tactical athletes (military, law enforcement, firefighters). No-nonsense, science-backed programming.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78744','78745','78747'],
    credentials: ['CSCS','USAW Sports Performance','CF-L2'], photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    pricingMin: 85, pricingMax: 150, rating: 4.6, reviewCount: 67, yearsExperience: 5,
    acceptingClients: true, email: 'ryan.fitzgerald@fitconnect.com', createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'pro-010', name: 'Sophia Williams', specialty: 'nutritionist',
    bio: 'Integrative nutritionist and functional medicine practitioner focused on gut health, hormonal balance, and anti-inflammatory eating patterns. I combine lab data with dietary analysis to create truly personalized nutrition protocols.',
    city: 'Austin', state: 'TX', zipCodes: ['78701','78731','78733','78746','78750'],
    credentials: ['MS Nutrition','CNS','IFMCP'], photo: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=400&h=400&fit=crop',
    pricingMin: 100, pricingMax: 175, rating: 4.9, reviewCount: 241, yearsExperience: 13,
    acceptingClients: false, email: 'sophia.williams@fitconnect.com', createdAt: '2024-01-05T00:00:00Z',
  },
];

export function getAllProfessionals(): Professional[] { return professionalStore; }
export function getProfessionalById(id: string): Professional | undefined {
  return professionalStore.find((p) => p.id === id);
}
export function getProfessionalsBySpecialty(specialty: Specialty): Professional[] {
  return professionalStore.filter((p) => p.specialty === specialty);
}
export function createProfessional(data: Omit<Professional, 'id' | 'createdAt'>): Professional {
  const professional: Professional = { ...data, id: `pro-${Date.now()}`, createdAt: new Date().toISOString() };
  professionalStore.push(professional);
  return professional;
}
export function updateProfessional(id: string, patch: Partial<Professional>): Professional | undefined {
  const index = professionalStore.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  professionalStore[index] = { ...professionalStore[index], ...patch };
  return professionalStore[index];
}
