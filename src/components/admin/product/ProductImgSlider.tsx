import { useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  product: { image: string[] };
  BASE_URL: string;
};

export default function ProductImgSlider({ product, BASE_URL }: Props) {
  const timeoutRef = useRef<number | null>(null);

  const images = product.image ?? [];

  if (images.length === 1) {
    return (
      <div className="relative max-w-[150px] flex justify-center">
        <img
          src={`${BASE_URL}${images[0]}`}
          alt="product"
          className="h-12 w-12 object-cover rounded-md border"
        />
      </div>
    );
  }

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    created(slider) {
      function nextTick() {
        timeoutRef.current = window.setTimeout(() => {
          slider.next();
          nextTick();
        }, 3000);
      }
      nextTick();
    },
    destroyed() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
  });

  return (
    <div className="relative max-w-[150px]">
      <div
        ref={sliderRef}
        className="keen-slider rounded-md overflow-hidden"
        style={{ position: "relative", zIndex: 0 }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="keen-slider__slide flex justify-center">
            <img
              src={`${BASE_URL}${img}`}
              alt={`product-${idx}`}
              className="h-12 w-12 object-cover rounded-md border"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => instanceRef.current?.prev()}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow z-50"
        style={{ pointerEvents: "auto" }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => instanceRef.current?.next()}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow z-50"
        style={{ pointerEvents: "auto" }}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
