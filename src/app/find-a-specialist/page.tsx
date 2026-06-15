import IntakeWizard from '@/components/intake/IntakeWizard';

export const metadata = { title: 'Find a Specialist — FitConnect' };

export default function FindSpecialistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Specialist</h1>
          <p className="text-gray-500">Answer a few questions to get matched with the right professional</p>
        </div>
        <IntakeWizard />
      </div>
    </div>
  );
}
