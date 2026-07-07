const Jimp = require('jimp');

(async () => {
  const src = 'GentleProc_logo_72dpiRGB-large.jpg';
  const img = await Jimp.read(src);

  // Make near-white pixels transparent (logo sits on white bg)
  const trans = img.clone();
  trans.scan(0, 0, trans.bitmap.width, trans.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    // brightness of near-white background
    const min = Math.min(r, g, b);
    if (r > 238 && g > 238 && b > 238) {
      this.bitmap.data[idx + 3] = 0; // fully transparent
    } else if (min > 205) {
      // soft edge: partial transparency based on how light it is
      const a = Math.max(0, 255 - (min - 205) * (255 / 33));
      this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], a);
    }
  });
  await trans.writeAsync('assets/img/logo.png');
  console.log('wrote assets/img/logo.png', trans.bitmap.width + 'x' + trans.bitmap.height);

  // Pure-white monochrome version for dark backgrounds (keep alpha, force RGB white)
  const white = trans.clone();
  white.scan(0, 0, white.bitmap.width, white.bitmap.height, function (x, y, idx) {
    if (this.bitmap.data[idx + 3] > 8) {
      this.bitmap.data[idx] = 245;
      this.bitmap.data[idx + 1] = 241;
      this.bitmap.data[idx + 2] = 233;
    }
  });
  await white.writeAsync('assets/img/logo-ivory.png');
  console.log('wrote assets/img/logo-ivory.png');

  // Extract just the heart-hand mark (left portion, roughly square) for use as a motif
  const markW = Math.round(trans.bitmap.height * 1.05);
  const mark = trans.clone().crop(0, 0, Math.min(markW, trans.bitmap.width), trans.bitmap.height).autocrop({ tolerance: 0, cropOnlyFrames: false });
  await mark.writeAsync('assets/img/logo-mark.png');
  console.log('wrote assets/img/logo-mark.png', mark.bitmap.width + 'x' + mark.bitmap.height);
})();
