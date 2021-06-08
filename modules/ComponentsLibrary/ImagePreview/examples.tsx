import React, { useCallback, useEffect } from 'react';
import { ImagePreview } from '.';
import { ExampleTitle } from '../helpers';

export default () => {
  const load = useCallback(() => {}, []);
  useEffect(() => load(), [load]);

  return (
    <>
      <ExampleTitle>Default</ExampleTitle>
      {/* This will work with either the url directly as so, or also with the image data itself (gets passed to src tag) */}
      {/* Also WOW this is cute */}
      <ImagePreview fileData="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-girl-cat-names-1606245046.jpg?crop=0.668xw:1.00xh;0.126xw,0&resize=980:*" />

      <ExampleTitle>Sized 150x150</ExampleTitle>
      {/* This will work with either the url directly as so, or also with the image data itself (gets passed to src tag) */}
      {/* Also WOW this is cute */}
      <ImagePreview
        imageSize={{ sizeX: 150, sizeY: 150 }}
        fileData="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-girl-cat-names-1606245046.jpg?crop=0.668xw:1.00xh;0.126xw,0&resize=980:*"
      />
    </>
  );
};
