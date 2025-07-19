# Fi Money Color Palette Reference

## Quick Reference

### Hex Values
```
#4b7672, #02b899, #272a29, #1c1b1c, #fbfdfd
```

### Color Names
- **Myrtle Green**: #4b7672
- **Jungle Green**: #02b899  
- **Jet**: #272a29
- **Eerie Black**: #1c1b1c
- **White**: #fbfdfd

## Complete Color System

### Tailwind Configuration
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'myrtle_green': {
          DEFAULT: '#4b7672',
          100: '#0f1817', 200: '#1e2f2e', 300: '#2d4744',
          400: '#3c5f5b', 500: '#4b7672', 600: '#659c97',
          700: '#8bb5b1', 800: '#b2cecb', 900: '#d8e6e5'
        },
        'jungle_green': {
          DEFAULT: '#02b899',
          100: '#00241e', 200: '#01493d', 300: '#016d5b',
          400: '#019179', 500: '#02b899', 600: '#02f6ce',
          700: '#3dfddd', 800: '#7efee8', 900: '#befef4'
        },
        'jet': {
          DEFAULT: '#272a29',
          100: '#080808', 200: '#101111', 300: '#181919',
          400: '#1f2221', 500: '#272a29', 600: '#505755',
          700: '#798480', 800: '#a6adaa', 900: '#d2d6d5'
        },
        'eerie_black': {
          DEFAULT: '#1c1b1c',
          100: '#060506', 200: '#0b0b0b', 300: '#111011',
          400: '#171617', 500: '#1c1b1c', 600: '#4b484b',
          700: '#797479', 800: '#a6a2a6', 900: '#d3d1d3'
        },
        'white': {
          DEFAULT: '#fbfdfd',
          100: '#224343', 200: '#448686', 300: '#75baba',
          400: '#b8dbdb', 500: '#fbfdfd', 600: '#fcfefe',
          700: '#fdfefe', 800: '#fefefe', 900: '#feffff'
        }
      }
    }
  }
}
```

### React Native StyleSheet
```javascript
export const FiColors = {
  // Primary Palette
  myrtleGreen: '#4b7672',
  jungleGreen: '#02b899',
  jet: '#272a29',
  eerieBlack: '#1c1b1c',
  white: '#fbfdfd',
  
  // Extended Scales
  myrtleGreen100: '#0f1817',
  myrtleGreen200: '#1e2f2e',
  myrtleGreen300: '#2d4744',
  myrtleGreen600: '#659c97',
  myrtleGreen700: '#8bb5b1',
  myrtleGreen900: '#d8e6e5',
  
  jungleGreen300: '#016d5b',
  jungleGreen600: '#02f6ce',
  jungleGreen700: '#3dfddd',
  jungleGreen800: '#7efee8',
  
  jet600: '#505755',
  jet800: '#a6adaa',
  
  eerieBlack600: '#4b484b',
  eerieBlack800: '#a6a2a6'
}
```

## Color Formats

### CSV Format
```csv
4b7672,02b899,272a29,1c1b1c,fbfdfd
```

### Array Format
```javascript
["4b7672","02b899","272a29","1c1b1c","fbfdfd"]
```

### Object Format
```javascript
{
  "Myrtle Green": "4b7672",
  "Jungle green": "02b899", 
  "Jet": "272a29",
  "Eerie black": "1c1b1c",
  "White": "fbfdfd"
}
```

### Extended Color Data
```javascript
[
  {
    "name": "Myrtle Green",
    "hex": "4b7672",
    "rgb": [75,118,114],
    "cmyk": [36,0,3,54],
    "hsb": [174,36,46],
    "hsl": [174,22,38],
    "lab": [47,-16,-3]
  },
  {
    "name": "Jungle green", 
    "hex": "02b899",
    "rgb": [2,184,153],
    "cmyk": [99,0,17,28],
    "hsb": [170,99,72],
    "hsl": [170,98,36],
    "lab": [67,-46,5]
  },
  {
    "name": "Jet",
    "hex": "272a29", 
    "rgb": [39,42,41],
    "cmyk": [7,0,2,84],
    "hsb": [160,7,16],
    "hsl": [160,4,16],
    "lab": [17,-2,0]
  },
  {
    "name": "Eerie black",
    "hex": "1c1b1c",
    "rgb": [28,27,28],
    "cmyk": [0,4,0,89],
    "hsb": [300,4,11],
    "hsl": [300,2,11],
    "lab": [10,1,-1]
  },
  {
    "name": "White",
    "hex": "fbfdfd",
    "rgb": [251,253,253],
    "cmyk": [1,0,0,1],
    "hsb": [180,1,99],
    "hsl": [180,33,99],
    "lab": [99,-1,0]
  }
]
```

### XML Format
```xml
<palette>
  <color name="Myrtle Green" hex="4b7672" r="75" g="118" b="114" />
  <color name="Jungle green" hex="02b899" r="2" g="184" b="153" />
  <color name="Jet" hex="272a29" r="39" g="42" b="41" />
  <color name="Eerie black" hex="1c1b1c" r="28" g="27" b="28" />
  <color name="White" hex="fbfdfd" r="251" g="253" b="253" />
</palette>
```

## Usage in Fi Money App

### Component Examples
```javascript
// Primary Button
backgroundColor: FiColors.jungleGreen,
color: FiColors.white

// Secondary Button  
backgroundColor: FiColors.myrtleGreen,
color: FiColors.white

// Card Background
backgroundColor: FiColors.eerieBlack,
borderColor: FiColors.myrtleGreen600

// Text Hierarchy
color: FiColors.white,           // Primary text
color: FiColors.eerieBlack800,   // Secondary text
color: FiColors.myrtleGreen600,  // Accent text
```

### Plant Growth Progression
- 🌱 **Seedling**: myrtleGreen300 (#2d4744)
- 🌿 **Growing**: myrtleGreen (#4b7672)  
- 🪴 **Mature**: jungleGreen (#02b899)
- 🌳 **Flourishing**: jungleGreen700 (#3dfddd)

---

**Last Updated:** [Current Date]  
**Source:** Fi Money Design System