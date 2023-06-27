const crypto = require("crypto");

function getSeedValue(key, l, seed, t) {
  for (let i = 0; i < t; i++) {
    const hash = crypto.createHash("sha256");
    hash.update(key);
    hash.update(seed.toString());
    seed = parseInt(hash.digest("hex"), 16);
  }
  return seed;
}

function shift(str, i, l) {
  let j = i;
  for (j = i; j < l; j++) {
    str[j] = str[j + 1];
  }
  str[j] = "\0";
}

function copy(dest, src, l) {
  let i = 0;
  for (i = 0; i < l; i++) {
    dest[i] = src[i];
  }
  dest[i] = "\0";
}

function insertCharAt(str, l, c, pos) {
  let i = l;
  for (i = l; i > pos; i--) {
    str[i] = str[i - 1];
  }
  str[i] = c;
}

function shuffle(str1, l1, str2, l2, ctx, l3, seed, mix) {
  let i,
    k,
    t = 16,
    d = 1783;
  const s1 = new Uint8Array(1024);
  const s2 = new Uint8Array(1024);
  const s3 = new Uint8Array(1024);
  let ll1 = l1;
  let ll2 = l2;
  let ll3 = l3;

  copy(s1, str1, l1);
  copy(s2, str2, l2);
  copy(s3, ctx, l3);

  seed = getSeedValue(ctx, l3, seed, t);
  t = (seed % d) + 16;
  seed = getSeedValue(str1, l1, seed, t);
  t = (seed % d) + 16;
  seed = getSeedValue(str2, l2, seed, t);
  t = (seed % d) + 16;

  i = 0;
  while (ll1 !== 0 && ll2 !== 0) {
    if ((seed & 1) === 0) {
      seed = getSeedValue(str2, l2, seed, t);
      t = (seed % d) + 16;
      seed = getSeedValue(str1, l1, seed, t);
      t = (seed % d) + 16;
      seed = getSeedValue(ctx, l3, seed, t);
      t = (seed % d) + 16;
      k = seed % ll1;
      mix[i++] = s1[k];
      shift(s1, k, ll1);
      ll1--;
    } else {
      seed = getSeedValue(str2, l2, seed, t);
      t = (seed % d) + 16;
      seed = getSeedValue(str1, l1, seed, t);
      t = (seed % d) + 16;
      seed = getSeedValue(ctx, l3, seed, t);
      t = (seed % d) + 16;
      k = seed % ll2;
      mix[i++] = s2[k];
      shift(s2, k, ll2);
      ll2--;
    }
  }

  for (k = 0; k < ll1; k++) {
    seed = getSeedValue(str2, l2, seed, t);
    t = (seed % d) + 16;
    seed = getSeedValue(str1, l1, seed, t);
    t = (seed % d) + 16;
    seed = getSeedValue(ctx, l3, seed, t);
    t = (seed % d) + 16;
    const pos = seed % i;
    insertCharAt(mix, i, s1[k], pos);
    i++;
  }

  for (k = 0; k < ll2; k++) {
    seed = getSeedValue(str2, l2, seed, t);
    t = (seed % d) + 16;
    seed = getSeedValue(str1, l1, seed, t);
    t = (seed % d) + 16;
    seed = getSeedValue(ctx, l3, seed, t);
    t = (seed % d) + 16;
    const pos = seed % i;
    insertCharAt(mix, i, s2[k], pos);
    i++;
  }

  mix[i] = "\0";

  console.log("\nFirst String:", str1);
  console.log("Second String:", str2);
  console.log("Context String:", ctx);
  console.log("Shuffled String:", mix);
}

function sha256(str) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

function main() {
  let mix = new Uint8Array(1024);
  let i;

  // User ID change
  // password hashing
  let p1 = "Pass@1975";
  let p2 = "mydomain.com";
  let ctxp = "Xyz@2023";

  // User ID hashing
  let u1 = "Xyz@2023";
  let u2 = "mydomain.com";
  let ctxu = "Pass@1975";

  // Key hashing
  let k1 = "Xyz@2023";
  let k2 = "Pass@1975mydomain.com";
  let ctxk = "Pass@1975Xyz@2023";
  4;

  let seed = 198899;
  let l1, l2, l3;

  console.log("\nShuffling for user ID");
  l1 = u1.length;
  l2 = u2.length;
  l3 = ctxu.length;
  shuffle(u1, l1, u2, l2, ctxu, l3, seed, mix);

  let sha256Hash = sha256(
    Buffer.from(mix.subarray(0, mix.indexOf(0))).toString()
  );
  console.log("The SHA256 hash value:", sha256Hash);

  // console.log("\nShuffling for password");
  // l1 = p1.length;
  // l2 = p2.length;
  // l3 = ctxp.length;
  // shuffle(p1, l1, p2, l2, ctxp, l3, seed, mix);

  // sha256Hash = sha256(Buffer.from(mix.subarray(0, mix.indexOf(0))).toString());
  // console.log("The SHA256 hash value:", sha256Hash);

  // console.log("\nShuffling for key");
  // l1 = k1.length;
  // l2 = k2.length;
  // l3 = ctxk.length;
  // shuffle(k1, l1, k2, l2, ctxk, l3, seed, mix);

  // sha256Hash = sha256(Buffer.from(mix.subarray(0, mix.indexOf(0))).toString());
  // console.log("The SHA256 hash value:", sha256Hash);
}

main();
