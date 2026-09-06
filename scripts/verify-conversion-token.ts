/**
 * Focused Phase 0.1 check for conversion-token one-time redeem.
 * Run: npx tsx scripts/verify-conversion-token.ts
 */
import {
  issueConversionToken,
  redeemConversionToken,
} from "../src/lib/conversion-token";

async function main() {
  const token = await issueConversionToken();
  const first = await redeemConversionToken(token);
  const second = await redeemConversionToken(token);
  const forged = await redeemConversionToken("aaaa.1.bbbb");
  const empty = await redeemConversionToken("");
  const expiredPayload = "deadbeefdeadbeefdeadbeefdeadbeef.1." + "aa".repeat(32);
  const expired = await redeemConversionToken(expiredPayload);

  const report = { first, second, forged, empty, expired, tokenParts: token.split(".").length };
  console.log(JSON.stringify(report, null, 2));

  if (!(first === true && second === false && forged === false && empty === false)) {
    console.error("CONVERSION TOKEN CHECK FAILED");
    process.exit(1);
  }
  console.log("CONVERSION TOKEN CHECK PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
