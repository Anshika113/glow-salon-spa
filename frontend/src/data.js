// ============================================================================
// Central business data — edit this one file to rebrand the whole site.
//
// Everything here is REAL, editable business information. Where a claim can't
// be verified (star rating, review count, years in business, team members,
// before/after results) the field is deliberately left empty and the matching
// UI simply doesn't render. Fill it in with genuine data and the section
// appears automatically — nothing is invented on your behalf.
// ============================================================================

export const business = {
  name: 'Glow Salon & Spa',
  // Wordmark used in the navbar / footer lockup
  wordmark: 'Glow',
  wordmarkSub: 'Salon & Spa',
  tagline: 'Look good. Feel better.',
  intro:
    'A calm, modern salon & spa in the heart of Bandra. From a fresh haircut to a full day of pampering, our team helps you look and feel your best.',
  // Short line used under the hero headline
  lede: 'Hair, skin, beauty and spa care in the heart of Bandra — designed around you.',
  phoneDisplay: '+91 98765 43210',
  phone: '+919876543210', // tel: link
  whatsapp: '919876543210', // wa.me number, no + or spaces
  email: 'hello@glowsalonspa.com',
  address: '12 Rose Avenue, Bandra West, Mumbai 400050',
  // Broken out for the LocalBusiness structured data in index.html
  addressParts: {
    street: '12 Rose Avenue',
    locality: 'Bandra West',
    city: 'Mumbai',
    region: 'Maharashtra',
    postalCode: '400050',
    country: 'IN',
  },
  area: 'Bandra West, Mumbai',
  hours: 'Open all week · 10:00 AM – 8:00 PM',
  // Google Maps embed (generic Bandra location for the demo)
  mapEmbed: 'https://www.google.com/maps?q=Bandra%20West%20Mumbai&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Bandra+West+Mumbai',
  social: {
    // Replace with your real profile URLs, e.g. https://instagram.com/yoursalon
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
}

// --- Opening hours ----------------------------------------------------------
// The salon is open every day, 10:00–20:00. The "open now" badge in the hero is
// worked out from these two numbers, so it is always accurate.
export const OPENS_AT = 10
export const CLOSES_AT = 20

export function openState(now = new Date()) {
  const hour = now.getHours() + now.getMinutes() / 60
  if (hour >= OPENS_AT && hour < CLOSES_AT) return { open: true, label: 'Open today · until 8 PM' }
  if (hour < OPENS_AT) return { open: false, label: 'Opens today at 10 AM' }
  return { open: false, label: 'Opens tomorrow at 10 AM' }
}

// Half-hour appointment *preferences*, bounded by the real opening hours.
// These are preferences the guest asks for — we confirm the actual slot back to
// them, so no availability is implied or promised anywhere in the UI.
export const timePreferences = (() => {
  const out = []
  for (let h = OPENS_AT; h < CLOSES_AT; h++) {
    for (const m of [0, 30]) {
      const suffix = h < 12 ? 'AM' : 'PM'
      const h12 = h % 12 === 0 ? 12 : h % 12
      out.push(`${h12}:${String(m).padStart(2, '0')} ${suffix}`)
    }
  }
  return out
})()

// --- Reviews / rating -------------------------------------------------------
// Left null on purpose: no star rating, review count or "rated by N clients"
// claim is shown anywhere until you paste in verified figures from your Google
// Business Profile. Example:
//   export const rating = { value: 4.8, count: 214, source: 'Google',
//                           url: 'https://g.page/r/…' }
export const rating = null

// --- Photography ------------------------------------------------------------
// Files live in /public/images/photos/ at two widths (640 / 1280) so every
// <SmartImage> can ship a real srcset. Swap the files for your own photography
// keeping the same names — see /public/images/README.md.
const PHOTOS = '/images/photos'

export function photo(name, alt = '', widths = [640, 1280]) {
  const set = (ext) => widths.map((w) => `${PHOTOS}/${name}-${w}.${ext} ${w}w`).join(', ')
  return {
    // WebP is ~65% smaller; the JPEG stays as the <img> fallback so the image
    // still loads on anything that can't decode WebP.
    src: `${PHOTOS}/${name}-${widths[widths.length - 1]}.jpg`,
    srcSet: set('jpg'),
    webpSrcSet: set('webp'),
    alt,
  }
}

export const heroImages = {
  portrait: photo(
    'portrait-hair',
    'A client at Glow Salon & Spa with freshly styled long hair',
    [640, 1280, 1600],
  ),
  detail: photo('detail-scissors', 'A stylist trimming hair with scissors'),
}

// --- WhatsApp ---------------------------------------------------------------
export const whatsappLink = (text = "Hi Glow Salon & Spa, I'd like to book an appointment.") =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`

// Builds the WhatsApp message for an appointment request from the booking form.
export function appointmentMessage({ name, phone, service, date, time, message } = {}) {
  const lines = ["Hi Glow Salon & Spa, I'd like to request an appointment."]
  if (service) lines.push(`Service: ${service}`)
  if (date) lines.push(`Preferred date: ${date}`)
  if (time) lines.push(`Preferred time: ${time}`)
  if (name) lines.push(`Name: ${name}`)
  if (phone) lines.push(`Phone: ${phone}`)
  if (message) lines.push(`Notes: ${message}`)
  return lines.join('\n')
}

// --- Services ---------------------------------------------------------------
// `price` is a genuine starting price. `includes` restates what the description
// already covers — nothing new is claimed. `duration` is intentionally blank:
// add real treatment times ('45 min', '1 hr 30 min') and they appear in the UI.
export const services = [
  {
    id: 'hair-styling-cut',
    categories: ['hair'],
    title: 'Hair Styling & Cut',
    price: 'from ₹499',
    desc: 'Precision cuts, blow-drys and styling for every hair type and occasion.',
    includes: ['Precision cut', 'Blow-dry', 'Styling for any occasion'],
    duration: '',
  },
  {
    id: 'hair-colour-highlights',
    categories: ['hair'],
    title: 'Hair Colour & Highlights',
    price: 'from ₹1,499',
    desc: 'Global colour, highlights, balayage and root touch-ups using premium products.',
    includes: ['Global colour', 'Highlights & balayage', 'Root touch-ups'],
    duration: '',
  },
  {
    id: 'facials-skincare',
    categories: ['skin'],
    title: 'Facials & Skincare',
    price: 'from ₹899',
    desc: 'Cleansing, hydrating and anti-ageing facials tailored to your skin.',
    includes: ['Cleansing facials', 'Hydrating facials', 'Anti-ageing facials'],
    duration: '',
  },
  {
    id: 'bridal-party-makeup',
    categories: ['bridal', 'makeup'],
    title: 'Bridal & Party Makeup',
    price: 'from ₹2,999',
    desc: 'Flawless HD makeup for brides, engagements and special evenings.',
    includes: ['Bridal HD makeup', 'Engagement & party makeup', 'Occasion styling'],
    duration: '',
  },
  {
    id: 'manicure-pedicure',
    categories: ['nails'],
    title: 'Manicure & Pedicure',
    price: 'from ₹599',
    desc: 'Classic and spa mani-pedis that leave hands and feet beautifully groomed.',
    includes: ['Classic manicure', 'Classic pedicure', 'Spa mani-pedi'],
    duration: '',
  },
  {
    id: 'spa-massage',
    categories: ['spa'],
    title: 'Spa & Massage',
    price: 'from ₹1,199',
    desc: 'Relaxing body massages and spa therapies to melt away the week.',
    includes: ['Relaxing body massage', 'Spa therapies'],
    duration: '',
  },
]

// The six things a guest can book, in the order they appear on the site.
// Each blurb is drawn from the service descriptions above.
export const serviceCategories = [
  {
    id: 'hair',
    label: 'Hair',
    blurb: 'Cuts, styling, colour and treatments.',
    photo: photo('hair-styling', 'A stylist sectioning a client’s long hair'),
    ratio: '4 / 5',
  },
  {
    id: 'skin',
    label: 'Skin',
    blurb: 'Cleansing, hydrating and anti-ageing facials.',
    photo: photo('skin-facial', 'A facial treatment being applied with a brush'),
    ratio: '4 / 5',
  },
  {
    id: 'spa',
    label: 'Spa',
    blurb: 'Relaxing body massages and spa therapies.',
    photo: photo('spa-massage', 'A relaxing back massage in a warm treatment room'),
    ratio: '4 / 5',
  },
  {
    id: 'makeup',
    label: 'Makeup',
    blurb: 'HD makeup for engagements and special evenings.',
    photo: photo('makeup-beauty', 'Close-up of finished eye makeup and lipstick'),
    ratio: '4 / 5',
  },
  {
    id: 'nails',
    label: 'Nails',
    blurb: 'Classic and spa manicures and pedicures.',
    photo: photo('nails-hands', 'A freshly finished neutral manicure'),
    ratio: '4 / 5',
  },
  {
    id: 'bridal',
    label: 'Bridal',
    blurb: 'Flawless HD makeup for your wedding day.',
    photo: photo('bridal-portrait', 'A bride in gold jewellery with bridal makeup'),
    ratio: '4 / 5',
  },
]

export const servicesIn = (categoryId) =>
  services.filter((s) => s.categories.includes(categoryId))

export const categoryById = (id) => serviceCategories.find((c) => c.id === id)

// The highest-value real services on the menu, shown in the Signature section.
export const signatureServices = [
  { id: 'bridal-party-makeup', photo: photo('bridal-veil', 'A bride in a red and gold veil') },
  { id: 'hair-colour-highlights', photo: photo('hair-wash', 'A colour rinse at the salon basin') },
  { id: 'spa-massage', photo: photo('spa-stones', 'A hot stone massage in progress') },
].map((s) => ({ ...services.find((x) => x.id === s.id), photo: s.photo }))

// --- What we promise --------------------------------------------------------
// Practical, checkable statements about how the salon runs.
export const promises = [
  { title: 'Experienced team', text: 'Trained stylists and therapists who listen before they start.' },
  { title: 'Hygiene first', text: 'Sanitised tools and a spotless, freshly prepared station every time.' },
  { title: 'Honest advice', text: 'We recommend what suits you — never an upsell.' },
  { title: 'Premium products', text: 'Skin-friendly, professional-grade products on every service.' },
  { title: 'Private treatment areas', text: 'Quiet, screened rooms for facials, spa and massage.' },
  { title: 'Booking in a minute', text: 'One WhatsApp message and your preferred slot is requested.' },
]

// --- The space --------------------------------------------------------------
export const spaceImages = [
  photo('salon-chairs', 'Styling chairs along the window at Glow Salon & Spa'),
  photo('skin-treatment', 'A facial treatment in a private room'),
  photo('salon-mirrors', 'Arched mirrors in the styling area'),
]

export const aboutImages = [
  photo('salon-products', 'Professional hair and skin products on the shelf'),
  photo('salon-reception', 'The reception and retail area at Glow Salon & Spa'),
]

// --- Gallery ----------------------------------------------------------------
// NOTE: these are licence-free stock photographs used as a finished-looking
// placeholder set. They are captioned by area/service and never presented as
// the salon's own client results. Replace the files in
// /public/images/photos/ with your own photography before going live.
export const gallery = [
  { label: 'Hair Studio', category: 'Hair', photo: photo('hair-salon-floor', 'The hair studio at Glow Salon & Spa'), ratio: '4 / 5' },
  { label: 'Colour Bar', category: 'Hair', photo: photo('hair-colour', 'Hair colour being applied at the colour bar'), ratio: '1 / 1' },
  { label: 'Skin & Facials', category: 'Skin', photo: photo('skin-glow', 'Glowing skin after a facial'), ratio: '4 / 5' },
  { label: 'Bridal Suite', category: 'Bridal', photo: photo('makeup-bridal-eye', 'Bridal eye makeup being applied'), ratio: '3 / 4' },
  { label: 'Makeup Studio', category: 'Makeup', photo: photo('makeup-artist', 'A makeup artist working with a client'), ratio: '4 / 5' },
  { label: 'Nail Lounge', category: 'Nails', photo: photo('nails-technician', 'A nail technician finishing a manicure'), ratio: '1 / 1' },
  { label: 'Spa Rooms', category: 'Spa', photo: photo('spa-room', 'A private spa treatment room'), ratio: '3 / 4' },
  { label: 'Reception', category: 'The Space', photo: photo('salon-reception', 'The reception area at Glow Salon & Spa'), ratio: '4 / 5' },
  { label: 'Relaxation', category: 'Spa', photo: photo('spa-shoulders', 'A relaxing shoulder massage'), ratio: '1 / 1' },
]

export const galleryFilters = ['All', ...new Set(gallery.map((g) => g.category))]

// --- Reviews ----------------------------------------------------------------
// Real client feedback collected by the salon. `service` is taken from what the
// reviewer themselves mentions. Add new entries here — do not invent any.
// `reviewsUrl` stays empty until you have a public reviews page to link to;
// the "Read all reviews" link is hidden while it is blank.
export const reviewsUrl = ''

export const testimonials = [
  {
    name: 'Ananya R.',
    service: 'Hair Colour & Highlights',
    text: 'Best haircut and colour I have had in Mumbai. The team is so warm and the space is spotless.',
  },
  {
    name: 'Priya S.',
    service: 'Bridal & Party Makeup',
    text: 'Got my bridal makeup done here — I looked stunning and felt completely relaxed all day.',
  },
  {
    name: 'Meera K.',
    service: 'Facials & Skincare',
    text: 'My go-to spot for facials and pedicures. Booking on WhatsApp is quick and easy.',
  },
]

// --- Team -------------------------------------------------------------------
// Empty by design — the "Meet the experts" section only renders once you add
// real people. Shape:
//   { name: 'Riya Sharma', role: 'Senior Stylist', speciality: 'Balayage & colour
//     correction', experience: '8 years', photo: photo('team-riya', 'Riya Sharma') }
export const team = []

// --- Before / after ---------------------------------------------------------
// Empty by design. Adding genuine consented before/after pairs turns on the
// comparison slider; until then the site shows a photography-led gallery
// instead of fabricated "results". Shape:
//   { category: 'Colour', before: photo('ba-1-before', '…'),
//     after: photo('ba-1-after', '…'), caption: 'Balayage, 3 hours' }
export const transformations = []
