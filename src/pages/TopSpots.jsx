const spots = [
  {
    name: 'Ueno Park',
    location: 'Tokyo',
    bloomDates: 'Late March \u2013 Early April',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=400&fit=crop',
    description: 'One of Tokyo\'s most famous hanami spots with over 1,000 cherry trees lining the paths around Shinobazu Pond. The park hosts lively festivals during bloom season.',
  },
  {
    name: 'Meguro River',
    location: 'Tokyo',
    bloomDates: 'Late March \u2013 Early April',
    image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=600&h=400&fit=crop',
    description: 'A stunning 4km stretch of cherry trees along the Meguro River, creating a magical pink tunnel. Especially beautiful when lit up at night.',
  },
  {
    name: 'Yoshino Mountain',
    location: 'Nara Prefecture',
    bloomDates: 'Early \u2013 Mid April',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    description: 'Japan\'s most celebrated cherry blossom site with 30,000 trees covering the mountainside. Blooms progress from the base to summit over several weeks.',
  },
  {
    name: "Philosopher's Path",
    location: 'Kyoto',
    bloomDates: 'Late March \u2013 Mid April',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop',
    description: 'A peaceful 2km stone path along a canal lined with hundreds of cherry trees. Named after philosopher Nishida Kitaro who meditated here daily.',
  },
  {
    name: 'Himeji Castle',
    location: 'Hyogo Prefecture',
    bloomDates: 'Late March \u2013 Early April',
    image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=600&h=400&fit=crop',
    description: 'The iconic white castle framed by 1,000 cherry trees creates one of Japan\'s most photographed spring scenes.',
  },
  {
    name: 'Maruyama Park',
    location: 'Kyoto',
    bloomDates: 'Late March \u2013 Mid April',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop',
    description: 'Kyoto\'s most popular hanami park, centered around a magnificent weeping cherry tree that is illuminated at night.',
  },
  {
    name: 'Chidorigafuchi',
    location: 'Tokyo',
    bloomDates: 'Late March \u2013 Early April',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&h=400&fit=crop',
    description: 'Rent a rowboat on the Imperial Palace moat surrounded by over 200 cherry trees. One of Tokyo\'s most romantic hanami experiences.',
  },
  {
    name: 'Hirosaki Castle',
    location: 'Aomori Prefecture',
    bloomDates: 'Late April \u2013 Early May',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600&h=400&fit=crop',
    description: 'Famous for its 2,600 cherry trees and the stunning \u201Cpetal carpet\u201D that forms on the castle moat. A must-visit in northern Japan.',
  },
  {
    name: 'Shinjuku Gyoen',
    location: 'Tokyo',
    bloomDates: 'Late March \u2013 Mid April',
    image: 'https://images.unsplash.com/photo-1553653143-4013e49dd5f6?w=600&h=400&fit=crop',
    description: 'A vast garden with 1,100 cherry trees of 65 varieties, offering one of the longest viewing seasons in Tokyo. Alcohol-free and family-friendly.',
  },
  {
    name: 'Arashiyama',
    location: 'Kyoto',
    bloomDates: 'Late March \u2013 Mid April',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&h=400&fit=crop',
    description: 'The scenic mountain district features cherry blossoms reflected in the Oi River, with the iconic Togetsukyo Bridge as a backdrop.',
  },
]

export default function TopSpots() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          <span className="bg-gradient-to-r from-sakura-500 to-sakura-400 bg-clip-text text-transparent">
            Top 10 Hanami Spots
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Discover Japan's most beloved cherry blossom viewing locations,
          from Tokyo's iconic parks to Kyoto's serene temples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spots.map((spot, index) => (
          <div key={spot.name}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative h-52 overflow-hidden">
              <img
                src={spot.image}
                alt={spot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/fce7f3/ec4899?text=Cherry+Blossoms' }}
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-sakura-600">
                #{index + 1}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <h3 className="text-white text-xl font-bold">{spot.name}</h3>
                <div className="flex items-center gap-1 text-white/90 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {spot.location}
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{"\ud83c\udf38"}</span>
                <span className="text-sm font-semibold text-sakura-500">{spot.bloomDates}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{spot.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
