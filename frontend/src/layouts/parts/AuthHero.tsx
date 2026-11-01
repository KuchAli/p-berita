import illustration from "../../assets/illustration.png";

const AuthHero = () => {
  return (
    <aside className="w-full flex flex-col gap-4 md:gap-6 lg:gap-10 bg-(--color-base) text-white p-6 md:px-10 md:py-8 lg:p-12">
      <p className="text-xl md:text-2xl font-extrabold">
        P<span className="text-(--color-primary)">Berita</span>
      </p>

      <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:flex-col lg:items-stretch lg:gap-6">
        <div className="flex flex-col gap-3 md:flex-1 md:min-w-0 lg:gap-6">
          <small className="text-white">Suara warga. Cerita bermakna.</small>

          <h1 className="flex flex-col text-3xl md:text-4xl lg:text-5xl text-white">
            <span>Berita dekat.</span> <span>Perspektif lebih luas.</span>
          </h1>

          <p className="text-sm md:text-base">
            Baca, bagikan, dan diskusikan cerita yang membentuk komunitas kita.
          </p>
        </div>

        <img
          src={illustration}
          alt="Ilustrasi koran dan diskusi"
          className="hidden md:block md:w-56 md:shrink-0 lg:w-full lg:aspect-[16/10] lg:max-h-80 xl:max-h-96 rounded-xl object-cover"
        />
      </div>
    </aside>
  );
};

export default AuthHero;