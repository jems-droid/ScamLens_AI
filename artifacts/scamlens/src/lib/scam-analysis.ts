export type ScanType = 'message' | 'url' | 'image';
export type Verdict = 'Safe to consider' | 'Use caution' | 'Likely a scam';

export type ScanResult = {
  id: string;
  type: ScanType;
  inputPreview: string;
  score: number;
  verdict: Verdict;
  explanation: string;
  warningSigns: string[];
  suggestedActions: string[];
  createdAt: string;
};

const suspiciousWords = ['urgent', 'verify', 'suspended', 'gift card', 'password', 'click now', 'crypto', 'prize', 'refund'];

function makeResult(type: ScanType, rawInput: string): ScanResult {
  const input = rawInput.trim();
  const lower = input.toLowerCase();
  const hits = suspiciousWords.filter((word) => lower.includes(word));
  const hasLink = /(https?:\/\/|www\.)/i.test(input);
  const hasPressure = /(now|immediately|within \d|final notice|act fast)/i.test(input);
  const hasMoney = /(\$|£|€|gift card|payment|bank|bitcoin|crypto)/i.test(input);
  let score = type === 'image' ? 48 : 17;
  score += hits.length * 7 + (hasLink ? 15 : 0) + (hasPressure ? 12 : 0) + (hasMoney ? 10 : 0);
  if (type === 'url') score += 12;
  score = Math.min(97, Math.max(5, score));

  const verdict: Verdict = score >= 65 ? 'Likely a scam' : score >= 34 ? 'Use caution' : 'Safe to consider';
  const warningSigns = hits.slice(0, 3).map((hit) => `Uses language about “${hit}” to create concern or urgency.`);
  if (hasPressure && warningSigns.length < 4) warningSigns.push('Pushes you to act before you have time to check the details.');
  if (hasLink && warningSigns.length < 4) warningSigns.push('Contains a link. The sender or destination should be checked independently.');
  if (hasMoney && warningSigns.length < 4) warningSigns.push('Mentions money, payment details, or a valuable reward.');
  if (!warningSigns.length) warningSigns.push('No common scam patterns stood out in this scan.');

  const explanation = verdict === 'Likely a scam'
    ? 'This looks designed to make you act quickly or share something valuable. Pause and verify it through a trusted channel before doing anything.'
    : verdict === 'Use caution'
      ? 'A few details deserve a closer look. This is not proof of a scam, but it is worth checking the sender and request another way.'
      : 'We did not find strong signals of a common scam pattern. Still, only you can confirm that the sender and request are genuine.';

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    inputPreview: input || 'Image upload',
    score,
    verdict,
    explanation,
    warningSigns,
    suggestedActions: verdict === 'Likely a scam'
      ? ['Do not reply or click any links.', 'Contact the organization using a number or website you already trust.', 'Report and delete the message if it is unsolicited.']
      : verdict === 'Use caution'
        ? ['Take a pause before responding.', 'Look up the sender independently, not through the message.', 'Ask someone you trust for a second opinion.']
        : ['Check that the sender and context make sense.', 'Avoid sharing passwords or payment details.', 'If anything changes, scan it again.'],
    createdAt: new Date().toISOString(),
  };
}

export async function analyzeInput(type: ScanType, input: string): Promise<ScanResult> {
  await new Promise((resolve) => setTimeout(resolve, 850));
  return makeResult(type, input);
}