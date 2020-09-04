import React, {
  FC,
  useEffect,
  useCallback,
  useRef,
  CSSProperties,
} from 'react';

interface Props {
  url: string;
  deg?: 0 | 90 | 180 | 270;
  classname?: string;
  styles?: CSSProperties;
}

export const RotatedImage: FC<Props> = ({
  url,
  deg = 0,
  classname = '',
  styles = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const makeImage = useCallback(() => {
    const img = new Image();
    img.src = url;
    img.onload = image => {
      const { width } = image.target as HTMLImageElement;
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
  }, [url, deg]);
  useEffect(() => {
    if ([90, 270].includes(deg)) {
      makeImage();
    }
  }, [deg, makeImage]);
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
