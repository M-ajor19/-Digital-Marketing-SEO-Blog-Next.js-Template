import Link from 'next/link';

export default function CTASemanticSection() {
  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16 rounded-4xl shadow-xl text-center">
      <div className="container">
        <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
        <p className="text-xl opacity-90 mb-8">
          Get expert digital marketing strategies tailored to your needs.
        </p>
        <Link href="/contact" className="btn-secondary text-lg px-8 py-3 inline-block">
          Get a Free Consultation
        </Link>
      </div>
    </section>
  );
}
