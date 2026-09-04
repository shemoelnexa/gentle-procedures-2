/**
 * Restores the two homepage accordions that the copy v2.1 pass flattened
 * into static lists: The Journey and The Questions.
 *
 * Every word of body copy below is lifted verbatim from the approved v2.1
 * pages already in site/ -- what-to-expect.html for the journey steps and
 * faqs.html for the three answers. Nothing here is newly written.
 */
const fs = require('fs');
const path = 'site/index.html';
let html = fs.readFileSync(path, 'utf8');

function accordion(parentId, extraClass, indent, items) {
  const pad = ' '.repeat(indent);
  const rows = items.map(function (it, i) {
    const first = i === 0;
    const btn = first
      ? 'accordion-button gp-accordion__button'
      : 'accordion-button collapsed gp-accordion__button';
    const col = first ? 'accordion-collapse collapse show' : 'accordion-collapse collapse';
    return [
      '',
      pad + '  <div class="accordion-item gp-accordion__item">',
      pad + '    <h3 class="accordion-header">',
      pad + '      <button class="' + btn + '" type="button" data-bs-toggle="collapse" data-bs-target="#' + it.id + '" aria-expanded="' + first + '" aria-controls="' + it.id + '">',
      pad + '        <span class="gp-accordion__title">' + it.title + '</span>',
      pad + '        <span class="gp-accordion__chevron' + it.chevron + '" aria-hidden="true"></span>',
      pad + '      </button>',
      pad + '    </h3>',
      pad + '    <div id="' + it.id + '" class="' + col + '" data-bs-parent="#' + parentId + '">',
      pad + '      <div class="accordion-body gp-accordion__body">',
      pad + '        ' + it.body,
      pad + '      </div>',
      pad + '    </div>',
      pad + '  </div>',
      ''
    ].join('\n');
  }).join('');
  return pad + '<div class="accordion gp-accordion' + extraClass + '" id="' + parentId + '" data-aos="fade-up">\n' + rows + pad + '</div>\n';
}

/* ---------- 1. The Journey ---------- */
const oldJourney = [
  '            <ul class="gp-day-list">',
  '              <li class="gp-day-list__item">Booking takes a single message, and we will ask what would make the day easier for you.</li>',
  '              <li class="gp-day-list__item">Parking is beneath the building, and the directions reach you well before the day.</li>',
  '              <li class="gp-day-list__item">Your nurse weighs your son and talks you through everything before anything happens.</li>',
  '              <li class="gp-day-list__item">You meet your surgeon unhurried, and stay beside your son if you wish.</li>',
  '              <li class="gp-day-list__item">Afterwards a private room is yours, for feeding and for quiet.</li>',
  '              <li class="gp-day-list__item">You go home with everything you need, and we check in over the first few days.</li>',
  '            </ul>',
  ''
].join('\n');

const NAVY = ' gp-accordion__chevron--navy';
const JBODY = '\n                ';

const journeyItems = [
  {
    id: 'home-journey-01',
    chevron: NAVY,
    title: 'Booking takes a single message, and we will ask what would make the day easier for you.',
    body: '<p class="mb-0">Booking takes one message. From that first conversation, we&rsquo;re already thinking about your day (will a big brother or sister be joining us? Would you prefer English or Arabic?) so that everything is ready before you arrive. If the morning goes sideways, as mornings with a newborn do, rescheduling is simple and entirely guilt free.</p>'
  },
  {
    id: 'home-journey-02',
    chevron: NAVY,
    title: 'Parking is beneath the building, and the directions reach you well before the day.',
    body: '<p>Parking is free beneath the building, entered from the rear. If you would rather stay at street level, there is RTA parking directly outside.</p>' + JBODY +
          '<p class="mb-0">A short service road off Al Wasl Road brings you to our front door. We send the parking instructions with your directions and your map pin before the day, so nothing has to be worked out in the car. Give yourself plenty of time, because Dubai traffic is unpredictable and arriving unhurried makes the whole morning calmer. Bring your Emirates ID card, and your son&rsquo;s if it has come through.</p>'
  },
  {
    id: 'home-journey-03',
    chevron: NAVY,
    title: 'Your nurse weighs your son and talks you through everything before anything happens.',
    body: '<p class="mb-0">A nurse brings you through, checks your son&rsquo;s weight, and explains every detail of what happens next, nothing assumed, nothing skipped.</p>'
  },
  {
    id: 'home-journey-04',
    chevron: NAVY,
    title: 'You meet your surgeon unhurried, and stay beside your son if you wish.',
    body: '<p class="gp-label mb-2">About a minute</p>' + JBODY +
          '<p class="mb-0">Then you sit with your surgeon. You are warmly encouraged to stay beside your son throughout. Once the local anaesthetic has gently taken effect, the procedure itself takes about a minute. Quick, precise, and never once rushed.</p>'
  },
  {
    id: 'home-journey-05',
    chevron: NAVY,
    title: 'Afterwards a private room is yours, for feeding and for quiet.',
    body: '<p class="mb-0">Afterwards, a private room is yours. Your nurse settles you in, checks on him, and gently walks you through the aftercare, every question answered. Feed him whenever he&rsquo;s ready, and there&rsquo;s a dedicated feeding room too, should you want it.</p>'
  },
  {
    id: 'home-journey-06',
    chevron: NAVY,
    title: 'You go home with everything you need, and we check in over the first few days.',
    body: '<p class="mb-0">Your discharge pack holds everything you&rsquo;ll need, and a few small extras from us. The same guidance reaches you three ways: printed, on WhatsApp, and by email, so it can never be lost.</p>'
  }
];

/* ---------- 2. The Questions ---------- */
const oldFaq = [
  '        <ul class="gp-day-list gp-day-list--light" data-aos="fade-up">',
  '            <li class="gp-day-list__item"><a class="gp-day-list__link" href="faqs.html">Will it hurt him?<span aria-hidden="true">&rarr;</span></a></li>',
  '            <li class="gp-day-list__item"><a class="gp-day-list__link" href="faqs.html">Can I stay with him?<span aria-hidden="true">&rarr;</span></a></li>',
  '            <li class="gp-day-list__item"><a class="gp-day-list__link" href="faqs.html">What do I do the first evening?<span aria-hidden="true">&rarr;</span></a></li>',
  '        </ul>',
  ''
].join('\n');

const faqItems = [
  {
    id: 'home-faq-01',
    chevron: '',
    title: 'Will it hurt him?',
    body: '<p class="mb-0">Keeping your son comfortable is the part we think about most. It begins at home with a well-timed feed, and we&rsquo;ll guide you on it. When you arrive, his nurse gives him a small, carefully measured dose of comfort medicine, the area is gently numbed, and the anaesthetic is given all the time it needs to work. We never rush. Around that we add every small thing that helps a baby stay settled: a warm room, something sweet to suck on, gentle sounds, and you right beside him. The moment itself is brief, and many babies are so settled they sleep right through it. We can&rsquo;t promise yours will never make a sound, but we can promise his comfort guides every single thing we do. Most babies settle quickly and feed contentedly soon after.</p>'
  },
  {
    id: 'home-faq-02',
    chevron: '',
    title: 'Can I stay with him?',
    body: '<p class="mb-0">Yes, you can stay, and most parents do. Your calm presence close to him, your face near his and your voice low, is one of the most powerful comforts he has. What you&rsquo;d see is gentler than most parents imagine. He&rsquo;s swaddled and warm, with something sweet to suck, the area is fully numbed first, and for most babies the moment itself is calm and brief. Many sleep through it. If you&rsquo;d rather not watch, that&rsquo;s completely fine too. Some parents look only at their son&rsquo;s face, some sit close and stroke his head, and some step outside and come back the moment he&rsquo;s wrapped and ready for a cuddle. There&rsquo;s no right or wrong way, only what feels right for you. Tell us your preference, or simply decide in the moment. Whatever you choose, he is never alone.</p>'
  },
  {
    id: 'home-faq-03',
    chevron: '',
    title: 'What do I do the first evening?',
    body: '<p class="mb-0">When your son is unsettled in the first day or two, run through this simple order. Start with the most powerful comfort: feed him and hold him close, bare against your chest if you can. The warmth, your heartbeat and your smell settle a newborn like nothing else, and for many babies this alone does it. If he needs more, add gentle rhythmic motion, a slow sway or rock, and a snug swaddle to quiet the startle reflex. Sound helps too: a soft steady &lsquo;shhhh&rsquo; close to his ear, or quiet white noise across the room at a gentle volume. Dim the lights, lower your voice and slow down. If you&rsquo;re calm and relaxed, your baby is more likely to settle too. If the numbing is easing and he seems genuinely uncomfortable, a little paracetamol as we&rsquo;ve shown you is perfectly sensible. Lay him on his back to sleep, keep him comfortably cool, and if the usual comforts aren&rsquo;t enough, message us.</p>'
  }
];

function swap(label, needle, replacement) {
  const n = html.split(needle).length - 1;
  if (n !== 1) throw new Error(label + ': expected 1 match, found ' + n);
  html = html.replace(needle, replacement);
  console.log('  ' + label + ' -> accordion');
}

swap('The Journey', oldJourney, accordion('homeJourneyAccordion', ' gp-accordion--statement', 12, journeyItems));
swap('The Questions', oldFaq, accordion('homeFaqAccordion', ' gp-accordion--dark gp-accordion--statement', 8, faqItems));

fs.writeFileSync(path, html);
console.log('site/index.html updated');
