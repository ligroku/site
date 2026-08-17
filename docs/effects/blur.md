---
title: Blur
description: Gaussian blur effect
---

# Blur

Blur applies a gaussian-style blur to an input image or texture.

## Parameters

| Parameter | Type | Range | Default |
|---|---|---|---|
| Radius | float | 0–100 | 10 |
| Quality | int | 1–8 | 4 |
| Threshold | float | 0–1 | 0 |

## Example

```cpp
auto blur = effects::Blur();

blur.radius = 20.0f;
blur.quality = 4;

blur.process(input, output);
```

## Performance

Higher quality values require more GPU processing.

For real-time applications, a quality of 2–4 is recommended.

## Related

- [Color](./color.md)
- [Feedback](./feedback.md)
