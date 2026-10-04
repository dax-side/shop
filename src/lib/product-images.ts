// Product photography, served from public/images. Photos from Unsplash; credits in the README.

export type ProductImage = { src: string; alt: string };

// Each product has as many photos as it has alt texts. The first four use these file names
// (front.webp, side.webp…); any more are photo-5.webp, photo-6.webp and so on.
const VIEWS = ["front", "side", "detail", "in-use"];
const VIEW_LABELS = ["front", "side", "detail", "in use"];

const fileName = (index: number) => VIEWS[index] ?? `photo-${index + 1}`;
export const viewLabel = (index: number) => VIEW_LABELS[index] ?? `photo ${index + 1}`;

const PRODUCTS: Record<string, { number: string; alts: string[] }> = {
  "wooden-spoon-set": {
    number: "023",
    alts: [
      "Carved wooden spoons and a wooden cup",
      "Two wooden spoons on a grey surface",
      "Wooden spoons and spatulas laid out on a table",
      "Wooden spoons standing in a utensil jar",
    ],
  },
  "wooden-mortar-and-pestle": {
    number: "029",
    alts: [
      "Wooden mortar and pestle on a grey background",
      "Polished wooden mortar with a dark pestle",
      "Wooden pestle resting in a bowl of salt",
      "Pounding pepper and herbs in a mortar",
    ],
  },
  "calabash-bowl": {
    number: "015",
    alts: [
      "Stacked round gourd bowls",
      "Polished calabash cups",
      "Close-up of a carved gourd surface",
      "Decorated gourds in a bowl",
    ],
  },
  "glass-tumblers-set-of-4": {
    number: "019",
    alts: [
      "Glass tumblers of water on a sunlit table",
      "Ribbed drinking glasses casting shadows",
      "Clear tumblers stacked in a pyramid",
      "Glass tumblers beside a water carafe",
    ],
  },
  "cotton-bath-towel": {
    number: "005",
    alts: [
      "Folded cotton bath towels on a wooden stool",
      "Towels hanging on hooks in a bathroom",
      "Rolled grey cotton towel",
      "Stack of soft white towels",
    ],
  },
  "black-soap-bar": {
    number: "003",
    alts: [
      "Bar of dark handmade soap held in a hand",
      "Stack of black and white handmade soap bars",
      "Handmade soap bars on linen",
      "Hands holding a bar of handmade soap",
    ],
  },
  "natural-hand-broom": {
    number: "042",
    alts: [
      "Natural fibre broom hanging by a wooden screen",
      "Short hand broom on a dark wooden floor",
      "Close-up of natural broom fibres",
      "Fibre brooms bound with coloured cord",
    ],
  },
  "bristle-dish-brush": {
    number: "044",
    alts: [
      "Wooden dish brushes with natural bristles",
      "Dish brush beside a brass kitchen tap",
      "Close-up of natural bristle brushes",
      "Wooden brushes in a jar by a window",
    ],
  },
  "kraft-envelopes-pack": {
    number: "055",
    alts: [
      "Kraft paper envelopes on a wooden board",
      "Kraft envelope with a blank card",
      "Brown envelopes with old photographs",
      "Envelope and card with a pencil",
    ],
  },
  "wooden-desk-tray": {
    number: "057",
    alts: [
      "Walnut desk tray holding earbuds and a watch",
      "Wooden tray with a wallet, phone and pens",
      "Two empty wooden desk trays",
      "Wooden tray with glasses on a desk",
    ],
  },
  "stoneware-mug": {
    number: "014",
    alts: [
      "Grey stoneware mug on a wooden table",
      "Speckled stoneware cups on a white surface",
      "Dark stoneware cup on a saucer",
      "Glazed stoneware mugs on a kitchen shelf",
    ],
  },
  "iroko-serving-board": {
    number: "022",
    alts: [
      "Dark wooden serving board on a woven rug",
      "Two wooden serving boards with grapes and nuts",
      "Close-up of wooden boards showing the grain",
      "Wooden board standing outdoors among leaves",
    ],
  },
  "enamel-pot-3-litre": {
    number: "031",
    alts: [
      "White enamel pot in a kitchen",
      "Floral enamel pot on a gas stove",
      "Red enamel pot filled with potatoes",
      "White enamel pots outdoors on the grass",
    ],
  },
  "linen-tea-towels-pair": {
    number: "008",
    alts: [
      "Stack of folded linen tea towels",
      "Linen towel hanging from a kitchen cupboard",
      "Linen cloth with wheat and a cake server",
      "Three apples on a linen tea towel",
    ],
  },
  "brass-wall-hooks-pair": {
    number: "040",
    alts: [
      "Brass hooks fixed under a white shelf",
      "Brass hooks holding a coat",
      "Decorative brass wall hook",
      "Brass hook holding a bag by a door",
    ],
  },
  "clay-water-pot": {
    number: "017",
    alts: [
      "Terracotta water jug on a warm background",
      "Clay amphora on a wooden stand",
      "Close-up of a hand-thrown clay jug",
      "Potter shaping clay on a wheel",
    ],
  },
  "grid-notebook-a5": {
    number: "052",
    alts: [
      "Grid notebook with a pen on a dark desk",
      "Open grid notebook on a wooden table",
      "Spiral notebook with a fountain pen",
      "White spiral notebook with a pen",
    ],
  },
  "woven-bread-basket": {
    number: "026",
    alts: [
      "Woven baskets seen from above",
      "Hands holding a woven basket of bread",
      "Close-up of a woven basket handle",
      "Fresh loaves in a woven basket",
    ],
  },
  "cast-iron-skillet": {
    number: "024",
    alts: [
      "Cast iron skillet with a slotted spatula and a green tea towel",
      "Empty cast iron pan on a wooden board",
      "Sautéed vegetables in a cast iron pan",
      "Flatbread cooking in a cast iron skillet",
    ],
  },
  "glass-storage-jars-set-of-3": {
    number: "033",
    alts: [
      "Clip-top glass jars filled with pasta, grains and spices",
      "Clip-top jars of lentils and grains stacked on a shelf",
      "Glass jars of pasta lined up on a counter",
      "Glass storage jars with wooden lids beside a tea towel",
    ],
  },
  "ceramic-serving-bowl": {
    number: "011",
    alts: [
      "White stoneware serving bowl",
      "Two speckled stoneware bowls stacked",
      "A stack of speckled stoneware bowls",
      "Glazed stoneware bowls seen from above",
    ],
  },
  "linen-napkins-set-of-4": {
    number: "012",
    alts: [
      "Folded linen napkins on a wooden table",
      "Hemstitched edge of a linen napkin",
      "Cutlery laid on a folded linen napkin",
      "Table set with plates and linen napkins",
    ],
  },
  "woven-table-mats-set-of-4": {
    number: "013",
    alts: [
      "Round woven table mat",
      "Close-up of a woven table mat",
      "Wooden spoon and chopsticks on a woven mat",
      "Breakfast plate on a round woven mat",
    ],
  },
  "waffle-hand-towel": {
    number: "006",
    alts: [
      "Cream waffle towel draped over a basket",
      "Close-up of waffle weave cotton",
      "Stack of mustard waffle towels",
      "Waffle hand towel hanging beside a bathroom sink",
    ],
  },
  "woven-laundry-basket": {
    number: "007",
    alts: [
      "Woven seagrass basket with handles",
      "Close-up of a lidded woven basket",
      "Woven basket full of soft towels",
      "Woven basket next to a white chair",
    ],
  },
  "natural-loofah-sponge": {
    number: "004",
    alts: [
      "Natural loofah slices stacked on white",
      "Close-up of loofah fibres",
      "Natural loofah sponges beside a woven basket",
      "Loofah gourds growing on the vine",
    ],
  },
  "galvanised-watering-can": {
    number: "046",
    alts: [
      "Galvanised watering can on garden soil",
      "Metal watering can on rough ground",
      "Three metal watering cans on a workbench",
      "Watering flowers with a galvanised can",
    ],
  },
  "wooden-clothes-pegs": {
    number: "048",
    alts: [
      "Two wooden clothes pegs",
      "A pile of wooden clothes pegs",
      "Wooden pegs laid out in rows",
      "Wooden pegs on a washing line",
    ],
  },
  "graphite-pencils-set-of-6": {
    number: "050",
    alts: [
      "A row of sharpened pencils",
      "Close-up of a sharpened pencil tip",
      "Pencils standing in a wooden holder",
      "Pencil drawing a line on paper",
    ],
  },
  "spiral-sketchbook-a4": {
    number: "053",
    alts: [
      "Spiral sketchbook with pens and pencils",
      "Two spiral sketchbooks stacked",
      "Botanical drawings in a sketchbook",
      "Sketchbook open on a checked cloth",
    ],
  },
  "enamel-kettle": {
    number: "060",
    alts: [
      "Green and black kettle on brown wooden table",
      "A red tea pot sitting on top of a table",
      "A cream enamel kettle with a green rim on a blue portable stove",
      "A red teapot with a black handle on a yellow background",
    ],
  },
  "chef-knife-20cm": {
    number: "061",
    alts: [
      "A couple of knives sitting next to each other on a table",
      "A couple of knives sitting next to each other",
      "Sliced vegetables and meat on chopping board",
      "A knife and potatoes on a cutting board",
    ],
  },
  "wooden-rolling-pin": {
    number: "062",
    alts: [
      "Brown wooden smoking pipe on white and blue textile",
      "White round ornament on brown wooden surface",
      "Brown bread on brown wooden chopping board",
      "Child cutting gingerbread dough with cookie cutters",
    ],
  },
  "ceramic-teapot": {
    number: "063",
    alts: [
      "A white tea pot sitting on top of a table",
      "Black and red ceramic kettle",
      "Brown teapot on gray surface",
      "Brown ceramic teapot on brown wooden table",
    ],
  },
  "glass-water-jug": {
    number: "064",
    alts: [
      "An elegant, diamond-patterned glass pitcher",
      "Clear glass pitcher beside clear drinking glass on table",
      "A glass pitcher and a glass pitcher on a wooden surface",
      "Man pouring water in glass",
    ],
  },
  "steel-colander": {
    number: "065",
    alts: [
      "A white colander filled with grapes on top of a wooden tray",
      "A bowl of asparagus sitting on a counter",
      "Brown round fruits on stainless steel basket",
      "A bowl of food",
    ],
  },
  "box-grater": {
    number: "066",
    alts: [
      "Black and white rectangular box",
      "A metal tin, a small grater, a glass bowl, a ring, and pearls",
      "Close-up of a metal cheese grater surface",
      "A person cutting a piece of bread",
    ],
  },
  "cast-iron-dutch-oven": {
    number: "067",
    alts: [
      "A red pot sitting on top of a table",
      "Black cast iron pot with lid on stovetop",
      "Red and blue plastic containers on brown wooden table",
      "A pot is sitting on top of a stove",
    ],
  },
  "wooden-chopping-board": {
    number: "068",
    alts: [
      "Brown wooden tray on brown wooden table",
      "A knife and a board on a wooden surface",
      "Brown wooden chopping board beside green vegetable",
      "Cheese and ham on chopping board",
    ],
  },
  "ceramic-oil-bottle": {
    number: "069",
    alts: [
      "Gray certamic pot",
      "Three white enamel jars",
      "A group of brown vases sitting on top of a table",
      "A ceramic vase with a brown top on a white surface",
    ],
  },
  "spice-tins-set-of-6": {
    number: "070",
    alts: [
      "Stainless steel round bowl with food",
      "A bowl of food",
      "Various colorful spices arranged in metal bowls on a tray",
      "Assorted spices in clear glass containers",
    ],
  },
  "measuring-cups": {
    number: "071",
    alts: [
      "A group of four metal pots hanging from hooks",
      "Stainless steel cup with coffee",
      "A basket of eggs and a bottle of tea on a table",
      "Measuring cup on white paper",
    ],
  },
  "clay-cooking-pot": {
    number: "072",
    alts: [
      "A pot is cooking over fire",
      "A pile of clay pots sitting next to each other",
      "Woman cooking over a clay stove outdoors",
      "Stacks of charred clay pots with lids on a tiled kitchen shelf",
    ],
  },
  "wooden-spatula-set": {
    number: "073",
    alts: [
      "Brown wooden spoon on white surface",
      "Brown wooden spoons in brown wooden cup",
      "Brown wooden handled fork and knife on brown wooden chopping board",
      "Stainless steel spoon and fork",
    ],
  },
  "enamel-mugs-set-of-2": {
    number: "074",
    alts: [
      "A white cup sitting on top of a wooden table",
      "A white mug with a silver rim sitting next to a bunch of white flowers",
      "White ceramic mug on gray and white textile",
      "Selective focus photography black and white mug",
    ],
  },
  "dinner-plates-set-of-4": {
    number: "075",
    alts: [
      "A white plate with a brown rim on a white surface",
      "White round plate on white table",
      "Assorted-color ceramic plates and saucers",
      "White ceramic round plate lot",
    ],
  },
  "wooden-salad-servers": {
    number: "076",
    alts: [
      "Brown wooden spoons",
      "A couple of wooden sculptures sitting next to each other",
      "Arugula salad with roasted butternut squash and walnuts",
      "A wooden bowl and chopsticks on a window sill",
    ],
  },
  "brass-candle-holder": {
    number: "077",
    alts: [
      "A single white candle sitting on top of a table",
      "Silver candlestick with white candle",
      "Gold and white candle holder",
      "Gold and white candle holder",
    ],
  },
  "linen-tablecloth": {
    number: "078",
    alts: [
      "A close up of a bed with a white sheet",
      "A white plate sitting on top of a white table",
      "A plate of tomatoes on a striped tablecloth",
      "Brown wooden table with brown wicker basket and pitcher",
    ],
  },
  "stoneware-cups-set-of-4": {
    number: "079",
    alts: [
      "White ceramic cup",
      "Rustic ceramic cup with red glaze on a wooden surface",
      "A couple of white bowls sitting on top of a table",
      "Handcrafted ceramic cup with unique brown and cream glaze",
    ],
  },
  "woven-fruit-basket": {
    number: "080",
    alts: [
      "A wicker basket filled with bananas, apples, and oranges",
      "Orange fruits on brown woven basket",
      "Orange fruits on black metal fruit basket",
      "Red apples in brown woven basket",
    ],
  },
  "ceramic-bud-vase": {
    number: "081",
    alts: [
      "A white vase sitting on top of a white table",
      "A couple of vases sitting on top of a table",
      "A couple of vases sitting on top of a table",
      "A white vase sitting on top of a white table",
    ],
  },
  "wooden-serving-tray": {
    number: "082",
    alts: [
      "White ceramic mug on brown wooden serving tray",
      "Two long oval wooden serving trays on a white background",
      "Tea set with teapot and four cups on wooden tray",
      "Chocolate cookies with hazelnuts and a honey pot",
    ],
  },
  "wooden-bowls-set-of-2": {
    number: "083",
    alts: [
      "A group of wooden bowls and plates on a table",
      "Brown and blue ceramic bowl",
      "Many wooden bowls and plates are stacked together",
      "Brown wooden round bowl on white table",
    ],
  },
  "wooden-pepper-mill": {
    number: "084",
    alts: [
      "A wooden pepper mill and pepper grinder on a table",
      "Brown wooden chess piece on blue textile",
      "Brown condiment mixer",
      "A wooden pepper mill and salt mill on a table",
    ],
  },
  "brass-cutlery-set": {
    number: "085",
    alts: [
      "Golden cutlery set on a dark background",
      "Golden cutlery set arranged on a dark background",
      "A group of spoons on a plate",
      "A set of five pink and gold utensils",
    ],
  },
  "coasters-set-of-6": {
    number: "086",
    alts: [
      "A stack of round wooden coasters in a metal holder",
      "Black and white round patch on brown wooden table",
      "Woven coaster on a patterned surface with eye designs",
      "Clear drinking glass on brown wooden table",
    ],
  },
  "glass-carafe": {
    number: "087",
    alts: [
      "A couple of empty glasses",
      "Two clear drinking glasses beside bottle",
      "A bottle of water next to a glass of water",
      "White flower in clear glass vase",
    ],
  },
  "cotton-bathrobe": {
    number: "088",
    alts: [
      "Woman wearing a white bathrobe standing against wooden wall",
      "A woman in a bathrobe talking on a cell phone",
      "A man sitting on a bench",
      "Close-up of a grey fabric belt tied in a knot",
    ],
  },
  "cotton-bath-mat": {
    number: "089",
    alts: [
      "A bathroom rug on the floor in front of a door",
      "A close up view of a white blanket",
      "A bathroom with a sink and a mirror",
      "A clawfoot bathtub filled with bubbles and candles",
    ],
  },
  "wooden-bath-brush": {
    number: "090",
    alts: [
      "White ceramic teapot on white textile",
      "Brown wooden spoon on white textile",
      "A hair brush sitting on top of a white table",
      "White and brown wooden heart shaped decor",
    ],
  },
  "linen-pillowcases-pair": {
    number: "091",
    alts: [
      "White bed pillow on bed",
      "White bed pillow against white wall",
      "A stack of pillows sitting on top of a wooden table",
      "Blue and white throw pillow",
    ],
  },
  "cotton-bed-sheet": {
    number: "092",
    alts: [
      "White bedspread",
      "A bed with a white cover and pillows on top of it",
      "White textile",
      "White textile in close up photography",
    ],
  },
  "woven-throw": {
    number: "093",
    alts: [
      "White and blue knit textile",
      "Man in black shirt reading book on black couch",
      "Person holding black and white textile",
      "A close up of a blanket with a knot on it",
    ],
  },
  "raw-shea-butter": {
    number: "094",
    alts: [
      "A bowl of food that is on a table",
      "A spoon in a bowl with a liquid inside of it",
      "Jar of butter with spoon",
      "Scoop of ice cream",
    ],
  },
  "wooden-comb": {
    number: "095",
    alts: [
      "A couple of wooden combs sitting on top of a white sheet",
      "A collection of wooden combs and combs on a white surface",
      "A couple of wooden combs sitting on top of a blue cloth",
      "Green leaves on brown wooden chopping board",
    ],
  },
  "ceramic-soap-dish": {
    number: "096",
    alts: [
      "A piece of soap sitting on top of a wooden plate",
      "Green and white round plastic container",
      "White square container on white table",
      "White plastic egg tray on white table",
    ],
  },
  "bamboo-toothbrushes-4": {
    number: "097",
    alts: [
      "Brown wooden sticks in gray ceramic bowl",
      "Blue and white toothbrush in clear glass jar",
      "A wooden toothbrush holder with a toothbrush in it",
      "Two toothbrush in mason jar",
    ],
  },
  "cotton-face-cloths-3": {
    number: "098",
    alts: [
      "Folded towels near potted plants",
      "Gray textile in shallow focus shot",
      "A bunch of white towels stacked on top of each other",
      "A couple of cloths that are sitting on a table",
    ],
  },
  "linen-shower-curtain": {
    number: "099",
    alts: [
      "Beige curtain",
      "A close up of a piece of cloth on a table",
      "A white wall with a brown line",
      "White and gray plaid curtain",
    ],
  },
  "glass-soap-dispenser": {
    number: "100",
    alts: [
      "Ribbed glass soap dispenser with gold pump on a windowsill",
      "A bathroom sink with a soap dispenser and a soap dish",
      "A bottle of soap sitting on a bathroom counter",
      "Modern bathroom sink with soap dispenser and towel",
    ],
  },
  "rattan-mirror": {
    number: "101",
    alts: [
      "Brown spiral metal on white concrete floor",
      "A mirror and a lamp on a table",
      "Diagram",
      "Man taking photo in front of round mirror",
    ],
  },
  "claw-hammer": {
    number: "102",
    alts: [
      "Black handle on brown wooden table",
      "Black and silver claw hammer",
      "Black and silver claw hammer",
      "Black and orange handle black handle",
    ],
  },
  "screwdriver-set": {
    number: "103",
    alts: [
      "A group of black and silver pens",
      "A black and silver pen",
      "Bosch screwdriver set with various bits",
      "Silver and gold screw driver",
    ],
  },
  "tape-measure": {
    number: "104",
    alts: [
      "A close up of a tape measure on a white background",
      "Yellow and black measuring tape",
      "A person holding a tape measure in their hand",
      "Gray and yellow measures",
    ],
  },
  "garden-trowel": {
    number: "105",
    alts: [
      "Silver and brown steel hand tool",
      "A couple of metal objects with a metal object on top of them",
      "A hand rake sits in a green garden with plants",
      "Hands in gloves planting small seedlings in dark soil",
    ],
  },
  "pruning-shears": {
    number: "106",
    alts: [
      "Blue and silver pliers on black and gray surface",
      "A person holding a pair of pliers to a plant",
      "A person holding a pair of scissors in front of a plant",
      "A man is trimming a tree with a pair of pliers",
    ],
  },
  "leather-work-gloves": {
    number: "107",
    alts: [
      "A pair of brown leather gloves on a white background",
      "A pair of yellow gloves sitting on top of a table",
      "A pair of gloves sitting on top of a trash can",
      "Person wearing brown leather gloves",
    ],
  },
  "wooden-step-stool": {
    number: "108",
    alts: [
      "White ceramic mug on brown wooden table",
      "A small wooden table sitting on top of a sidewalk",
      "A handcrafted wooden stool with a minimalist design",
      "Green potted plant on brown wooden table",
    ],
  },
  "dustpan-and-brush": {
    number: "109",
    alts: [
      "Dustpan and ladles hanging on a wall",
      "Ornate brass dustpan and brush hanging on white wall",
      "A broom leaning against a pole on a sidewalk",
      "Red dustpan and broom leaning against wall",
    ],
  },
  "galvanised-bucket": {
    number: "110",
    alts: [
      "A metal bucket hanging from a metal hook",
      "Gray steel bucket on brown wooden table",
      "Gray steel bucket on brown wooden bucket",
      "A bunch of buckets filled with lots of flowers",
    ],
  },
  "steel-scissors": {
    number: "111",
    alts: [
      "A pair of scissors sitting on top of a white table",
      "Black handled scissors wallpaper",
      "A pair of scissors sitting on top of a table",
      "Gray steel scissors",
    ],
  },
  "jute-twine": {
    number: "112",
    alts: [
      "Brown rope tied on brown wooden post",
      "A ball of brown twine held in an open palm against a white background",
      "A close up of a bunch of rope",
      "Close-up of light brown, messy, tangled hair strands",
    ],
  },
  "hurricane-lantern": {
    number: "113",
    alts: [
      "An old fashioned lantern hanging on a wall",
      "Black kerosene lamp",
      "Lighted lantern lamp",
      "Turned-on lantern on brown wooden table",
    ],
  },
  "hand-saw": {
    number: "114",
    alts: [
      "Grayscale photo handsaw",
      "Person in white shirt holding brown wooden table",
      "A person cutting a piece of wood with a pair of scissors",
      "A person holding a pair of scissors in their hand",
    ],
  },
  "spirit-level": {
    number: "115",
    alts: [
      "White spirit level on brown table",
      "White and green electronic device",
      "Orange pen beside blue tape dispenser",
      "A construction worker holding a long red spirit level against a wooden wall frame",
    ],
  },
  "brass-padlock": {
    number: "116",
    alts: [
      "Gold padlock on white surface",
      "Brown padlock on brown wooden fence",
      "Gold padlock on white surface",
      "Brown padlock",
    ],
  },
  "fountain-pen": {
    number: "117",
    alts: [
      "Silver click pen on white paper",
      "Gold and black tube on brown surface",
      "Black and gold fountain pen",
      "A black and gold pen rests on an open notebook",
    ],
  },
  "ink-bottle": {
    number: "118",
    alts: [
      "Black and silver pocket knife",
      "White and yellow click pen beside black glass bottle",
      "Black and gray swan table decor",
      "A row of different colored nail polish bottles",
    ],
  },
  "leather-journal": {
    number: "119",
    alts: [
      "A notebook with a pen on top of it",
      "Red leather long wallet on white table",
      "A green notebook sitting on top of a wooden table",
      "A couple of books sitting on top of a wooden table",
    ],
  },
  "brass-desk-lamp": {
    number: "120",
    alts: [
      "Two modern lamps with blue and green shades",
      "A green desk lamp in a library",
      "A white lamp sits on a wooden nightstand",
      "A vintage brass desk lamp illuminates a library",
    ],
  },
  "brass-letter-opener": {
    number: "121",
    alts: [
      "A pen, a book, and a pair of scissors on a table",
      "A dagger with a gold-inlaid blade and an ornate ivory handle on grey",
      "Magnifying glass examines small paper with text",
      "A pen and some papers on a table",
    ],
  },
  "metal-stapler": {
    number: "122",
    alts: [
      "Orange stapler opened",
      "Yellow and gray stapler on white table",
      "A black stapler rests on a desk with papers",
      "White and red metal tool",
    ],
  },
  "brass-paper-clips": {
    number: "123",
    alts: [
      "Yellow paper clip on red textile",
      "Brown paper clips on white surface",
      "A group of scissors",
      "Gray paper clip",
    ],
  },
  "wooden-ruler": {
    number: "124",
    alts: [
      "Brown wooden ruler",
      "Brown wooden frame with white background",
      "Brown wooden triangle ruler",
      "A bunch of tools that are sitting on a table",
    ],
  },
  "brass-pencil-sharpener": {
    number: "125",
    alts: [
      "A close up of a piece of food on a table",
      "Black and gray plastic container",
      "Blue pencil sharpener on white surface",
      "A group of pencils and sharpeners on a table",
    ],
  },
  "ceramic-pen-pot": {
    number: "126",
    alts: [
      "A metal cup filled with assorted pens and pencils",
      "Beige pen holder with colorful pens and stylus on desk",
      "White ceramic mug on brown wooden table",
      "A bamboo pencil holder with pens and markers",
    ],
  },
  "wax-seal-kit": {
    number: "128",
    alts: [
      "Round brown stamp",
      "A white envelope with a wax stamp and a wax seal",
      "White envelope with brown stamp",
      "A wax stamp sitting on top of a piece of paper",
    ],
  },
  "postcards-set-of-10": {
    number: "129",
    alts: [
      "Vintage postcard with \"post card\" and \"canada\" stamp",
      "White and brown house photos",
      "A pile of old envelopes sitting on top of each other",
      "White post card",
    ],
  },
  "desk-calendar": {
    number: "130",
    alts: [
      "A desk calendar sitting on top of a wooden table",
      "A calendar sitting on top of a wooden table",
      "White braille paper on brown wooden table",
      "A calendar with the word jan on it",
    ],
  },
};

export function productImages(slug: string): ProductImage[] {
  const product = PRODUCTS[slug];
  if (!product) return [];
  return product.alts.map((alt, i) => ({ src: `/images/products/${slug}/${fileName(i)}.webp`, alt }));
}

export function productThumb(slug: string): ProductImage | undefined {
  return productImages(slug)[0];
}

// Order lines store the product number rather than the slug.
export function productThumbByNumber(number: string): ProductImage | undefined {
  const slug = Object.keys(PRODUCTS).find((key) => PRODUCTS[key].number === number);
  return slug ? productThumb(slug) : undefined;
}

export const shopShelves: ProductImage = {
  src: "/images/shop-shelves.webp",
  alt: "Wooden shelves lined with ceramic vases and pots",
};

export const roomImages: Record<string, ProductImage> = {
  kitchen: { src: "/images/rooms/kitchen.webp", alt: "Glass jars on a wooden kitchen shelf" },
  table: { src: "/images/rooms/table.webp", alt: "Wooden table set with white plates and flowers" },
  "bath-linen": { src: "/images/rooms/bath-linen.webp", alt: "White linen on a wooden chair" },
  tools: { src: "/images/rooms/tools.webp", alt: "Hand tools hanging on a pale wall" },
  "paper-desk": { src: "/images/rooms/paper-desk.webp", alt: "Pens resting on a brown envelope" },
};

export const makingImages: (ProductImage & { label: string })[] = [
  { label: "Clay", src: "/images/making/clay.webp", alt: "Hands shaping a round clay pot" },
  { label: "Fibre", src: "/images/making/weaving.webp", alt: "Hands weaving a wicker basket in the sun" },
  { label: "Wood", src: "/images/making/wood.webp", alt: "Chisel carving into a piece of wood" },
];

export const storeImage: ProductImage = {
  src: "/images/store.webp",
  alt: "Ceramic bowls and vases on a wooden display table in a sunlit shop",
};
