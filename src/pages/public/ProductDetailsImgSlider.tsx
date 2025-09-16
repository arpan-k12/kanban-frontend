import { useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  product: { image: string[] };
  BASE_URL: string;
};

export default function ProductDetailsImgSlider({ product, BASE_URL }: Props) {
  const timeoutRef = useRef<number | null>(null);
  const images = product.image ?? [];

  if (images.length === 1) {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="rounded-lg overflow-hidden flex justify-center bg-white">
          <img
            src={`${BASE_URL}${images[0]}`}
            alt="product"
            className="w-full h-[450px] object-contain"
          />
        </div>
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
        }, 4000);
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

  if (!images.length) {
    return (
      <div className="w-full max-w-2xl h-[450px] flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        ref={sliderRef}
        className="keen-slider rounded-lg overflow-hidden"
        style={{ minHeight: "450px" }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex items-center justify-center bg-white"
          >
            <img
              src={`${BASE_URL}${img}`}
              alt={`product-${idx}`}
              className="w-full h-[400px] object-contain"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => instanceRef.current?.prev()}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow z-50 hover:bg-white transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => instanceRef.current?.next()}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow z-50 hover:bg-white transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
