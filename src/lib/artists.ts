export interface Artist {
  id: string;
  name: string;
  movement: string;
  century: string;
  birthYear: number;
  deathYear: number | null;
  nationality: string;
  bio: string;
  searchTerms: string[]; // terms to search museum APIs
  displayNames: string[]; // exact name variants that artist_display should START with
}

export interface Movement {
  id: string;
  name: string;
  period: string;
  description: string;
  longDescription: string;
}

export const MOVEMENTS: Movement[] = [
  {
    id: "early-renaissance",
    name: "Early Renaissance",
    period: "1400s",
    description:
      "Marked the rebirth of classical ideals in Florence, emphasizing perspective, anatomical accuracy, and humanist themes.",
    longDescription:
      "The Early Renaissance began in Florence around 1400, driven by wealthy patrons like the Medici and a rediscovery of ancient Greek and Roman culture. Artists like Brunelleschi codified linear perspective, giving paintings a convincing illusion of depth for the first time. Masaccio, Botticelli, and Fra Angelico pioneered naturalistic anatomy and spatial composition while retaining deeply spiritual subject matter. The movement laid every technical foundation that the High Renaissance would perfect a century later.",
  },
  {
    id: "northern-renaissance",
    name: "Northern Renaissance",
    period: "1400s-1500s",
    description:
      "Characterized by meticulous detail, rich symbolism, and oil painting mastery in the Low Countries and Germany.",
    longDescription:
      "While Italian artists pursued ideal beauty, their counterparts in Flanders and Germany obsessed over the real world in microscopic detail. Jan van Eyck perfected oil glazing techniques that produced luminous, jewel-like surfaces, and Albrecht Durer brought Italian perspective north while adding a distinctly Germanic intensity. Hidden symbols permeate Northern Renaissance painting: a lily for purity, a snuffed candle for mortality, a convex mirror reflecting what lies beyond the frame. The result is art that rewards prolonged, close looking more than almost any other tradition.",
  },
  {
    id: "high-renaissance",
    name: "High Renaissance",
    period: "1490-1527",
    description:
      "The pinnacle of Renaissance art, achieving perfect harmony of form, color, and composition.",
    longDescription:
      "The High Renaissance represents a brief, extraordinary peak centered on Rome and Venice from roughly 1490 to 1527. Leonardo da Vinci, Michelangelo, and Raphael each pushed painting, sculpture, and architecture to a level of technical mastery and intellectual ambition that has defined 'great art' ever since. Leonardo's sfumato dissolved hard outlines into atmospheric haze; Michelangelo's Sistine Chapel ceiling reimagined the human body as a vehicle for divine energy; Raphael's School of Athens achieved a serene balance that became the textbook definition of classical composition.",
  },
  {
    id: "mannerism",
    name: "Mannerism",
    period: "1520-1600",
    description:
      "Reacted against Renaissance harmony with elongated forms, unusual spatial compositions, and vivid colors.",
    longDescription:
      "After the High Renaissance achieved 'perfection,' the next generation of artists had to find something new. Mannerists like El Greco, Pontormo, and Parmigianino deliberately stretched proportions, twisted figures into serpentine poses, and used acidic, unnatural color harmonies. Compositions became spatially ambiguous and emotionally heightened. What once looked like willful distortion is now recognized as a sophisticated, self-aware response to the anxiety of following Leonardo and Michelangelo.",
  },
  {
    id: "baroque",
    name: "Baroque",
    period: "1600-1750",
    description:
      "Dramatic, emotionally intense art using strong contrasts of light and shadow, rich color, and dynamic movement.",
    longDescription:
      "Born from the Catholic Counter-Reformation's need to awe and persuade, the Baroque style swept Europe in the 17th century. Caravaggio pioneered tenebrism — figures emerging from deep darkness into sharp, theatrical light — and his influence was felt from Rome to Utrecht. Rubens brought explosive energy and sensuous flesh to enormous canvases, while Velazquez used restrained observation to create the most psychologically penetrating portraits of the era. Baroque art demands a visceral, emotional response: wonder, piety, terror, ecstasy.",
  },
  {
    id: "dutch-golden-age",
    name: "Dutch Golden Age",
    period: "1600s",
    description:
      "Dutch painters excelled in portraiture, landscapes, still lifes, and genre scenes during a period of extraordinary wealth.",
    longDescription:
      "The newly independent Dutch Republic of the 1600s produced an astonishing concentration of painting talent fueled by a prosperous merchant class. Without the Catholic Church or royal courts as primary patrons, Dutch artists painted for the open market — inventing new genres in the process. Rembrandt transformed portraiture into psychological drama, Vermeer distilled domestic interiors into temples of light, and specialists in landscapes, seascapes, flowers, and food created works of breathtaking technical virtuosity. More paintings were produced in the 17th-century Netherlands than in any other place or time in history.",
  },
  {
    id: "rococo",
    name: "Rococo",
    period: "1720-1780",
    description:
      "Ornate, decorative art celebrating pleasure, romance, and the aristocratic lifestyle with pastel colors and playful themes.",
    longDescription:
      "Rococo emerged in early 18th-century France as a lighter, more playful reaction to the heavy grandeur of Louis XIV's Baroque. Watteau, Boucher, and Fragonard painted scenes of aristocratic leisure — garden parties, amorous encounters, and theatrical entertainments — in delicate pastel palettes of pink, pale blue, and cream. The style extended to architecture and interior design, favoring asymmetrical curves, gilded ornament, and an overall sense of whimsy. The French Revolution would sweep it away, but at its best, Rococo painting captures sensual pleasure with extraordinary refinement.",
  },
  {
    id: "neoclassicism",
    name: "Neoclassicism",
    period: "1760-1830",
    description:
      "Revived the aesthetics of ancient Greece and Rome, emphasizing order, symmetry, and moral virtue.",
    longDescription:
      "Fueled by archaeological discoveries at Pompeii and Herculaneum and the Enlightenment's reverence for reason, Neoclassicism sought to revive the noble simplicity of the ancient world. Jacques-Louis David became its champion, painting austere scenes of Roman civic virtue that resonated with revolutionary France. Clean outlines replaced Rococo softness; heroic sacrifice replaced amorous play; moral clarity replaced decorative excess. The style became the visual language of the French Revolution and Napoleon's empire, and its influence on architecture — from the U.S. Capitol to the British Museum — endures today.",
  },
  {
    id: "romanticism",
    name: "Romanticism",
    period: "1780-1850",
    description:
      "Celebrated emotion, individualism, and the sublime power of nature over rational order.",
    longDescription:
      "Romanticism arose as a passionate counterpoint to Neoclassical reason and Industrial Revolution mechanization. Delacroix filled canvases with violent color and exotic drama; Turner dissolved seascapes into luminous veils of light and atmosphere; Goya channeled personal darkness into unflinching images of war and madness. The Romantics championed individual feeling over collective order, wild nature over cultivated gardens, and the sublime — that thrilling combination of beauty and terror experienced before a storm, a volcano, or an abyss.",
  },
  {
    id: "realism",
    name: "Realism",
    period: "1840-1880",
    description:
      "Depicted ordinary subjects truthfully, rejecting idealized or romanticized portrayals in favor of everyday life.",
    longDescription:
      "Gustave Courbet declared that painting should depict only what the eye can see — no angels, no ancient heroes, no idealized beauty. His monumental canvases of stone breakers, peasant funerals, and his own studio scandalized the Paris Salon, which expected art to elevate and ennoble. Realism insisted on showing working-class life, contemporary social conditions, and the physical world without sentiment or embellishment. The movement opened the door for Impressionism by establishing that modern, everyday subjects were worthy of serious art.",
  },
  {
    id: "impressionism",
    name: "Impressionism",
    period: "1860-1890",
    description:
      "Captured the fleeting effects of light and color with visible brushstrokes, painted en plein air.",
    longDescription:
      "In 1874, a group of rejected painters — Monet, Renoir, Degas, Cassatt, Morisot, and others — staged their own exhibition in Paris. Critics mocked them as 'Impressionists' after Monet's Impression, Sunrise, but the name stuck. Working outdoors with portable paint tubes (a recent invention), they captured how light actually fell on haystacks, water, cathedrals, and crowded boulevards. Visible brushstrokes, broken color, and fleeting moments replaced the smooth finish and timeless subjects of academic painting. Impressionism fundamentally changed what a painting could look like and what it could be about.",
  },
  {
    id: "post-impressionism",
    name: "Post-Impressionism",
    period: "1880-1910",
    description:
      "Extended Impressionism while rejecting its limitations, emphasizing geometric forms, symbolic content, and bold color.",
    longDescription:
      "Post-Impressionism is not a single style but a collection of individual responses to Impressionism's perceived limitations. Cezanne sought to make Impressionism 'solid and durable' by reducing nature to cylinders, spheres, and cones — anticipating Cubism by decades. Van Gogh loaded paint onto canvas in anguished swirls that externalized emotional states. Gauguin flattened space and used symbolic color in pursuit of a more 'primitive' spiritual truth. Seurat applied tiny dots of pure pigment in a scientific system he called Pointillism. Together, these four artists laid the foundations for virtually every major movement of the 20th century.",
  },
  {
    id: "art-nouveau",
    name: "Art Nouveau / Symbolism",
    period: "1890-1910",
    description:
      "Characterized by flowing organic lines, decorative motifs from nature, and symbolic, dream-like imagery.",
    longDescription:
      "Art Nouveau sought to dissolve the boundary between fine and decorative art through sinuous, nature-inspired forms that flowed across paintings, posters, furniture, architecture, and jewelry alike. Gustav Klimt merged Byzantine gold mosaic with sensuous modern figures in Vienna; Alphonse Mucha turned Parisian advertising into high art. The related Symbolist movement, led by painters like Gustave Moreau and Odilon Redon, rejected naturalism entirely in favor of dream visions, mythological subjects, and images drawn from the subconscious — prefiguring Surrealism by thirty years.",
  },
  {
    id: "fauvism",
    name: "Fauvism",
    period: "1905-1910",
    description:
      "Used wild, vibrant, non-naturalistic color and bold brushwork to convey emotional expression.",
    longDescription:
      "At the 1905 Paris Salon d'Automne, a group of painters led by Henri Matisse exhibited canvases so explosively colored that a critic called them 'les fauves' — the wild beasts. Faces were green, trees were red, shadows were blue, and the brushwork was deliberately rough and unfinished. Fauvism was brief but revolutionary: by severing the last link between color and observed reality, Matisse and Andre Derain proved that color could operate as a purely expressive force. Matisse would spend the rest of his long career exploring this insight.",
  },
  {
    id: "cubism",
    name: "Cubism",
    period: "1907-1920s",
    description:
      "Revolutionized representation by fracturing objects into geometric forms and showing multiple perspectives simultaneously.",
    longDescription:
      "In 1907, Picasso painted Les Demoiselles d'Avignon — five fractured figures with African-mask faces that shattered 500 years of Western perspective. Working alongside Georges Braque, Picasso developed Cubism through two phases: Analytic Cubism broke objects into overlapping transparent planes viewed from multiple angles simultaneously, while Synthetic Cubism introduced collage, typography, and flat decorative patterns. The movement's influence extended far beyond painting into sculpture, architecture, graphic design, and literature, making it arguably the most consequential artistic revolution of the 20th century.",
  },
  {
    id: "expressionism",
    name: "Expressionism",
    period: "1905-1930s",
    description:
      "Distorted reality to express emotional experience, using jarring colors and agitated brushwork.",
    longDescription:
      "Expressionism prioritized inner emotional truth over outward appearance. In Germany, groups like Die Brucke and Der Blaue Reiter used harsh colors, crude forms, and agitated brushwork to convey anxiety, alienation, and spiritual searching. Kandinsky pushed furthest, arriving at pure abstraction by 1910 — paintings with no recognizable subject at all, organized instead by color harmony and rhythmic line. Modigliani elongated his portraits into haunting masks; Chagall floated lovers over Russian villages in dreamlike defiance of gravity. Expressionism revealed that distortion could be more truthful than accuracy.",
  },
  {
    id: "surrealism",
    name: "Surrealism",
    period: "1920s-1960s",
    description:
      "Explored the unconscious mind through dream imagery, unexpected juxtapositions, and irrational scenes.",
    longDescription:
      "Founded by Andre Breton in 1924, Surrealism drew on Freudian psychoanalysis to access the unconscious through automatic drawing, dream imagery, and startling juxtapositions. Dali painted melting watches and elephants on spider legs with photographic precision, making the impossible disturbingly real. Magritte used deadpan realism to create philosophical puzzles — a pipe that is not a pipe, a man whose face is an apple. Kahlo turned self-portraiture into unflinching explorations of pain, identity, and Mexican mythology. Surrealism proved that the most compelling images often come from the irrational spaces between sleep and waking.",
  },
  {
    id: "abstract-expressionism",
    name: "Abstract Expressionism",
    period: "1940s-1960s",
    description:
      "Emphasized spontaneous, gestural painting and large-scale canvases to express raw emotion and the subconscious.",
    longDescription:
      "After World War II, the center of the art world shifted from Paris to New York, where a group of American painters created the first major art movement of exclusively American origin. Pollock dripped and poured paint across enormous canvases laid on the floor, making the physical act of painting the subject itself. Rothko stacked luminous rectangles of color that vibrated at their edges, inducing meditative states in viewers. De Kooning attacked the canvas with violent gestural strokes. Abstract Expressionism insisted that painting could communicate profound emotion without depicting anything at all.",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    period: "1950s-1970s",
    description:
      "Drew from popular culture, mass media, and consumerism, blurring boundaries between 'high' and 'low' art.",
    longDescription:
      "Pop Art emerged in the late 1950s as a cool, ironic counterpoint to Abstract Expressionism's emotional intensity. Andy Warhol silk-screened Campbell's soup cans and Marilyn Monroe portraits, collapsing the distinction between commercial illustration and fine art. Roy Lichtenstein enlarged comic book panels into monumental paintings. Claes Oldenburg sculpted giant hamburgers and clothespins. By appropriating the imagery of advertising, consumer products, and celebrity culture, Pop artists held a mirror up to postwar America's mass-media landscape — celebrating it, critiquing it, or both at once.",
  },
  {
    id: "american-modernism",
    name: "American Modernism",
    period: "1910s-1950s",
    description:
      "American artists developed distinctive modern styles drawing on the American landscape and urban experience.",
    longDescription:
      "While European modernism fractured form and embraced abstraction, American Modernists forged their own path rooted in the American experience. Georgia O'Keeffe magnified flowers into monumental abstractions and distilled the New Mexico desert into stark, luminous compositions. Edward Hopper painted diners, gas stations, and hotel rooms suffused with urban loneliness and cinematic light. The Precisionists celebrated industrial architecture with geometric clarity. Together, these artists proved that modernism need not be imported — it could grow from American soil, light, and solitude.",
  },
];

export const ARTISTS: Artist[] = [
  // 15th Century — Early Renaissance
  {
    id: "botticelli",
    name: "Sandro Botticelli",
    movement: "early-renaissance",
    century: "15th",
    birthYear: 1445,
    deathYear: 1510,
    nationality: "Italian",
    bio: "Florentine master known for graceful, linear compositions and mythological subjects.",
    searchTerms: ["Sandro Botticelli"],
    displayNames: ["Sandro Botticelli", "Alessandro Filipepi, called Sandro Botticelli"],
  },
  {
    id: "van-eyck",
    name: "Jan van Eyck",
    movement: "northern-renaissance",
    century: "15th",
    birthYear: 1390,
    deathYear: 1441,
    nationality: "Flemish",
    bio: "Pioneer of oil painting technique, renowned for astonishing detail and luminous color.",
    searchTerms: ["Jan van Eyck"],
    displayNames: ["Jan van Eyck"],
  },
  {
    id: "bellini",
    name: "Giovanni Bellini",
    movement: "early-renaissance",
    century: "15th",
    birthYear: 1430,
    deathYear: 1516,
    nationality: "Italian",
    bio: "Venetian master who transformed the city's painting tradition with luminous color and atmospheric landscapes.",
    searchTerms: ["Giovanni Bellini"],
    displayNames: ["Giovanni Bellini"],
  },
  {
    id: "fra-angelico",
    name: "Fra Angelico",
    movement: "early-renaissance",
    century: "15th",
    birthYear: 1395,
    deathYear: 1455,
    nationality: "Italian",
    bio: "Dominican friar whose devotional paintings combine medieval spirituality with Renaissance naturalism.",
    searchTerms: ["Fra Angelico"],
    displayNames: ["Fra Angelico", "Guido di Pietro, called Fra Angelico"],
  },

  // 16th Century — High Renaissance / Mannerism
  {
    id: "da-vinci",
    name: "Leonardo da Vinci",
    movement: "high-renaissance",
    century: "16th",
    birthYear: 1452,
    deathYear: 1519,
    nationality: "Italian",
    bio: "The quintessential Renaissance genius — painter, inventor, scientist, and anatomist.",
    searchTerms: ["Leonardo da Vinci"],
    displayNames: ["Leonardo da Vinci"],
  },
  {
    id: "michelangelo",
    name: "Michelangelo",
    movement: "high-renaissance",
    century: "16th",
    birthYear: 1475,
    deathYear: 1564,
    nationality: "Italian",
    bio: "Supreme sculptor, painter of the Sistine Chapel ceiling, and architect of St. Peter's dome.",
    searchTerms: ["Michelangelo Buonarroti"],
    displayNames: ["Michelangelo Buonarroti", "Michelangelo"],
  },
  {
    id: "raphael",
    name: "Raphael",
    movement: "high-renaissance",
    century: "16th",
    birthYear: 1483,
    deathYear: 1520,
    nationality: "Italian",
    bio: "Master of graceful composition and serene beauty, his Madonnas define High Renaissance ideals.",
    searchTerms: ["Raffaello Sanzio Raphael"],
    displayNames: ["Raffaello Sanzio, called Raphael", "Raphael"],
  },
  {
    id: "titian",
    name: "Titian",
    movement: "high-renaissance",
    century: "16th",
    birthYear: 1488,
    deathYear: 1576,
    nationality: "Italian",
    bio: "The greatest Venetian colorist, whose bold brushwork influenced centuries of painting.",
    searchTerms: ["Tiziano Vecellio Titian"],
    displayNames: ["Titian", "Tiziano Vecellio, called Titian", "Tiziano Vecellio"],
  },
  {
    id: "durer",
    name: "Albrecht Dürer",
    movement: "northern-renaissance",
    century: "16th",
    birthYear: 1471,
    deathYear: 1528,
    nationality: "German",
    bio: "Germany's greatest Renaissance artist, master of printmaking, painting, and theoretical writing.",
    searchTerms: ["Albrecht Dürer", "Albrecht Durer"],
    displayNames: ["Albrecht Dürer", "Albrecht Durer"],
  },
  {
    id: "el-greco",
    name: "El Greco",
    movement: "mannerism",
    century: "16th",
    birthYear: 1541,
    deathYear: 1614,
    nationality: "Greek/Spanish",
    bio: "Visionary painter known for elongated figures, dramatic color, and intensely spiritual subjects.",
    searchTerms: ["El Greco"],
    displayNames: ["El Greco", "Doménikos Theotokópoulos, called El Greco"],
  },
  {
    id: "bruegel",
    name: "Pieter Bruegel the Elder",
    movement: "northern-renaissance",
    century: "16th",
    birthYear: 1525,
    deathYear: 1569,
    nationality: "Flemish",
    bio: "Master of landscape and peasant scenes, capturing the rhythms of rural Flemish life.",
    searchTerms: ["Pieter Bruegel"],
    displayNames: ["Pieter Bruegel, the elder", "Pieter Bruegel the Elder", "Pieter Bruegel"],
  },

  // 17th Century — Baroque / Dutch Golden Age
  {
    id: "caravaggio",
    name: "Caravaggio",
    movement: "baroque",
    century: "17th",
    birthYear: 1571,
    deathYear: 1610,
    nationality: "Italian",
    bio: "Revolutionary painter whose dramatic chiaroscuro and unflinching realism transformed European art.",
    searchTerms: ["Michelangelo Merisi da Caravaggio"],
    displayNames: ["Caravaggio", "Michelangelo Merisi da Caravaggio", "Michelangelo Merisi, called Caravaggio"],
  },
  {
    id: "rembrandt",
    name: "Rembrandt van Rijn",
    movement: "dutch-golden-age",
    century: "17th",
    birthYear: 1606,
    deathYear: 1669,
    nationality: "Dutch",
    bio: "The greatest Dutch master, unmatched in his ability to capture the inner life of his subjects.",
    searchTerms: ["Rembrandt van Rijn"],
    displayNames: ["Rembrandt van Rijn", "Rembrandt Harmensz. van Rijn"],
  },
  {
    id: "vermeer",
    name: "Johannes Vermeer",
    movement: "dutch-golden-age",
    century: "17th",
    birthYear: 1632,
    deathYear: 1675,
    nationality: "Dutch",
    bio: "Master of quiet, light-filled domestic interiors, painting with jewel-like precision.",
    searchTerms: ["Johannes Vermeer"],
    displayNames: ["Johannes Vermeer", "Jan Vermeer"],
  },
  {
    id: "rubens",
    name: "Peter Paul Rubens",
    movement: "baroque",
    century: "17th",
    birthYear: 1577,
    deathYear: 1640,
    nationality: "Flemish",
    bio: "The most influential Baroque painter, known for energetic compositions and sensuous color.",
    searchTerms: ["Peter Paul Rubens"],
    displayNames: ["Peter Paul Rubens"],
  },
  {
    id: "velazquez",
    name: "Diego Velázquez",
    movement: "baroque",
    century: "17th",
    birthYear: 1599,
    deathYear: 1660,
    nationality: "Spanish",
    bio: "Court painter to Philip IV, whose naturalistic technique influenced Manet and the Impressionists.",
    searchTerms: ["Diego Velázquez", "Velazquez"],
    displayNames: ["Diego Velázquez", "Diego Velazquez", "Diego Rodriguez de Silva y Velázquez"],
  },

  // 18th Century — Rococo / Neoclassicism / Early Romanticism
  {
    id: "fragonard",
    name: "Jean-Honoré Fragonard",
    movement: "rococo",
    century: "18th",
    birthYear: 1732,
    deathYear: 1806,
    nationality: "French",
    bio: "Exuberant Rococo painter of romantic and hedonistic scenes with lush, rapid brushwork.",
    searchTerms: ["Jean-Honoré Fragonard"],
    displayNames: ["Jean-Honoré Fragonard", "Jean Honoré Fragonard", "Jean-Honore Fragonard"],
  },
  {
    id: "david",
    name: "Jacques-Louis David",
    movement: "neoclassicism",
    century: "18th",
    birthYear: 1748,
    deathYear: 1825,
    nationality: "French",
    bio: "Leading Neoclassical painter whose austere, heroic compositions embodied Revolutionary ideals.",
    searchTerms: ["Jacques-Louis David"],
    displayNames: ["Jacques-Louis David", "Jacques Louis David"],
  },
  {
    id: "goya",
    name: "Francisco Goya",
    movement: "romanticism",
    century: "18th",
    birthYear: 1746,
    deathYear: 1828,
    nationality: "Spanish",
    bio: "Visionary artist whose unflinching depictions of war and human darkness anticipated modern art.",
    searchTerms: ["Francisco Goya"],
    displayNames: ["Francisco José de Goya y Lucientes", "Francisco de Goya", "Francisco Goya"],
  },
  {
    id: "gainsborough",
    name: "Thomas Gainsborough",
    movement: "rococo",
    century: "18th",
    birthYear: 1727,
    deathYear: 1788,
    nationality: "British",
    bio: "Elegant portraitist and landscape painter whose feathery brushwork rivaled Reynolds.",
    searchTerms: ["Thomas Gainsborough"],
    displayNames: ["Thomas Gainsborough"],
  },

  // 19th Century — Romanticism / Realism / Impressionism / Post-Impressionism
  {
    id: "delacroix",
    name: "Eugène Delacroix",
    movement: "romanticism",
    century: "19th",
    birthYear: 1798,
    deathYear: 1863,
    nationality: "French",
    bio: "Leader of French Romanticism, celebrated for passionate color and dynamic compositions.",
    searchTerms: ["Eugène Delacroix"],
    displayNames: ["Eugène Delacroix", "Eugene Delacroix"],
  },
  {
    id: "turner",
    name: "J.M.W. Turner",
    movement: "romanticism",
    century: "19th",
    birthYear: 1775,
    deathYear: 1851,
    nationality: "British",
    bio: "The painter of light, whose increasingly abstract seascapes and skies anticipated Impressionism.",
    searchTerms: ["Joseph Mallord William Turner"],
    displayNames: ["Joseph Mallord William Turner", "J. M. W. Turner", "J.M.W. Turner"],
  },
  {
    id: "courbet",
    name: "Gustave Courbet",
    movement: "realism",
    century: "19th",
    birthYear: 1819,
    deathYear: 1877,
    nationality: "French",
    bio: "Father of Realism who insisted on painting only what he could see, shocking the academic establishment.",
    searchTerms: ["Gustave Courbet"],
    displayNames: ["Gustave Courbet"],
  },
  {
    id: "manet",
    name: "Édouard Manet",
    movement: "impressionism",
    century: "19th",
    birthYear: 1832,
    deathYear: 1883,
    nationality: "French",
    bio: "Bridge between Realism and Impressionism, whose bold technique scandalized the Paris Salon.",
    searchTerms: ["Édouard Manet"],
    displayNames: ["Édouard Manet", "Edouard Manet"],
  },
  {
    id: "monet",
    name: "Claude Monet",
    movement: "impressionism",
    century: "19th",
    birthYear: 1840,
    deathYear: 1926,
    nationality: "French",
    bio: "The quintessential Impressionist, devoted to capturing the changing effects of light on the landscape.",
    searchTerms: ["Claude Monet"],
    displayNames: ["Claude Monet"],
  },
  {
    id: "renoir",
    name: "Pierre-Auguste Renoir",
    movement: "impressionism",
    century: "19th",
    birthYear: 1841,
    deathYear: 1919,
    nationality: "French",
    bio: "Impressionist master of joyful color, celebrated for his radiant depictions of Parisian leisure.",
    searchTerms: ["Pierre-Auguste Renoir"],
    displayNames: ["Pierre-Auguste Renoir", "Pierre Auguste Renoir"],
  },
  {
    id: "degas",
    name: "Edgar Degas",
    movement: "impressionism",
    century: "19th",
    birthYear: 1834,
    deathYear: 1917,
    nationality: "French",
    bio: "Master draftsman famous for ballet scenes, capturing movement with unconventional compositions.",
    searchTerms: ["Edgar Degas"],
    displayNames: ["Edgar Degas", "Hilaire Germain Edgar Degas"],
  },
  {
    id: "cassatt",
    name: "Mary Cassatt",
    movement: "impressionism",
    century: "19th",
    birthYear: 1844,
    deathYear: 1926,
    nationality: "American",
    bio: "The only American to exhibit with the French Impressionists, known for tender mother-and-child scenes.",
    searchTerms: ["Mary Cassatt"],
    displayNames: ["Mary Cassatt"],
  },
  {
    id: "cezanne",
    name: "Paul Cézanne",
    movement: "post-impressionism",
    century: "19th",
    birthYear: 1839,
    deathYear: 1906,
    nationality: "French",
    bio: "The father of modern art, whose structural approach to color and form paved the way for Cubism.",
    searchTerms: ["Paul Cézanne"],
    displayNames: ["Paul Cézanne", "Paul Cezanne"],
  },
  {
    id: "van-gogh",
    name: "Vincent van Gogh",
    movement: "post-impressionism",
    century: "19th",
    birthYear: 1853,
    deathYear: 1890,
    nationality: "Dutch",
    bio: "Tormented genius whose swirling, emotionally charged paintings became icons of Western art.",
    searchTerms: ["Vincent van Gogh"],
    displayNames: ["Vincent van Gogh"],
  },
  {
    id: "gauguin",
    name: "Paul Gauguin",
    movement: "post-impressionism",
    century: "19th",
    birthYear: 1848,
    deathYear: 1903,
    nationality: "French",
    bio: "Abandoned European civilization for Tahiti, developing a bold, flat, symbolic style.",
    searchTerms: ["Paul Gauguin"],
    displayNames: ["Paul Gauguin"],
  },
  {
    id: "seurat",
    name: "Georges Seurat",
    movement: "post-impressionism",
    century: "19th",
    birthYear: 1859,
    deathYear: 1891,
    nationality: "French",
    bio: "Inventor of Pointillism, applying scientific color theory through tiny dots of pure pigment.",
    searchTerms: ["Georges Seurat"],
    displayNames: ["Georges Seurat", "Georges-Pierre Seurat"],
  },
  {
    id: "klimt",
    name: "Gustav Klimt",
    movement: "art-nouveau",
    century: "19th",
    birthYear: 1862,
    deathYear: 1918,
    nationality: "Austrian",
    bio: "Vienna's golden painter, fusing decorative pattern, symbolism, and eroticism.",
    searchTerms: ["Gustav Klimt"],
    displayNames: ["Gustav Klimt"],
  },
  {
    id: "homer",
    name: "Winslow Homer",
    movement: "realism",
    century: "19th",
    birthYear: 1836,
    deathYear: 1910,
    nationality: "American",
    bio: "America's greatest painter of the sea, capturing the raw power of nature with masterful watercolors.",
    searchTerms: ["Winslow Homer"],
    displayNames: ["Winslow Homer"],
  },

  // 20th Century
  {
    id: "matisse",
    name: "Henri Matisse",
    movement: "fauvism",
    century: "20th",
    birthYear: 1869,
    deathYear: 1954,
    nationality: "French",
    bio: "Leader of the Fauves, who liberated color from representation to express pure emotion.",
    searchTerms: ["Henri Matisse"],
    displayNames: ["Henri Matisse"],
  },
  {
    id: "picasso",
    name: "Pablo Picasso",
    movement: "cubism",
    century: "20th",
    birthYear: 1881,
    deathYear: 1973,
    nationality: "Spanish",
    bio: "The most influential artist of the 20th century, co-founder of Cubism and relentless innovator.",
    searchTerms: ["Pablo Picasso"],
    displayNames: ["Pablo Picasso"],
  },
  {
    id: "kandinsky",
    name: "Wassily Kandinsky",
    movement: "expressionism",
    century: "20th",
    birthYear: 1866,
    deathYear: 1944,
    nationality: "Russian",
    bio: "Pioneer of pure abstraction who believed color and form could express spiritual truths like music.",
    searchTerms: ["Wassily Kandinsky"],
    displayNames: ["Wassily Kandinsky", "Vasily Kandinsky"],
  },
  {
    id: "mondrian",
    name: "Piet Mondrian",
    movement: "expressionism",
    century: "20th",
    birthYear: 1872,
    deathYear: 1944,
    nationality: "Dutch",
    bio: "Distilled painting to its essence — primary colors, black lines, and white space.",
    searchTerms: ["Piet Mondrian"],
    displayNames: ["Piet Mondrian"],
  },
  {
    id: "modigliani",
    name: "Amedeo Modigliani",
    movement: "expressionism",
    century: "20th",
    birthYear: 1884,
    deathYear: 1920,
    nationality: "Italian",
    bio: "Created an instantly recognizable style of elongated faces and figures with melancholic beauty.",
    searchTerms: ["Amedeo Modigliani"],
    displayNames: ["Amedeo Modigliani"],
  },
  {
    id: "chagall",
    name: "Marc Chagall",
    movement: "expressionism",
    century: "20th",
    birthYear: 1887,
    deathYear: 1985,
    nationality: "Russian/French",
    bio: "Poetic painter of floating lovers, fiddlers, and dreamlike villages drawn from his Jewish heritage.",
    searchTerms: ["Marc Chagall"],
    displayNames: ["Marc Chagall"],
  },
  {
    id: "dali",
    name: "Salvador Dalí",
    movement: "surrealism",
    century: "20th",
    birthYear: 1904,
    deathYear: 1989,
    nationality: "Spanish",
    bio: "Flamboyant Surrealist whose hyper-realistic technique rendered impossible dream worlds.",
    searchTerms: ["Salvador Dalí"],
    displayNames: ["Salvador Dalí", "Salvador Dali"],
  },
  {
    id: "magritte",
    name: "René Magritte",
    movement: "surrealism",
    century: "20th",
    birthYear: 1898,
    deathYear: 1967,
    nationality: "Belgian",
    bio: "Philosophical Surrealist who challenged perception with witty, thought-provoking images.",
    searchTerms: ["René Magritte"],
    displayNames: ["René Magritte", "Rene Magritte"],
  },
  {
    id: "kahlo",
    name: "Frida Kahlo",
    movement: "surrealism",
    century: "20th",
    birthYear: 1907,
    deathYear: 1954,
    nationality: "Mexican",
    bio: "Turned personal suffering into powerful, symbolic self-portraits blending Mexican folk art and Surrealism.",
    searchTerms: ["Frida Kahlo"],
    displayNames: ["Frida Kahlo"],
  },
  {
    id: "okeeffe",
    name: "Georgia O'Keeffe",
    movement: "american-modernism",
    century: "20th",
    birthYear: 1887,
    deathYear: 1986,
    nationality: "American",
    bio: "Mother of American Modernism, known for monumental flower paintings and stark desert landscapes.",
    searchTerms: ["Georgia O'Keeffe"],
    displayNames: ["Georgia O'Keeffe", "Georgia O Keeffe"],
  },
  {
    id: "hopper",
    name: "Edward Hopper",
    movement: "realism",
    century: "20th",
    birthYear: 1882,
    deathYear: 1967,
    nationality: "American",
    bio: "Painter of American solitude, whose cinematic scenes of urban isolation define modern loneliness.",
    searchTerms: ["Edward Hopper"],
    displayNames: ["Edward Hopper"],
  },
  {
    id: "pollock",
    name: "Jackson Pollock",
    movement: "abstract-expressionism",
    century: "20th",
    birthYear: 1912,
    deathYear: 1956,
    nationality: "American",
    bio: "The drip painter who made the act of painting itself the subject, launching Abstract Expressionism.",
    searchTerms: ["Jackson Pollock"],
    displayNames: ["Jackson Pollock"],
  },
  {
    id: "rothko",
    name: "Mark Rothko",
    movement: "abstract-expressionism",
    century: "20th",
    birthYear: 1903,
    deathYear: 1970,
    nationality: "American",
    bio: "Created transcendent fields of luminous color meant to evoke deep emotional and spiritual responses.",
    searchTerms: ["Mark Rothko"],
    displayNames: ["Mark Rothko"],
  },
  {
    id: "warhol",
    name: "Andy Warhol",
    movement: "pop-art",
    century: "20th",
    birthYear: 1928,
    deathYear: 1987,
    nationality: "American",
    bio: "Pop Art icon who turned commercial imagery and celebrity culture into fine art.",
    searchTerms: ["Andy Warhol"],
    displayNames: ["Andy Warhol"],
  },
];

export function getArtistById(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id === id);
}

export function getMovementById(id: string): Movement | undefined {
  return MOVEMENTS.find((m) => m.id === id);
}

export function getMovementForArtist(artist: Artist): Movement | undefined {
  return MOVEMENTS.find((m) => m.id === artist.movement);
}

export function getArtistsByMovement(movementId: string): Artist[] {
  return ARTISTS.filter((a) => a.movement === movementId);
}

export function getArtistsByCentury(century: string): Artist[] {
  return ARTISTS.filter((a) => a.century === century);
}

export const CENTURIES = [
  "15th",
  "16th",
  "17th",
  "18th",
  "19th",
  "20th",
] as const;
