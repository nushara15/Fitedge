import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold">Get In Touch</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? Ready to start? We&apos;re here to help. Reach out to us, and let&apos;s start a conversation.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary" id="get-started">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
                <p className="mt-2 text-muted-foreground">
                  Find us at our headquarters or drop us a line.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-muted-foreground">General Inquiries</p>
                    <a href="mailto:hello@fitedge.com" className="text-primary hover:underline">
                      fitedgefitness@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-muted-foreground">Always</p>
                    <a href="tel:+1234567890" className="text-primary hover:underline">
                      072 62 45 554
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Office</h3>
                    <p className="text-muted-foreground">Colombo</p>
                    <p className="text-primary">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-8 rounded-lg shadow-lg">
                <h2 className="font-headline text-3xl font-bold">Send us a Message</h2>
                <p className="mt-2 text-muted-foreground">
                    We typically respond within 24 hours.
                </p>
                <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
