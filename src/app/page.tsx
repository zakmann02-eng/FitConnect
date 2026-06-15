import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Heart,
  Dumbbell,
  Salad,
  Brain,
  Waves,
  Activity,
  Wind,
} from 'lucide-react';
import { SPECIALTY_LABELS, Specialty } from '@/types';
import { getAllProfessionals } from '@/lib/data/professionals';

const specialtyIcons: Record<Specialty, React.ReactNode> = {
  'physical-therapist': <Activity className="h-7 w-7" />,
  'massage-therapist': <Waves className="h-7 w-7" />,
  'strength-conditioning': <Dumbbell className="h-7 w-7" />,
  nutritionist: <Salad className="h-7 w-7" />,
  'personal-trainer': <TrendingUp className="h-7 w-7" />,
  'yoga-instructor': <Wind className="h-7 w-7" />,
  'mental-wellness': <Brain className="h-7 w-7" />,
};

const testimonials = [
  {
    name: 'Rachel K.',
    role: 'Marathon Runner',
    text: "After my stress fracture, FitConnect matched me with Dr. Mitchell in less than 5 minutes. Best recovery experience I've ever had.",
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  },
  {
    name: 'David M.',
    role: 'Software Engineer',
    text: 'I needed a nutritionist who understood my busy schedule. Got 3 great options immediately — chose Priya and lost 28 lbs in 4 months.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
  },
  {
    name: 'Tanya R.',
    role: 'High School Coach',
    text: 'FitConnect helped me find a strength coach for our varsity team. Marcus completely transformed our injury prevention program.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  },
];

export default function HomePage() {
  const professionals = getAllProfessionals();
  const specialties = Object.keys(SPECIALTY_LABELS) as Specialty[];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              500+ Verified Professionals
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Find the Right{' '}
              <span className="text-emerald-600">Health & Wellness</span>{' '}
              Professional for You
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Answer a few quick questions and get matched with top-rated physical therapists,
              nutritionists, strength coaches, and more — all in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/find-a-specialist"
                className="bg-emerald-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                Find My Specialist <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/professionals"
                className="border border-gray-300 text-gray-700 px-7 py-3.5 rounded-xl font-semibold text-base hover:border-emerald-400 hover:text-emerald-700 transition-colors text-center"
              >
                Browse All Professionals
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Free to use</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Verified credentials</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Instant matching</span>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {professionals.slice(0, 4).map((pro) => (
              <div key={pro.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={pro.photo}
                    alt={pro.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover w-11 h-11"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{pro.name}</p>
                    <p className="text-xs text-emerald-600">{SPECIALTY_LABELS[pro.specialty]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.round(pro.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{pro.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-emerald-600 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { value: '500+', label: 'Verified Professionals' },
            { value: '10,000+', label: 'Successful Matches' },
            { value: '4.8★', label: 'Average Rating' },
            { value: '48hrs', label: 'Avg. Response Time' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold">{stat.value}</div>
              <div className="text-emerald-100 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How FitConnect Works</h2>
            <p className="text-gray-500 text-lg">Get matched with the right specialist in 3 easy steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Tell Us Your Goals',
                desc: 'Share your health goals, location, and budget through our quick 2-minute questionnaire.',
                icon: <Heart className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: '2',
                title: 'Get Matched',
                desc: 'Our algorithm instantly surfaces the top verified professionals who fit your specific needs.',
                icon: <Users className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: '3',
                title: 'Connect & Start',
                desc: 'Review profiles, send a message, and book your first appointment — all in one place.',
                icon: <ArrowRight className="h-8 w-8 text-emerald-600" />,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-emerald-600 mb-1">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/find-a-specialist"
              className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Specialty Categories */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Specialty</h2>
            <p className="text-gray-500 text-lg">Find the right type of professional for your needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                href={`/professionals?specialty=${specialty}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  {specialtyIcons[specialty]}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{SPECIALTY_LABELS[specialty]}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {professionals.filter((p) => p.specialty === specialty && p.acceptingClients).length} available
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Clients Say</h2>
            <p className="text-gray-500 text-lg">Join thousands who found their perfect match</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-5 leading-relaxed">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Professionals */}
      <section className="bg-gray-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Are You a Health & Wellness Professional?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join FitConnect and receive qualified leads delivered directly to your dashboard.
            No monthly fees. No wasted consultations.
          </p>
          <Link
            href="/for-professionals"
            className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-400 transition-colors inline-flex items-center gap-2 text-lg"
          >
            Join as a Professional <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
