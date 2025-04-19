import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, ShieldCheck, AlertTriangle, PenTool as Tool } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-pattern relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6">
              Safe & Reliable Gas Delivery
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Order your gas cylinders with confidence. Fast delivery, competitive prices, and expert service.
            </p>
            <Link href="/order">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Information Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Safety First: Your Guide to Gas Safety
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SafetyCard
              icon={<ShieldCheck className="w-8 h-8 text-primary" />}
              title="Proper Handling"
              description="Learn the correct way to handle and store your gas cylinders safely."
            />
            <SafetyCard
              icon={<Flame className="w-8 h-8 text-primary" />}
              title="Leak Detection"
              description="Know how to detect and respond to potential gas leaks promptly."
            />
            <SafetyCard
              icon={<AlertTriangle className="w-8 h-8 text-primary" />}
              title="Emergency Procedures"
              description="Essential steps to take in case of a gas-related emergency."
            />
            <SafetyCard
              icon={<Tool className="w-8 h-8 text-primary" />}
              title="Maintenance Tips"
              description="Regular maintenance practices to keep your gas system safe."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function SafetyCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white/5 border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}