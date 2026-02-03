import Image from '../parts/Image';

OurVisionPage.route = {
  path: '/our-vision',
  menuLabel: 'Our Vision',
  index: 3,
};

export default function OurVisionPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
          Our vision
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          We run with our vision
        </h1>
        <Image
          src="/images/start.jpg"
          alt="A runner's legs and hands at the starting line of a track race."
        />
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="prose prose-neutral max-w-none">
          <p>
            We run with our vision to transform how people think about food
            shopping, creating a community where quality, sustainability, and
            genuine care come together naturally. Like dedicated runners, we
            pursue our goals with persistence and purpose.
          </p>
          <p>
            We dream of a food system that honors both the earth and the people
            who cultivate it. Every partnership we build with farmers and
            producers reflects our commitment to fair trade, environmental
            stewardship, and supporting local economies wherever possible.
          </p>
          <p>
            Innovation guides our approach to traditional values. We embrace
            modern techniques for freshness and efficiency while maintaining the
            personal relationships and attention to detail that define
            exceptional service.
          </p>
        </div>
        <div className="prose prose-neutral max-w-none">
          <p>
            Our customers are partners in this vision, running alongside us as
            we make conscious choices that ripple outward to support sustainable
            agriculture and healthier communities. Together, we&apos;re proving that
            grocery shopping can be both convenient and conscientious.
          </p>
          <p>
            Looking ahead, we see The Good Grocery as a model for responsible
            retail, inspiring other businesses to prioritize people and planet
            alongside profit. Through education, transparency, and unwavering
            commitment to quality, we&apos;re building a future where good food and
            good values are accessible to everyone in our community.
          </p>
        </div>
      </div>
    </section>
  );
}
