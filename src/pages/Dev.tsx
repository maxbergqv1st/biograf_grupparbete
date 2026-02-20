import BiografCard from '@/components/custom/BiografCard';

dev.route = {
  path: '/dev',
  menuLabel: 'main.navigation.dev',
  index: 2,
};

export default function dev() {
  //   const { t } = useTranslation();

  return (
    <section>
      <div>hello</div>
      <BiografCard
        title="Card "
        description="Hej max"
        footer={<button>Klicka här</button>}
      >
        <p>Ditt innehåll här</p>
      </BiografCard>
    </section>
  );
}
