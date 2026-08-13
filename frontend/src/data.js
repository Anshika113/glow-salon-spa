// Central business data — edit this one file to rebrand the whole site.

export const business = {
  name: 'Glow Salon & Spa',
  tagline: 'Look good. Feel better.',
  intro:
    'A calm, modern salon & spa in the heart of Bandra. From a fresh haircut to a full day of pampering, our team helps you look and feel your best.',
  phoneDisplay: '+91 98765 43210',
  phone: '+919876543210', // tel: link
  whatsapp: '919876543210', // wa.me number, no + or spaces
  email: 'hello@glowsalonspa.com',
  address: '12 Rose Avenue, Bandra West, Mumbai 400050',
  hours: 'Open all week · 10:00 AM – 8:00 PM',
  // Google Maps embed (generic Bandra location for the demo)
  mapEmbed:
    'https://www.google.com/maps?q=Bandra%20West%20Mumbai&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Bandra+West+Mumbai',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
}

export const whatsappLink = (text = "Hi Glow Salon & Spa, I'd like to book an appointment.") =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`

// Ready-to-show stock photography with graceful fallback. Precedence per image:
//   your local file → themed photo (LoremFlickr) → generic real photo (Picsum) → gradient
// Keyword-based sources need no photo IDs, so they reliably return an image.
const flickr = (keywords, lock, w = 800, h = 1000) =>
  `https://loremflickr.com/${w}/${h}/${keywords}?lock=${lock}`
const picsum = (seed, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

// Hero photos. Drop files at the local paths to override the stock imagery;
// until then, the stock photos (then gradient panels) show automatically.
export const heroImages = {
  main: ['/images/hero/salon.jpg', flickr('hair,salon,interior', 21, 900, 1150), picsum('glow-salon', 900, 1150)],
  secondary: ['/images/hero/spa.jpg', flickr('spa,candles,wellness', 22, 800, 800), picsum('glow-spa', 800, 800)],
}

export const services = [
  {
    icon: '✂️',
    title: 'Hair Styling & Cut',
    price: 'from ₹499',
    desc: 'Precision cuts, blow-drys and styling for every hair type and occasion.',
  },
  {
    icon: '🎨',
    title: 'Hair Colour & Highlights',
    price: 'from ₹1,499',
    desc: 'Global colour, highlights, balayage and root touch-ups using premium products.',
  },
  {
    icon: '✨',
    title: 'Facials & Skincare',
    price: 'from ₹899',
    desc: 'Cleansing, hydrating and anti-ageing facials tailored to your skin.',
  },
  {
    icon: '💄',
    title: 'Bridal & Party Makeup',
    price: 'from ₹2,999',
    desc: 'Flawless HD makeup for brides, engagements and special evenings.',
  },
  {
    icon: '💅',
    title: 'Manicure & Pedicure',
    price: 'from ₹599',
    desc: 'Classic and spa mani-pedis that leave hands and feet beautifully groomed.',
  },
  {
    icon: '🌿',
    title: 'Spa & Massage',
    price: 'from ₹1,199',
    desc: 'Relaxing body massages and spa therapies to melt away the week.',
  },
]

// Gallery. Each tile shows the photo at `img` if the file exists, otherwise it
// gracefully falls back to the `tone` gradient — so it works offline and looks
// intentional before you add pictures. Drop JPG/PNG/WebP files at these paths in
// /public/images/gallery/ (or paste a full https:// URL into `img`).
export const gallery = [
  { label: 'Hair Studio', img: ['/images/gallery/hair-studio.jpg', flickr('hair,salon', 1), picsum('hair-studio')], tone: ['#2E7D32', '#7CB342'] },
  { label: 'Colour Bar', img: ['/images/gallery/colour-bar.jpg', flickr('haircolor,salon', 2), picsum('colour-bar')], tone: ['#6A1B9A', '#C158DC'] },
  { label: 'Skin & Facials', img: ['/images/gallery/skin-facials.jpg', flickr('facial,skincare', 3), picsum('skin-facials')], tone: ['#00897B', '#4DB6AC'] },
  { label: 'Bridal Suite', img: ['/images/gallery/bridal-suite.jpg', flickr('makeup,bride', 4), picsum('bridal-suite')], tone: ['#C2185B', '#F06292'] },
  { label: 'Nail Lounge', img: ['/images/gallery/nail-lounge.jpg', flickr('manicure,nails', 5), picsum('nail-lounge')], tone: ['#C6A15B', '#E7C98B'] },
  { label: 'Spa Rooms', img: ['/images/gallery/spa-rooms.jpg', flickr('spa,massage', 6), picsum('spa-rooms')], tone: ['#1565C0', '#64B5F6'] },
  { label: 'Reception', img: ['/images/gallery/reception.jpg', flickr('salon,interior', 7), picsum('reception')], tone: ['#455A64', '#90A4AE'] },
  { label: 'Relaxation', img: ['/images/gallery/relaxation.jpg', flickr('spa,wellness', 8), picsum('relaxation')], tone: ['#33691E', '#9CCC65'] },
]

export const testimonials = [
  {
    name: 'Ananya R.',
    text: 'Best haircut and colour I have had in Mumbai. The team is so warm and the space is spotless.',
  },
  {
    name: 'Priya S.',
    text: 'Got my bridal makeup done here — I looked stunning and felt completely relaxed all day.',
  },
  {
    name: 'Meera K.',
    text: 'My go-to spot for facials and pedicures. Booking on WhatsApp is quick and easy.',
  },
]
