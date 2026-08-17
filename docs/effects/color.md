---
title: Color
description: Color processing effect
---

# Color

Color processing provides common controls for manipulating an image.

Possible operations include:

- hue
- saturation
- brightness
- contrast
- temperature
- tint

## Example

```cpp
auto color = effects::Color();

color.saturation = 1.2f;
color.brightness = 0.8f;

color.process(input, output);
```

> API details are experimental and will change as the effects library develops.
