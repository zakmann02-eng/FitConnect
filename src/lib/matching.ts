import { IntakeFormData, Professional } from '@/types';

export function matchProfessionals(
  intake: Pick<IntakeFormData, 'specialtyNeeded' | 'zipCode' | 'budgetMin' | 'budgetMax'>,
  professionals: Professional[]
): Professional[] {
  let candidates = professionals.filter(
    (p) => p.specialty === intake.specialtyNeeded && p.acceptingClients
  );
  const zipMatched = candidates.filter((p) => p.zipCodes.includes(intake.zipCode));
  if (zipMatched.length > 0) candidates = zipMatched;
  const budgetMatched = candidates.filter((p) => p.pricingMin <= intake.budgetMax);
  if (budgetMatched.length > 0) candidates = budgetMatched;
  return candidates
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 5);
}
