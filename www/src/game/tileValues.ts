/**
 * Tile value constants for micropolisJS.
 * These constants represent different tile types in the game,
 * including terrain, zones, buildings, infrastructure, and animations.
 * Tile values are numeric IDs used internally to identify tile types.
 */

export const DIRT           = 0; // Clear tile (empty ground)
// tile 1 is unused or undefined

/* Water Tiles */
// Various types of water tiles representing rivers, river edges, and channels.
export const RIVER          = 2;
export const REDGE          = 3;
export const CHANNEL        = 4;
export const FIRSTRIVEDGE   = 5;
// Tiles 6 through 19 are likely additional river edge variations (not explicitly named here)
export const LASTRIVEDGE    = 20;
export const WATER_LOW      = RIVER;          // First water tile in range
export const WATER_HIGH     = LASTRIVEDGE;    // Last water tile in range (inclusive)

/* Forest / Tree Tiles */
export const TREEBASE       = 21;
export const WOODS_LOW      = TREEBASE;
export const LASTTREE       = 36;
export const WOODS          = 37;
export const UNUSED_TRASH1  = 38;  // Possibly unused or placeholder tile
export const UNUSED_TRASH2  = 39;  // Same as above, yet counted in WOODS_HIGH
export const WOODS_HIGH     = UNUSED_TRASH2;  // Highest tree tile value (including unused)
export const WOODS2         = 40;
export const WOODS3         = 41;
export const WOODS4         = 42;
export const WOODS5         = 43;

/* Rubble Tiles (damaged or destroyed terrain) */
export const RUBBLE         = 44;  // First rubble tile
export const LASTRUBBLE     = 47;  // Last rubble tile in this small range

/* Flood Water Tiles */
export const FLOOD          = 48;
export const LASTFLOOD      = 51;

/* Special Tiles */
export const RADTILE        = 52;  // Radioactive contaminated tile

export const UNUSED_TRASH3  = 53;
export const UNUSED_TRASH4  = 54;
export const UNUSED_TRASH5  = 55;

/* Fire Animation Tiles (8 tiles for fire animation frames) */
export const FIRE           = 56;
export const FIREBASE       = FIRE;
export const LASTFIRE       = 63;

/* Roads and Bridges */
export const HBRIDGE        = 64;  // Horizontal bridge (start of road tiles)
export const ROADBASE       = HBRIDGE;
export const VBRIDGE        = 65;  // Vertical bridge
export const ROADS          = 66;  // Various road tile variations follow...
export const ROADS2         = 67;
export const ROADS3         = 68;
export const ROADS4         = 69;
export const ROADS5         = 70;
export const ROADS6         = 71;
export const ROADS7         = 72;
export const ROADS8         = 73;
export const ROADS9         = 74;
export const ROADS10        = 75;
export const INTERSECTION   = 76;  // Road intersection tile
export const HROADPOWER     = 77;  // Horizontal road with power line
export const VROADPOWER     = 78;  // Vertical road with power line
export const BRWH           = 79;  // Bridge white (placeholder or special tile)
export const LTRFBASE       = 80;  // First tile with low traffic road
// Tiles 81 to 94: unspecified low traffic tiles
export const BRWV           = 95;  // Possibly bridge variation vertical?
// Tiles 96 to 110: unspecified variations
export const BRWXXX1        = 111;  // Bridge-related tiles (unknown naming)
export const BRWXXX2        = 127;
export const BRWXXX3        = 143;
export const HTRFBASE       = 144;  // First tile with high traffic road
// Tiles 145 to 158: unknown
export const BRWXXX4        = 159;
 // Tiles 160 to 174: unknown
export const BRWXXX5        = 175;
 // Tiles 176 to 190: unknown
export const BRWXXX6        = 191;
 // Tiles 192 to 205: unknown
export const LASTROAD       = 206;  // Last road tile ID
export const BRWXXX7        = 207;  // Another bridge variation?

/* Power Lines */
export const HPOWER         = 208;  // Horizontal power line
export const VPOWER         = 209;  // Vertical power line
export const LHPOWER        = 210;  // Left horizontal power line
export const LVPOWER        = 211;  // Left vertical power line
export const LVPOWER2       = 212;  // Variations of vertical power lines (LVPOWER3... LVPOWER10 follow)
export const LVPOWER3       = 213;
export const LVPOWER4       = 214;
export const LVPOWER5       = 215;
export const LVPOWER6       = 216;
export const LVPOWER7       = 217;
export const LVPOWER8       = 218;
export const LVPOWER9       = 219;
export const LVPOWER10      = 220;
export const RAILHPOWERV    = 221;  // Horizontal rail with vertical power
export const RAILVPOWERH    = 222;  // Vertical rail with horizontal power
export const POWERBASE      = HPOWER;  // Base power tile
export const LASTPOWER      = RAILVPOWERH;

export const UNUSED_TRASH6  = 223;  // Placeholder or unused tile

/* Rail Tiles */
export const HRAIL          = 224;  // Horizontal rail start
export const VRAIL          = 225;  // Vertical rail
export const LHRAIL         = 226;  // Left horizontal rail?
export const LVRAIL         = 227;  // Left vertical rail?
export const LVRAIL2        = 228;  // Variants continue
export const LVRAIL3        = 229;
export const LVRAIL4        = 230;
export const LVRAIL5        = 231;
export const LVRAIL6        = 232;
export const LVRAIL7        = 233;
export const LVRAIL8        = 234;
export const LVRAIL9        = 235;
export const LVRAIL10       = 236;
export const HRAILROAD      = 237;  // Railroad tiles
export const VRAILROAD      = 238;
export const RAILBASE       = HRAIL;
export const LASTRAIL       = 238;

export const ROADVPOWERH    = 239; // Possibly a placeholder or incorrect tile

/* Residential Zone Tiles */
export const RESBASE        = 240;  // Empty residential tiles start here (240-248)
export const FREEZ          = 244;  // Center tile of a 3x3 empty residential zone

export const HOUSE          = 249;  // Single tile houses start
export const LHTHR          = HOUSE;
export const HHTHR          = 260;

export const RZB            = 265;  // Center tile of first 3x3 residential zone

/* Hospital Tiles */
export const HOSPITALBASE   = 405;  // Hospital center tiles range (405-413)
export const HOSPITAL       = 409;  // Center tile for hospital

/* Church Tiles */
export const CHURCHBASE     = 414;  // Church center tiles range (414-422)
export const CHURCH0BASE    = 414;  // Alias for numbered churches
export const CHURCH         = 418;  // Center tile for church
export const CHURCH0        = 418;  // Alias

/* Commercial Zone Tiles */
export const COMBASE        = 423;  // Empty commercial tiles (423-431)
// Tiles 424-426 unknown
export const COMCLR         = 427;  // Commercial clear tile
// Tiles 428-435 unknown
export const CZB            = 436;  // Center tile commercial zone block
// Tiles 437-608 unknown
export const COMLAST        = 609;  // Last commercial tile
// Tiles 610, 611 unknown

/* Industrial Zone Tiles */
export const INDBASE        = 612;  // Top-left tile of empty industrial zone
export const INDCLR         = 616;  // Center tile of empty industrial zone
export const LASTIND        = 620;  // Last tile of empty industrial zone

/* Industrial zone with population levels and values */
export const IND1           = 621;  // First non-empty industry zone, top-left tile
export const IZB            = 625;  // Center tile first non-empty industry zone
// More industrial tiles with population and value variations follow...

export const IND2           = 641;
export const IND3           = 644;
export const IND4           = 649;
export const IND5           = 650;
export const IND6           = 676;
export const IND7           = 677;
export const IND8           = 686;
export const IND9           = 689;

/* Seaport Tiles */
export const PORTBASE       = 693;  // Top-left tile of seaport
export const PORT           = 698;  // Center tile seaport
export const LASTPORT       = 708;  // Last seaport tile

/* Airport Tiles */
export const AIRPORTBASE    = 709;
export const RADAR          = 711;
export const AIRPORT        = 716;
// Tiles 710, 712-715 unspecified

/* Coal Power Plant (4x4) */
export const COALBASE       = 745;  // First coal power plant tile
export const POWERPLANT     = 750;  // Center tile coal power plant
export const LASTPOWERPLANT = 760;  // Last coal power plant tile

/* Fire Station (3x3) */
export const FIRESTBASE     = 761;  // First fire station tile
export const FIRESTATION    = 765;  // Center tile fire station
// Tiles 769 last fire station tile

/* Police Station Tiles */
export const POLICESTBASE   = 770;
// Tiles 771-773 unknown
export const POLICESTATION  = 774;
// Tiles 775-778 unknown

/* Stadium Tiles (4x4) */
export const STADIUMBASE    = 779;  // First stadium tile
export const STADIUM        = 784;  // Center tile stadium
// Tiles 785-799 unknown
export const FULLSTADIUM    = 800;
// Tiles 801-810 unknown

/* Nuclear Power Plant (4x4) */
export const NUCLEARBASE    = 811;  // First nuclear plant tile
export const NUCLEAR        = 816;  // Center tile nuclear plant
export const LASTZONE       = 826;  // Last nuclear tile

/* Miscellaneous Tiles */
export const LIGHTNINGBOLT  = 827;
export const HBRDG0         = 828;
export const HBRDG1         = 829;
export const HBRDG2         = 830;
export const HBRDG3         = 831;
export const HBRDG_END      = 832;
export const RADAR0         = 832;
export const RADAR1         = 833;
export const RADAR2         = 834;
export const RADAR3         = 835;
export const RADAR4         = 836;
export const RADAR5         = 837;
export const RADAR6         = 838;
export const RADAR7         = 839;
export const FOUNTAIN       = 840;
// Tiles 841-843: fountain animation tiles
export const INDBASE2       = 844;
export const TELEBASE       = 844;  // Alias for INDBASE2
// Tiles 845-850 unknown
export const TELELAST       = 851;
export const SMOKEBASE      = 852;
// Tiles 853-859 unknown
export const TINYEXP        = 860;
// Tiles 861-863 unknown
export const SOMETINYEXP    = 864;
// Tiles 865-866 unknown
export const LASTTINYEXP    = 867;
// Tiles 868-882 unknown
export const TINYEXPLAST    = 883;
// Tiles 884-915 unknown

/* Coal Power Plant Chimney Smoke Animations */
export const COALSMOKE1     = 916; // Chimney animation at coal power plant (2, 0)
export const COALSMOKE2     = 920; // Chimney animation at coal power plant (3, 0)
export const COALSMOKE3     = 924; // Chimney animation at coal power plant (2, 1)
export const COALSMOKE4     = 928; // Chimney animation at coal power plant (3, 1)
// Animation tiles run through +3 for each

/* Football Game Tiles */
export const FOOTBALLGAME1  = 932;
// Tiles 933-939 unknown
export const FOOTBALLGAME2  = 940;
// Tiles 941-947 unknown

export const VBRDG0         = 948;
export const VBRDG1         = 949;
export const VBRDG2         = 950;
export const VBRDG3         = 951;

/* Nuclear Explosion Swirls */
export const NUKESWIRL1     = 952;
export const NUKESWIRL2     = 953;
export const NUKESWIRL3     = 954;
export const NUKESWIRL4     = 955;

/* Tiles 956-959 unused originally */

// Extended Zone Church Tiles (956-1019)
export const CHURCH1BASE    = 956;
export const CHURCH1        = 960;
export const CHURCH2BASE    = 965;
export const CHURCH2        = 969;
export const CHURCH3BASE    = 974;
export const CHURCH3        = 978;
export const CHURCH4BASE    = 983;
export const CHURCH4        = 987;
export const CHURCH5BASE    = 992;
export const CHURCH5        = 996;
export const CHURCH6BASE    = 1001;
export const CHURCH6        = 1005;
export const CHURCH7BASE    = 1010;
export const CHURCH7        = 1014;
export const CHURCH7LAST    = 1018;

// Tiles 1020-1023 unused

/** Total number of tiles */
export const TILE_COUNT     = 1024;

/** Constant for invalid tile (not used in world map) */
export const TILE_INVALID   = -1;
