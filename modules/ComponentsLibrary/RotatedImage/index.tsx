import React, {
  FC,
  useEffect,
  useCallback,
  useRef,
  CSSProperties,
} from 'react';

export type Deg = 0 | 90 | 180 | 270;

interface Props {
  url: string;
  deg?: Deg;
  classname?: string;
  styles?: CSSProperties;
  onImageSizeLoaded?: (width: number, height: number) => void;
}

export const RotatedImage: FC<Props> = ({
  url,
  deg = 0,
  classname = '',
  styles = {},
  onImageSizeLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processImage = useCallback(() => {
    const img = new Image();
    img.src = url;
    img.onload = image => {
      const { width, height } = image.target as HTMLImageElement;
      if (onImageSizeLoaded) {
        onImageSizeLoaded(width, height);
      }
      if ([0, 180].includes(deg)) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      var w = width;
      var ratio = img.width / w;
      var h = img.height / ratio;
      canvas.width = h;
      canvas.height = w;
      if (deg === 90) {
        ctx.translate(h, 0);
        ctx.rotate((90 * Math.PI) / 180);
      } else {
        ctx.translate(w - h, w);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.translate(0, -(w - h));
      }
      ctx.drawImage(img, 0, 0, w, h);
      ctx.save();
    };
  }, [url, deg, onImageSizeLoaded]);
  useEffect(processImage, [deg, processImage]);
  if ([0, 180].includes(deg))
    return (
      <img
        src={url}
        style={{ ...styles, transform: `rotate(${deg}deg)` }}
        className={classname}
      />
    );
  return <canvas ref={canvasRef} className={classname} style={styles} />;
};
